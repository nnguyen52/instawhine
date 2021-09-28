import React from 'react';
import UserCard from '../UserCard';
import { useSelector, useDispatch } from 'react-redux';
import FollowBtn from '../FollowBtn';
import { getSuggestions } from '../../redux/actions/suggestionAction';
import LoadingLottie from '../LoadingLottie';

const RightSideBar = () => {
  const dispatch = useDispatch();
  const { auth, suggestion } = useSelector((state) => state);

  return (
    <div style={{ marginBottom: '4em' }}>
      <UserCard user={auth.user} />
      <div className="d-flex justify-content-between align-items-center my-2">
        <h5 style={{ color: 'rgb(13, 202, 240)' }}>Suggestions for you</h5>
        {!suggestion.loading && (
          <i
            className="fas fa-redo"
            style={{ cursor: 'pointer' }}
            onClick={() => dispatch(getSuggestions(auth.token))}
          />
        )}
      </div>
      {suggestion.loading ? (
        <LoadingLottie />
      ) : (
        <div className="suggestions">
          {suggestion.users.map((user) => {
            return (
              <div style={{ position: 'relative' }} key={user._id}>
                <UserCard user={user} />
                <div style={{ position: 'absolute', top: '1em', right: '50px' }}>
                  <FollowBtn user={user} />
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div
        className="mt-5"
        style={{
          zIndex: -1,
          border: '1px solid rgb(13, 202, 240)',
          borderRadius: '1em',
          boxShadow: '0 0 5px #ddd',
          padding: '1em',
          backgroundColor: '#F1F6FA',
        }}
      >
        <a href="https://github.com/devat-youtuber" target="_blank" rel="noopener noreferrer">
          Original source code from{' '}
          <b style={{ textDecoration: 'underline', wordBreak: 'break-all' }}>Dev A.T Viet Nam</b>
          &nbsp;(senior developer)
        </a>
        <br />
        <p className="mt-2">
          <b>Note: </b>
          This project completely is based on Dev A.T's works and made for the sake of learning and
          experimenting. However, further improvements will be implemented if viable.
        </p>
      </div>
    </div>
  );
};

export default RightSideBar;
