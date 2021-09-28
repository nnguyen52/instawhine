import { POST_TYPES } from '../actions/postAction';
import { editData } from '../actions/globalTypes';

const detailPostReducer = (state = [], action) => {
  switch (action.type) {
    case POST_TYPES.GET_POST: {
      return [...state, action.payload];
    }
    case POST_TYPES.UPDATE_POST: {
      return editData(state, action.payload._id, action.payload);
    }
    default:
      return state;
  }
};

export default detailPostReducer;
