import React from 'react';
import Avatar from '../Avatar';
import { useSelector, useDispatch } from 'react-redux';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';

const Status = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  return (
    <div className="status my-3 d-flex">
      <Avatar src={auth.user.avatar} size="big-avatar" />
      <button
        className="statusBtn flex-fill"
        style={{ marginLeft: '5px' }}
        onClick={() => dispatch({ type: GLOBALTYPES.STATUS, payload: true })}
      >
        {auth.user.userName}, What's on your mind now?
      </button>
    </div>
  );
};

export default Status;
