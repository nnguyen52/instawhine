import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { POST_TYPES } from '../../redux/actions/postAction';
import { getDataAPI } from '../../utils/fetchData';
import LoadingLottie from '../LoadingLottie';
import LoadMoreBtn from '../LoadMoreBtn';
import PostCard from '../PostCard';

const Posts = () => {
  const dispatch = useDispatch();
  const { homePosts, auth, theme } = useSelector((state) => state);
  const [load, setLoad] = useState(false);

  const handleLoadMore = async () => {
    setLoad(true);
    const res = await getDataAPI(`posts?limit=${homePosts.page * 9}`, auth.token);
    dispatch({ type: POST_TYPES.GET_POSTS, payload: { ...res.data, page: homePosts.page + 1 } });
    setLoad(false);
  };

  return (
    <div className="posts">
      {homePosts.posts.map((post) => {
        return <PostCard post={post} key={post._id} theme={theme} />;
      })}
      {load && <LoadingLottie />}

      {!load && (
        <LoadMoreBtn
          result={homePosts.result}
          page={homePosts.page}
          load={load}
          handleLoadMore={handleLoadMore}
        />
      )}
      <br />
    </div>
  );
};

export default Posts;
