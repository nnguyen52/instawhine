import { GLOBALTYPES } from './globalTypes';
import { getDataAPI } from '../../utils/fetchData';

export const DISCOVER_TYPES = {
  LOADING_DISCOVER: 'LOADING_DISCOVER',
  GET_POSTS: 'GET_DISCOVER_POSTS',
  UPDATE_POST: 'UPDATE_DISCOVER_POST',
};

export const getDiscoverPosts =
  ({ auth }) =>
  async (dispatch) => {
    dispatch({ type: DISCOVER_TYPES.LOADING_DISCOVER, payload: true });
    try {
      const res = await getDataAPI('post_discover', auth.token);

      dispatch({ type: DISCOVER_TYPES.GET_POSTS, payload: res.data });

      dispatch({ type: DISCOVER_TYPES.LOADING_DISCOVER, payload: false });
    } catch (err) {
      dispatch({ types: GLOBALTYPES.ALERT, payload: { err: err.response.data.msg } });
    }
  };
