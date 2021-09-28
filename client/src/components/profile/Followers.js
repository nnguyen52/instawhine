import React from 'react';
import UserCard from '../UserCard';
import { useSelector } from 'react-redux';
import FollowBtn from '../FollowBtn';

const Followers = ({ users, setShowFollowers }) => {
  const { auth } = useSelector((state) => state);
  return (
    <div className="follow">
      <div className="follow-box">
        <h5>Followers</h5>
        <br />
        {users &&
          users.map((user) => {
            return (
              <div className="followers_user_card" key={user._id}>
                <UserCard user={user} key={user._id} setShowFollowers={setShowFollowers}>
                  {auth.user._id !== user._id && <FollowBtn user={user} />}
                </UserCard>
              </div>
            );
          })}
        <div className="close" onClick={() => setShowFollowers(false)}>
          &times;
        </div>
      </div>
    </div>
  );
};

export default Followers;
