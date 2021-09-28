import React, { useState, useEffect } from 'react';
import Avatar from '../Avatar';
import EditProfile from './EditProfile';
import FollowBtn from '../FollowBtn';
import Followers from './Followers';
import Following from './Following';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';

const Info = ({ id, auth, profile, dispatch }) => {
  const [userData, setUserData] = useState([]);

  const [onEdit, setOnEdit] = useState(false);

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  //if visit personal profile => set user via auth redux store
  //if visit strangers' profile => get id from param =>
  //loading:true
  //fetch that user (NEED token for api call)
  //set user as user fetched.
  //loading false

  useEffect(() => {
    if (id === auth.user._id) {
      setUserData([auth.user]);
    } else {
      const newData = profile.users.filter((user) => user._id === id);
      setUserData(newData);
    }
  }, [id, auth, dispatch, profile.users]);

  useEffect(() => {
    if (showFollowers || showFollowing || onEdit) {
      dispatch({ type: GLOBALTYPES.MODAL, payload: true });
    } else {
      dispatch({ type: GLOBALTYPES.MODAL, payload: false });
    }
  }, [showFollowing, showFollowers, onEdit, dispatch]);
  return (
    <div className="info">
      {userData.map((user, index) => {
        return (
          <div className="info_container" key={index}>
            <Avatar src={user.avatar} size="super-avatar" />
            <div className="info_content">
              <div className="info_content_title">
                <h2>{user.userName}</h2>
                {user._id === auth.user._id ? (
                  <button className="btn btn-outline-info" onClick={() => setOnEdit(true)}>
                    Edit Profile
                  </button>
                ) : (
                  <FollowBtn user={user} />
                )}
              </div>
              <div className="follow_btn">
                <span onClick={() => setShowFollowers(true)} style={{ cursor: 'pointer' }}>
                  {user.followers.length} Followers
                </span>
                <span onClick={() => setShowFollowing(true)} style={{ cursor: 'pointer' }}>
                  {user.following.length} Following
                </span>
              </div>
              <h6>
                {user.fullName} T: <span className="text-danger">{user.mobile}</span>
              </h6>
              <p>{user.address}</p>
              <h6>{user.email}</h6>
              <a href={user.website} target="_blank" rel="noreferrer">
                {user.website}
              </a>
              <p>{user.story}</p>
            </div>

            {onEdit && <EditProfile setOnEdit={setOnEdit} />}

            {showFollowers && (
              <Followers users={user.followers} setShowFollowers={setShowFollowers} />
            )}
            {showFollowing && (
              <Following users={user.following} setShowFollowing={setShowFollowing} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Info;
