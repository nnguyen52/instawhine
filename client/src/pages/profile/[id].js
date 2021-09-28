import React, { useEffect, useState } from 'react';
import Info from '../../components/profile/Info';
import Posts from '../../components/profile/Posts';
import { useSelector, useDispatch } from 'react-redux';
import Lottie from 'react-lottie';
import loadingInstaLottie from '../../components/lotties/15016-insta-anim.json';
import { getProfileUsers } from '../../redux/actions/profileAction';
import { useParams } from 'react-router-dom';
import Saved from '../../components/profile/Saved';

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { profile, auth, theme } = useSelector((state) => state);

  const [saveTab, setSaveTab] = useState(false);

  useEffect(() => {
    if (profile.ids.every((item) => item !== id)) {
      dispatch(getProfileUsers({ id, auth }));
    }
  }, [id, auth, dispatch, profile.ids]);

  const lottieDefaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingInstaLottie,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
    isStopped: false,
    isPaused: false,
  };

  return (
    <div className="profile">
      <Info auth={auth} profile={profile} dispatch={dispatch} id={id} />

      {auth.user._id === id && (
        <div className="profile_tab">
          <button className={saveTab ? '' : 'active'} onClick={() => setSaveTab(false)}>
            <i className="fa fa-th" /> Posts
          </button>
          <button className={saveTab ? 'active' : ''} onClick={() => setSaveTab(true)}>
            <i className="far fa-bookmark" /> Saved
          </button>
        </div>
      )}
      {profile.loading ? (
        <Lottie
          style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
          options={lottieDefaultOptions}
          height={200}
          width={200}
        />
      ) : (
        <>
          {saveTab ? (
            <Saved auth={auth} dispatch={dispatch} />
          ) : (
            <Posts auth={auth} profile={profile} dispatch={dispatch} id={id} />
          )}
        </>
      )}
    </div>
  );
};

export default Profile;
