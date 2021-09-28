import { getDataAPI, patchDataAPI } from '../../utils/fetchData';
import { GLOBALTYPES, deleteData } from './globalTypes';
import { imageUpload } from '../../utils/imageUpload';
import { createNotify, removeNotify } from './notifyAction';

export const PROFILE_TYPES = {
  LOADING: 'LOADING_PROFILE',
  GET_USER: 'GET_PROFILE_USER',
  FOLLOW: 'FOLLOW',
  UNFOLLOW: 'UNFOLLOW',
  GET_ID: 'GET_PROFILE_ID',
  GET_POSTS: 'GET_PROFILE_POSTS',
  UPDATE_POST: 'UPDATE_PROFILE_POST',
};

export const getProfileUsers =
  ({ id, auth }) =>
  async (dispatch) => {
    dispatch({ type: PROFILE_TYPES.GET_ID, payload: id });
    try {
      dispatch({ type: PROFILE_TYPES.LOADING, payload: true });

      const res = await getDataAPI(`/user/${id}`, auth.token);
      const res1 = await getDataAPI(`/user_posts/${id}`, auth.token);

      const users = res;
      const posts = res1;

      dispatch({ type: PROFILE_TYPES.GET_USER, payload: users.data });

      dispatch({ type: PROFILE_TYPES.GET_POSTS, payload: { ...posts.data, _id: id, page: 2 } });

      dispatch({ type: PROFILE_TYPES.LOADING, payload: false });
    } catch (err) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } });
    }
  };
export const updateUserProfile =
  ({ userData, avatar, auth }) =>
  async (dispatch) => {
    if (!userData.fullName)
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: 'Please add your full name.' },
      });
    if (userData.fullName.length > 20)
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: 'Full name too long.' },
      });
    if (userData.story.length > 200)
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: 'Story exceeded 200 words.' },
      });
    try {
      let media;
      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
      if (avatar) media = await imageUpload([avatar]);

      const res = await patchDataAPI(
        'user',
        {
          ...userData,
          avatar: avatar ? media[0].url : auth.user.avatar,
        },
        auth.token
      );
      dispatch({
        type: GLOBALTYPES.AUTH,
        payload: {
          ...auth,
          user: { ...auth.user, ...userData, avatar: avatar ? media[0].url : auth.user.avatar },
        },
      });
      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
    } catch (err) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } });
    }
  };

export const follow =
  ({ users, user, auth, socket }) =>
  async (dispatch) => {
    let newUser;
    /**
     * NOTE: when visit any user => trigger GET_USER
     * => followers and following get populated
     * but when follow or unfollow indrectly (in userCard) => not trigger GET_USER
     */

    //add me to stranger followers' list.

    //this if statement run when user follow people via userCard
    //since they dont visit stranger page directly
    //=>not trigger GET_USER
    //profile.users dont have stranger prefernce
    if (users.every((item) => item._id !== user._id)) {
      newUser = { ...user, followers: [...user.followers, auth.user] };
    } else {
      //else loop thru each stranger
      //if in-loop stranger is current stranger
      //=> add me to current in-loop stranger
      users.forEach((item) => {
        if (item._id === user._id) {
          newUser = { ...item, followers: [...item.followers, auth.user] };
        }
      });
    }
    //add me to stranger followers' list.
    dispatch({ type: PROFILE_TYPES.FOLLOW, payload: newUser });

    // add stranger to my list
    dispatch({
      type: GLOBALTYPES.AUTH,
      payload: { ...auth, user: { ...auth.user, following: [...auth.user.following, newUser] } },
    });

    try {
      const res = await patchDataAPI(`user/${user._id}/follow`, null, auth.token);

      socket.emit('follow', res.data.newUser);
      // Notify
      const msg = {
        id: auth.user._id,
        text: 'has started following you!',
        recipients: [newUser._id],
        url: `/profile/${auth.user._id}`,
      };

      dispatch(createNotify({ msg, auth, socket }));
    } catch (err) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } });
    }
  };

export const unfollow =
  ({ users, user, auth, socket }) =>
  async (dispatch) => {
    let newUser;
    //same logic like follow (but use deleteData function);
    if (users.every((item) => item._id !== user._id)) {
      newUser = { ...user, followers: deleteData(user.followers, auth.user._id) };
    } else {
      users.forEach((item) => {
        if (item._id === user._id) {
          newUser = { ...item, followers: deleteData(user.followers, auth.user._id) };
        }
      });
    }

    //remove me from stranger's follower list
    dispatch({ type: PROFILE_TYPES.UNFOLLOW, payload: newUser });

    //remove stranger to my list
    dispatch({
      type: GLOBALTYPES.AUTH,
      payload: {
        ...auth,
        user: {
          ...auth.user,
          following: deleteData(auth.user.following, newUser._id),
        },
      },
    });

    try {
      const res = await patchDataAPI(`user/${user._id}/unfollow`, null, auth.token);
      socket.emit('unfollow', res.data.newUser);

      dispatch({ type: GLOBALTYPES.ALERT, payload: { msg: res.data.msg } });

      // Notify
      const msg = {
        id: auth.user._id,
        text: 'unfollowed you.',
        recipients: [newUser._id],
        url: `/profile/${newUser._id}`,
      };

      dispatch(removeNotify({ msg, auth, socket }));
    } catch (err) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } });
    }
  };
