import React from 'react';
import { useSelector } from 'react-redux';
import Status from '../components/home/Status';
import Posts from '../components/home/Posts';
import Loading from '../components/LoadingLottie';
import RightSideBar from '../components/home/RightSideBar';

const Home = () => {
  const { homePosts } = useSelector((state) => state);

  return (
    <div className="home row mx-0">
      <div className="col-md-8">
        <Status />
        {homePosts.loading ? (
          <>
            <Loading />
          </>
        ) : homePosts.result === 0 && homePosts.posts.length === 0 ? (
          <div>
            <h6> Lets share something! Your feed is empty...</h6>
          </div>
        ) : (
          <>
            <Posts />
          </>
        )}
      </div>
      <div className="col-md-4">
        <RightSideBar />
      </div>
    </div>
  );
};

export default Home;
