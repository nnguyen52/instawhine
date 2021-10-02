import React from 'react';
import Avatar from './Avatar';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
const UserCard = ({
  children,
  user,
  handleClose,
  setShowFollowers,
  setShowFollowing,
  msg,
  customStyle,
}) => {
  const { theme } = useSelector((state) => state);
  const handleCloseAll = () => {
    if (handleClose) handleClose();
    //when close , if these still open => set to close.
    if (setShowFollowers) setShowFollowers(false);
    if (setShowFollowing) setShowFollowing(false);
  };

  const showMsg = (user) => {
    return (
      <>
        <div style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}>
          <div>{user.text}</div>
          {user.media.length > 0 && (
            <div>
              {user.media && user.media.length} <i className="fas fa-image" />
            </div>
          )}
          {user.call && (
            <span className="material-icons">
              {user.call.times === 0
                ? user.call.video
                  ? 'videocam_off'
                  : 'phone_disabled'
                : user.call.video
                ? 'video_camera_front'
                : 'call'}
            </span>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="d-flex p-2 justify-content-between align-items-center w-100 ">
      <Link
        style={{ textDecoration: 'none', width: '100%' }}
        to={`/profile/${user._id}`}
        className={`row p-2 userCard `}
        onClick={handleCloseAll}
      >
        <div className="col-3">
          <Avatar src={user.avatar} size="big-avatar" />
        </div>
        <div
          className="col-9"
          // style={{
          //   transform:
          //     customStyle && window.innerWidth <= 768
          //       ? 'translateX(-18%)'
          //       : customStyle && window.innerWidth >= 1080
          //       ? 'translateX(-22%)'
          //       : '',
          // }}
        >
          <div className="content">
            <span>{user.userName}</span> <br />
            <small style={{ opacity: '.7', filter: theme ? 'invert(1)' : 'invert(0)' }}>
              {msg ? showMsg(user) : user.fullName}
            </small>
          </div>
        </div>
      </Link>
      {children}
    </div>
  );
};

export default UserCard;
