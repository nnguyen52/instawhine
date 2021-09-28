import { editData, deleteData, GLOBALTYPES } from './globalTypes';
import { POST_TYPES } from './postAction';
import { deleteDataAPI, patchDataAPI, postDataAPI } from '../../utils/fetchData';
import { createNotify, removeNotify } from './notifyAction';

export const createComment = (post, newComment, auth, socket) => async (dispatch) => {
  const newPost = { ...post, comments: [...post.comments, newComment] };
  dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
  try {
    const data = { ...newComment, postId: post._id, postUserId: post.user._id };
    const res = await postDataAPI('comment', data, auth.token);
    const newData = { ...res.data.newComment, user: auth.user };
    const newPost = { ...post, comments: [...post.comments, newData] };

    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });

    socket.emit('createComment', newPost);

    // Notify
    const msg = {
      id: res.data.newComment._id,
      text: newComment.reply ? 'mentioned you in a comment!' : 'has commented on your post!',
      recipients: newComment.reply ? [newComment.tag._id] : [post.user._id],
      url: `/post/${post._id}`,
      content: post.content,
      image: post.images[0].url,
    };
    dispatch(createNotify({ msg, auth, socket }));
  } catch (err) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } });
  }
};
export const updateComment =
  ({ comment, post, content, auth, socket }) =>
  async (dispatch) => {
    const newComments = editData(post.comments, comment._id, { ...comment, content });
    const newPost = { ...post, comments: newComments };

    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
    try {
      await patchDataAPI(`comment/${comment._id}`, { content }, auth.token);
      socket.emit('updateComment', newPost);
    } catch (err) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } });
    }
  };
export const likeComment =
  ({ comment, post, auth, socket }) =>
  async (dispatch) => {
    const newComment = { ...comment, likes: [...comment.likes, auth.user] };
    const newComments = editData(post.comments, comment._id, newComment);

    const newPost = { ...post, comments: newComments };
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });

    try {
      await patchDataAPI(`comment/${comment._id}/like`, null, auth.token);
      socket.emit('likeComment', newPost);
    } catch (err) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } });
    }
  };

export const unlikeComment =
  ({ comment, post, auth, socket }) =>
  async (dispatch) => {
    const newComment = {
      ...comment,
      likes: deleteData(comment.likes, auth.user._id),
    };

    const newComments = editData(post.comments, comment._id, newComment);

    const newPost = { ...post, comments: newComments };
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });

    try {
      await patchDataAPI(`comment/${comment._id}/unlike`, null, auth.token);
      socket.emit('unlikeComment', newPost);
    } catch (err) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } });
    }
  };

export const deleteComment =
  ({ comment, post, auth, socket }) =>
  async (dispatch) => {
    //get comment itself and children comments (if the comment is parent)
    //by checking if children comments'reply value is the parent id
    const deletedArr = [...post.comments.filter((cm) => cm.reply === comment._id), comment];

    const newPost = {
      ...post,
      comments: post.comments.filter((cm) => !deletedArr.find((da) => cm._id === da._id)),
    };

    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });

    try {
      deletedArr.forEach(async (item) => {
        await deleteDataAPI(`comment/${item._id}`, auth.token);
        socket.emit('deleteComment', newPost);

        // Notify
        const msg = {
          id: item._id,
          text: comment.reply ? 'mentioned you in a comment!' : 'has commented on your post!',
          recipients: comment.reply ? [comment.tag._id] : [post.user._id],
          url: `/post/${post._id}`,
          content: post.content,
          image: post.images[0].url,
        };
        dispatch(removeNotify({ msg, auth, socket }));
      });
    } catch (err) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } });
    }
  };
