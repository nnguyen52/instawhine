import { GLOBALTYPES } from '../actions/globalTypes';

export const CALL_TYPES = {};

const callReducer = (state = null, action) => {
  switch (action.type) {
    case GLOBALTYPES.CALL: {
      return action.payload;
    }
    default:
      return state;
  }
};

export default callReducer;
