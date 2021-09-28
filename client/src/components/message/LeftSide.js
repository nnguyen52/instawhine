import React, { useState, useEffect, useRef } from 'react';
import UserCard from '../UserCard';
import { useSelector, useDispatch } from 'react-redux';
import { getDataAPI } from '../../utils/fetchData';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { useHistory, useParams } from 'react-router-dom';

import { getConversations, MESS_TYPES } from '../../redux/actions/messageAction';

const LeftSide = () => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { auth, message, online } = useSelector((state) => state);

  const [search, setSearch] = useState('');
  const [searchusers, setSearchUsers] = useState([]);

  const pageEnd = useRef();
  const [page, setPage] = useState(1);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) {
      return setSearchUsers([]);
    }
    try {
      const res = await getDataAPI(`search?username=${search}`, auth.token);
      setSearchUsers(res.data.users);
    } catch (err) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } });
    }
  };

  const handleAddUser = (user) => {
    setSearch('');
    setSearchUsers([]);
    dispatch({ type: MESS_TYPES.ADD_USER, payload: { ...user, text: '', media: [] } });
    dispatch({ type: MESS_TYPES.CHECK_USER_OFFLINE, payload: online });
    return history.push(`/message/${user._id}`);
  };

  const isActive = (user) => {
    if (id === user._id) return 'active';
    return '';
  };

  useEffect(() => {
    if (message.firstLoad) return;
    dispatch(getConversations({ auth }));
  }, [dispatch, auth, message.firstLoad]);

  //load more
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(pageEnd.current);
  }, [setPage]);

  useEffect(() => {
    if (message.resultUsers >= (page - 1) * 9 && page > 1) {
      dispatch(getConversations({ auth, page }));
    }
  }, [message.resultUsers, page, auth, dispatch]);

  // check user online-offline
  useEffect(() => {
    if (message.firstLoad) {
      dispatch({ type: MESS_TYPES.CHECK_USER_OFFLINE, payload: online });
    }
  }, [online, message.firstLoad, dispatch]);

  return (
    <>
      <form className="message_header" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ textIndent: '5px' }}
        />
        <button type="submit" style={{ display: 'none' }}>
          Search
        </button>
      </form>

      <div className="message_chat_list">
        <div>
          {searchusers.length !== 0 ? (
            <>
              {searchusers.map((user, index) => {
                return (
                  <div
                    key={index}
                    className={`message_user ${isActive(user)}`}
                    onClick={(e) => handleAddUser(user)}
                  >
                    <UserCard user={user} />
                  </div>
                );
              })}
            </>
          ) : (
            <>
              {message.users.map((user, index) => {
                return (
                  <div
                    key={index}
                    className={`message_user ${isActive(user)}`}
                    onClick={(e) => handleAddUser(user)}
                  >
                    <UserCard user={user} msg={true}>
                      {user.online ? (
                        <i className="fas fa-circle text-success" />
                      ) : (
                        auth.user.following.find((item) => item._id === user._id) && (
                          <i className="fas fa-circle" />
                        )
                      )}
                    </UserCard>
                  </div>
                );
              })}
            </>
          )}
          <button ref={pageEnd} style={{ opacity: 0 }}>
            Load more
          </button>
        </div>
      </div>
    </>
  );
};

export default LeftSide;
