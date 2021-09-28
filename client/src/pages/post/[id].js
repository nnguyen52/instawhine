import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getPost } from '../../redux/actions/postAction';
import LoadingLottie from '../../components/LoadingLottie';
import PostCard from '../../components/PostCard';

const Post = () => {
  const dispatch = useDispatch();
  //detail post acts like posts (array). but this array have only 1 post
  const { auth, detailPost } = useSelector((state) => state);

  const [post, setPost] = useState([]);

  const { id } = useParams();
  useEffect(() => {
    dispatch(getPost({ detailPost, id, auth }));
    if (detailPost.length > 0) {
      const newArr = detailPost.filter((post) => post._id === id);
      setPost(newArr);
    }
  }, [id, detailPost, dispatch, auth]);

  return (
    <div className="posts">
      {post.length === 0 && <LoadingLottie />}
      {post.length > 0 &&
        post.map((item) => {
          return <PostCard post={item} key={item._id} />;
        })}
    </div>
  );
};

export default Post;
