import { PROFILE_TYPES } from '../actions/profileAction';
import { editData } from '../actions/globalTypes';

const initialState = {
  ids: [],
  loading: false,
  users: [],
  userPosts: [],
  posts: [],
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROFILE_TYPES.LOADING:
      return { ...state, loading: action.payload };
    case PROFILE_TYPES.GET_USER:
      return { ...state, users: [...state.users, action.payload.user] };
    case PROFILE_TYPES.FOLLOW:
      return {
        ...state,
        users: editData(state.users, action.payload._id, action.payload),
      };

    case PROFILE_TYPES.UNFOLLOW:
      return {
        ...state,
        users: editData(state.users, action.payload._id, action.payload),
      };
    case PROFILE_TYPES.GET_ID: {
      return {
        ...state,
        ids: [...state.ids, action.payload],
      };
    }
    case PROFILE_TYPES.GET_POSTS: {
      return {
        ...state,
        posts: [...state.posts, action.payload],
      };
    }
    case PROFILE_TYPES.UPDATE_POST: {
      return {
        ...state,
        posts: editData(state.posts, action.payload._id, action.payload),
      };
    }
    default:
      return state;
  }
};
export default profileReducer;
