import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UserCard from '../UserCard';
import { useParams, useHistory } from 'react-router-dom';
import MsgDisplay from './MsgDisplay';
import '../../styles/message.css';
import Icons from '../Icons';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { imageShow, videoShow } from '../../utils/mediaShow';
import { imageUpload } from '../../utils/imageUpload';
import {
  addMessage,
  deleteConversation,
  getMessages,
  loadMoreMessages,
} from '../../redux/actions/messageAction';
import LoadingLottie from '../LoadingLottie';

const RightSide = () => {
  const history = useHistory();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { theme, auth, message, socket, peer } = useSelector((state) => state);

  const [user, setUser] = useState([]);
  const [text, setText] = useState('');

  const refDisplay = useRef();
  const pageEnd = useRef();
  const [page, setPage] = useState(0);

  const [data, setData] = useState([]);
  const [result, setResult] = useState(9);
  const [isLoadMore, setIsLoadMore] = useState(false);

  useEffect(() => {
    // find data in message pool
    const newData = message.data.find((item) => item._id === id);
    if (newData) {
      setData(newData.messages);
      setResult(newData.result);
      setPage(newData.page);
    }
  }, [message.data, id]);

  useEffect(() => {
    if (id && message.users.length > 0) {
      setTimeout(() => {
        refDisplay.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 50);
      const newUser = message.users.find((user) => user._id === id);
      if (newUser) {
        setUser(newUser);
      }
    }
  }, [message.users, id]);

  useEffect(() => {
    //find the recipients' messages immediately when rightside render
    const getMessagesData = async () => {
      if (message.data.every((item) => item._id !== id)) {
        await dispatch(getMessages({ auth, id }));
        setTimeout(() => {
          refDisplay.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 50);
      }
    };
    getMessagesData();
  }, [id, dispatch, auth, message.data]);

  //   media:
  const [media, setMedia] = useState([]);
  const [loadMedia, setLoadMedia] = useState(false);

  const handleChangeMedia = (e) => {
    const files = [...e.target.files];
    let err = '';
    let newMedia = [];

    files.forEach((file) => {
      if (!file) return (err = 'File does not exist.');
      if (file.size > 1024 * 1024 * 5) return (err = 'The largest media size is 5mb.');
      return newMedia.push(file);
    });
    if (err.length > 0) {
      return dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } });
    }
    return setMedia([...media, ...newMedia]);
  };

  const handleDeleteMedia = (index) => {
    const newArr = [...media];
    newArr.splice(index, 1);
    setMedia(newArr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && media.length === 0) {
      return;
    }
    setText('');
    setMedia([]);
    setLoadMedia(true);

    let newArr = [];
    if (media.length > 0) {
      // check media
      newArr = await imageUpload(media);
    }
    const msg = {
      sender: auth.user._id,
      recipient: id,
      text,
      media: newArr,
      createdAt: new Date().toISOString(),
    };
    setLoadMedia(false);
    dispatch(addMessage({ msg, auth, socket }));
    if (refDisplay.current) {
      refDisplay.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  //load more
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsLoadMore((p) => p + 1);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(pageEnd.current);
  }, [setIsLoadMore]);

  useEffect(() => {
    if (isLoadMore > 1) {
      if (result >= page * 9) {
        dispatch(loadMoreMessages({ auth, id, page: page + 1 }));
        setIsLoadMore(1);
      }
    }
    // eslint-disable-next-line
  }, [isLoadMore]);

  //scroll to bottom
  useEffect(() => {
    if (refDisplay.current) {
      refDisplay.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [text]);

  const handleDeleteConversation = () => {
    if (window.confirm('Do you want to delete this conversation (permanently) ?')) {
      dispatch(deleteConversation({ auth, id }));
      history.push(`/message`);
    }
  };

  //call
  const caller = ({ video }) => {
    const { _id, userName, fullName, avatar } = user;
    const msg = {
      sender: auth.user._id,
      recipient: _id,
      avatar,
      userName,
      fullName,
      video,
    };
    dispatch({ type: GLOBALTYPES.CALL, payload: msg });
  };
  const handlePhoneCall = () => {
    caller({ video: false });
    callUser({ video: false });
  };
  const handleVideoCall = () => {
    caller({ video: true });
    callUser({ video: true });
  };

  //peer calling
  const callUser = ({ video }) => {
    const { _id, avatar, userName, fullName } = auth.user;
    const msg = {
      sender: _id,
      recipient: user._id,
      avatar,
      userName,
      fullName,
      video,
    };
    if (peer.open) {
      msg.peerId = peer._id;
    }
    socket.emit('callUser', msg);
  };
  return (
    <>
      <div className="message_header" style={{ cursor: 'pointer' }}>
        {user.length !== 0 && (
          <>
            <UserCard user={user} customStyle={true} className="userCard_rightsidebar">
              <i className="fas fa-phone-alt" onClick={handlePhoneCall} />
              <i className="fas fa-video mx-3" onClick={handleVideoCall} />
              <i className="fas fa-trash text-danger" onClick={handleDeleteConversation} />
            </UserCard>
          </>
        )}
      </div>
      <div
        className="chat_container"
        style={{ height: media.length > 0 ? 'calc(100% - 180px)' : '' }}
      >
        <div className="chat_display" ref={refDisplay}>
          <button style={{ marginTop: '-25px', opacity: 0 }} ref={pageEnd}>
            Load more
          </button>
          {data &&
            data.map((msg, index) => {
              return (
                <div key={index}>
                  {msg.sender !== auth.user._id && (
                    <div className="chat_row other_message">
                      <MsgDisplay user={user} msg={msg} theme={theme} />
                    </div>
                  )}
                  {msg.sender === auth.user._id && (
                    <div className="chat_row you_message">
                      <MsgDisplay user={auth.user} msg={msg} theme={theme} data={data} />
                    </div>
                  )}
                </div>
              );
            })}
          {loadMedia && <LoadingLottie />}
        </div>
      </div>
      <div className="show_media" style={{ display: media.length > 0 ? 'grid' : 'none' }}>
        {media.map((item, index) => {
          return (
            <div key={index} id="file_media">
              {item.type.match(/video/i)
                ? videoShow(URL.createObjectURL(item), theme)
                : imageShow(URL.createObjectURL(item), theme)}
              <span onClick={() => handleDeleteMedia(index)}>&times;</span>
            </div>
          );
        })}
      </div>
      <form className="chat_input" onSubmit={handleSubmit}>
        <input
          style={{
            filter: theme ? 'invert(1)' : 'invert(0)',
            background: theme ? 'black' : '',
            color: theme ? 'white' : '',
          }}
          type="text"
          placeholder="Send message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Icons setContent={setText} content={text} theme={theme} />
        <div className="file_upload">
          <i className="fas fa-image text-danger" />

          <input
            multiple
            type="file"
            name="file"
            id="file"
            accept="image/*,video/*"
            onChange={handleChangeMedia}
          />
        </div>
        <button
          type="submit"
          className="material-icons"
          disabled={text || media.length > 0 ? false : true}
        >
          near_me
        </button>
      </form>
    </>
  );
};

export default RightSide;
