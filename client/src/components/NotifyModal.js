import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Avatar from './Avatar';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { deleteAllNotifies, isReadNotify, NOTIFY_TYPES } from '../redux/actions/notifyAction';

export const pikachuImg = require('../images/pikachu.png');

const NotifyModal = () => {
  const dispatch = useDispatch();
  const { auth, notify, theme } = useSelector((state) => state);

  const handleIsRead = (msg) => {
    dispatch(isReadNotify({ msg, auth }));
  };

  const handleSound = (sound) => {
    dispatch({ type: NOTIFY_TYPES.UPDATE_SOUND, payload: sound });
  };

  const handleDeleteAllNotifies = () => {
    const newArr = notify.data.filter((item) => item.isRead === false);
    if (newArr.length === 0) {
      return dispatch(deleteAllNotifies(auth.token));
    }
    if (window.confirm(`A friendly reminder: You have ${newArr.length} notifications unread. 😗`)) {
      return dispatch(deleteAllNotifies(auth.token));
    }
  };
  return (
    <div style={{ minWidth: '300px' }} className="notify_modal">
      <div className="d-flex justify-content-between align-items-center px-2">
        <h3>Notification</h3>
        {notify.sound || localStorage.getItem('Instawhine_notification') === 'true' ? (
          <i
            className="fas fa-bell text-danger"
            style={{ fontSize: '1.2rem', cursor: 'pointer' }}
            onClick={() => handleSound(false)}
          />
        ) : (
          <i
            className="fas fa-bell-slash text-danger"
            style={{ fontSize: '1.2rem', cursor: 'pointer' }}
            onClick={() => handleSound(true)}
          />
        )}
      </div>
      <hr className="mt-0" />
      {notify.data.length === 0 && (
        <div
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <img
            src={pikachuImg.default}
            alt="no notification img"
            style={{ width: '250px', height: '200px', filter: theme ? 'invert(10' : 'invert(0)' }}
          />
          <span style={{ position: 'absolute', top: '50px', left: 0 }} className="ml-2">
            <h6
              style={{ filter: theme ? 'invert(1)' : 'invert(0)', color: theme ? 'white' : '#111' }}
            >
              No new inboxes!😪
            </h6>
          </span>
        </div>
      )}
      <div
        style={{ height: '100%', maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}
        className="notify_data"
      >
        {notify.data.map((msg, index) => {
          return (
            <div key={index} className="px-2 mb-3">
              <Link
                to={`${msg.url}`}
                className="d-flex text-dark align-items-center"
                onClick={() => handleIsRead(msg)}
              >
                <Avatar src={msg.user.avatar} size="big-avatar" />
                <div className="mx-1 flex-fill">
                  <div>
                    <strong className="mr-1">{msg.user.userName}</strong>
                    <span>{msg.text}</span>
                  </div>
                  {msg.content && <small>{msg.content.slice(0, 20)}...</small>}
                </div>
                {msg.image && (
                  <div style={{ width: '30px' }}>
                    {msg.image.match(/video/i) ? (
                      <video src={msg.image} width="100%" />
                    ) : (
                      <Avatar src={msg.image} size="medium-avatar" />
                    )}
                  </div>
                )}
              </Link>
              <small className="text-muted d-flex justify-content-between mx-2 align-items-center">
                {moment(msg.createdAt).fromNow()}
                {!msg.isRead && <i className="fas fa-circle text-primary " />}
              </small>
            </div>
          );
        })}
      </div>
      <hr className="my-1" />
      <div
        className="text-right text-danger mr-2"
        style={{ cursor: 'pointer' }}
        onClick={handleDeleteAllNotifies}
      >
        Delete all
      </div>
    </div>
  );
};

export default NotifyModal;
