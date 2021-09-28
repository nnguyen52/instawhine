import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { POST_TYPES } from './redux/actions/postAction';
import { GLOBALTYPES } from './redux/actions/globalTypes';
import { NOTIFY_TYPES } from './redux/actions/notifyAction';
import messengerSound from './sounds/messenger.mp3';

import { MESS_TYPES } from './redux/actions/messageAction';

const spawnNotification = (body, icon, url, title) => {
  let options = { body, icon };
  let n = new Notification(title, options);

  n.onClick = (e) => {
    e.preventDefault();
    window.open(url, '_blank');
  };
};

const SocketClient = () => {
  const dispatch = useDispatch();
  const { auth, socket, notify, online, call } = useSelector((state) => state);

  const audioRef = useRef();

  // join user
  useEffect(() => {
    socket.emit('joinUser', auth.user);
  }, [socket, auth.user]);

  // likes
  useEffect(() => {
    socket.on('likeToClient', (newPost) => {
      dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
    });
    return () => socket.off('likeToClient');
  }, [socket, dispatch]);

  // unlikes
  useEffect(() => {
    socket.on('unlikeToClient', (newPost) => {
      dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
    });
    return () => socket.off('unlikeToClient');
  }, [socket, dispatch]);

  // createComment
  useEffect(() => {
    socket.on('createCommentToClient', (newPost) => {
      dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
    });
    return () => socket.off('createCommentToClient');
  }, [socket, dispatch]);

  // createComment
  useEffect(() => {
    socket.on('deleteCommentToClient', (newPost) => {
      dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
    });
    return () => socket.off('deleteCommentToClient');
  }, [socket, dispatch]);

  // like comment
  useEffect(() => {
    socket.on('likeCommentToClient', (newPost) => {
      dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
    });
    return () => socket.off('likeCommentToClient');
  }, [socket, dispatch]);

  // unlike comment
  useEffect(() => {
    socket.on('unlikeCommentToClient', (newPost) => {
      dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
    });
    return () => socket.off('unlikeCommentToClient');
  }, [socket, dispatch]);

  // update comment
  useEffect(() => {
    socket.on('updateCommentToClient', (newPost) => {
      dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
    });
    return () => socket.off('updateCommentToClient');
  }, [socket, dispatch]);

  // follow
  useEffect(() => {
    socket.on('followToClient', (newUser) => {
      dispatch({ type: GLOBALTYPES.AUTH, payload: { ...auth, user: newUser } });
    });
    return () => socket.off('followToClient');
  }, [socket, dispatch, auth]);

  // unfollow
  useEffect(() => {
    socket.on('unfollowToClient', (newUser) => {
      dispatch({ type: GLOBALTYPES.AUTH, payload: { ...auth, user: newUser } });
    });
    return () => socket.off('unfollowToClient');
  }, [socket, dispatch, auth]);

  // notification
  useEffect(() => {
    socket.on('createNotifyToClient', (msg) => {
      dispatch({ type: NOTIFY_TYPES.CREATE_NOTIFY, payload: msg });
      if (notify.sound) {
        audioRef.current.play();
      }
      spawnNotification(msg.user.userName + ' ' + msg.text, msg.user.avatar, msg.url, 'Instawhine');
    });
    return () => socket.off('createNotifyToClient');
  }, [socket, dispatch, notify.sound]);

  useEffect(() => {
    socket.on('removeNotifyToCilent', (msg) => {
      dispatch({ type: NOTIFY_TYPES.REMOVE_NOTIFY, payload: msg });
    });
    return () => socket.off('removeNotifyToCilent');
  }, [socket, dispatch]);

  // message
  useEffect(() => {
    socket.on('addMessageToClient', (msg) => {
      dispatch({ type: MESS_TYPES.ADD_MESSAGE, payload: msg });

      //show incoming user in left side immediately
      dispatch({
        type: MESS_TYPES.ADD_USER,
        payload: { ...msg.user, text: msg.text, media: msg.media },
      });
    });
    return () => socket.off('addMessageToClient');
  }, [socket, dispatch]);

  // check user online/offline
  useEffect(() => {
    socket.emit('checkUserOnline', auth.user);
  }, [socket, auth.user]);

  useEffect(() => {
    socket.on('checkUserOnlineToMe', (data) => {
      data.forEach((item) => {
        if (!online.includes(item.id)) {
          dispatch({ type: GLOBALTYPES.ONLINE, payload: item.id });
        }
      });
    });
    return () => socket.off('checkUserOnlineToMe');
  }, [socket, dispatch, online]);

  useEffect(() => {
    socket.on('checkUserOnlineToClient', (id) => {
      if (!online.includes(id)) {
        dispatch({ type: GLOBALTYPES.ONLINE, payload: id });
      }
    });
    return () => socket.off('checkUserOnlineToClient');
  }, [socket, dispatch, online]);

  // check user offline
  useEffect(() => {
    socket.on('checkUserOffline', (id) => {
      dispatch({ type: GLOBALTYPES.OFFLINE, payload: id });
    });
    return () => socket.off('checkUserOffline');
  }, [socket, dispatch]);

  // call user
  useEffect(() => {
    socket.on('callUserToClient', (data) => {
      dispatch({ type: GLOBALTYPES.CALL, payload: data });
    });
    return () => socket.off('callUserToClient');
  }, [socket, dispatch]);

  // listen busy call
  useEffect(() => {
    socket.on('userBusy', (data) => {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: `${data.userName} is busy. Please call later!` },
      });
    });
    return () => socket.off('userBusy');
  }, [socket, dispatch, call]);

  // end call
  useEffect(() => {
    socket.on('endCallToClient', (data) => {
      dispatch({ type: GLOBALTYPES.CALL, payload: null });
    });
    return () => socket.off('endCallToClient');
  }, [socket, dispatch]);
  return (
    <>
      <audio ref={audioRef} controls style={{ display: 'none' }}>
        <source src={messengerSound} type="audio/mp3" />
      </audio>
    </>
  );
};

export default SocketClient;
