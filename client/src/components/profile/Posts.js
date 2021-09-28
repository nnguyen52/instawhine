import React, { useState, useEffect } from 'react';
import LoadingLottie from '../LoadingLottie';
import LoadMoreBtn from '../LoadMoreBtn';
import PostThumb from '../PostThumb';
import { getDataAPI } from '../../utils/fetchData';
import { PROFILE_TYPES } from '../../redux/actions/profileAction';

const Posts = ({ auth, profile, dispatch, id }) => {
  const [posts, setPosts] = useState([]);
  const [result, setResult] = useState(9);

  const [page, setPage] = useState(0);
  const [load, setLoad] = useState(false);

  const handleLoadMore = async () => {
    setLoad(true);
    const res = await getDataAPI(`user_posts/${id}?limit=${page * 9}`, auth.token);
    const newData = { ...res.data, page: page + 1, _id: id };
    dispatch({ type: PROFILE_TYPES.UPDATE_POST, payload: newData });
    setLoad(false);
  };
  useEffect(() => {
    profile.posts.forEach((data) => {
      if (data._id === id) {
        setPosts(data.posts);
        setResult(data.result);
        setPage(data.page);
      }
    });
  }, [profile.posts, id]);

  return (
    <div>
      <PostThumb posts={posts} result={result} />
      {load && <LoadingLottie />}

      {!load && (
        <LoadMoreBtn result={result} page={page} load={load} handleLoadMore={handleLoadMore} />
      )}
    </div>
  );
};

export default Posts;
