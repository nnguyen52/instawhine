import { getDataAPI } from '../../utils/fetchData';
import { GLOBALTYPES } from './globalTypes';

export const SUGGESTION_TYPES = {
  LOADING: 'LOADING_SUGGES',
  GET_USERS: 'GET_USERS_SUGGES',
};

export const getSuggestions = (token) => async (dispatch) => {
  try {
    dispatch({ type: SUGGESTION_TYPES.LOADING, payload: true });

    const res = await getDataAPI('suggestionsUser', token);
    dispatch({ type: SUGGESTION_TYPES.GET_USERS, payload: res.data });

    dispatch({ type: SUGGESTION_TYPES.LOADING, payload: false });
  } catch (err) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { err: err.response.data.msg } });
  }
};
