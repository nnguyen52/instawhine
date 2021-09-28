import React from 'react';
import Avatar from '../Avatar';
import { imageShow, videoShow } from '../../utils/mediaShow';
import { useSelector, useDispatch } from 'react-redux';
import { deleteMessages } from '../../redux/actions/messageAction';
import Times from './Times';

const MsgDisplay = ({ user, msg, theme, data }) => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const handleDeleteMessage = () => {
    if (!data) return;
    if (data) {
      if (window.confirm('Do you want to delete this message (permanently)?'))
        dispatch(deleteMessages({ msg, data, auth }));
    }
  };

  return (
    <>
      <div className="chat_title">
        <Avatar src={user.avatar} size="small-avatar" />
        <span>{user.userName}</span>
      </div>
      <div className="you_content">
        {user._id === auth.user._id && (
          <i className="fas fa-trash text-danger" onClick={() => handleDeleteMessage(msg)} />
        )}
        <div>
          {msg.text && (
            <div className="chat_text" style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}>
              {msg.text}
            </div>
          )}
          {msg.media.map((item, index) => {
            return (
              <div key={index} id="file_media">
                {item.url.match(/video/i) ? videoShow(item.url, theme) : imageShow(item.url, theme)}
              </div>
            );
          })}
        </div>

        {msg.call && (
          <button
            className="d-flex btn align-items-center py-3"
            style={{ background: '#eee', borderRadius: '10px' }}
          >
            <span
              className="material-icons font-weight-bold mr-1"
              style={{
                fontSize: '2.5rem',
                color: msg.call.times === 0 ? 'crimson' : 'green',
                filter: theme ? 'invert(1)' : 'invert(0)',
              }}
            >
              {msg.call.times === 0
                ? msg.call.video
                  ? 'videocam_off'
                  : 'phone_disabled'
                : msg.call.video
                ? 'video_camera_front'
                : 'call'}
            </span>
            <div className="text-left">
              <h6>{msg.call.video ? 'Video Call' : 'Audio Call'}</h6>
              <small>
                {msg.call.times > 0 ? (
                  <Times total={msg.call.times} />
                ) : (
                  new Date(msg.call.times).toLocaleTimeString()
                )}
              </small>
            </div>
          </button>
        )}
      </div>
      <div className="chat_time">{new Date(msg.createdAt).toLocaleString()}</div>
    </>
  );
};

export default MsgDisplay;
