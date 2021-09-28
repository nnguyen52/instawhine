import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LikeButton from '../../LikeButton';
import { useSelector, useDispatch } from 'react-redux';
import { likePost, savePost, unlikePost, unsavePost } from '../../../redux/actions/postAction';
import ShareModal from '../../ShareModal';
import { BASE_URL } from '../../../utils/config';

const CardFooter = ({ post }) => {
  const dispatch = useDispatch();
  const { auth, socket } = useSelector((state) => state);

  const [isLike, setIsLike] = useState(false);
  const [loadLike, setLoadLike] = useState(false);

  const [isShare, setIsShare] = useState(false);

  const [loadSave, setLoadSave] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleLike = async () => {
    if (loadLike) return;
    // setIsLike(true);
    setLoadLike(true);
    await dispatch(likePost({ post, auth, socket }));
    setLoadLike(false);
  };

  const handleUnLike = async () => {
    if (loadLike) return;
    // setIsLike(false);
    setLoadLike(true);
    await dispatch(unlikePost({ post, auth, socket }));
    setLoadLike(false);
  };

  const handleSavePost = async () => {
    if (loadSave) return;
    setLoadSave(true);
    setSaved(true);
    await dispatch(savePost({ post, auth }));
    setLoadSave(false);
  };
  const handleUnsavePost = async () => {
    if (loadSave) return;
    setLoadSave(true);
    setSaved(false);
    await dispatch(unsavePost({ post, auth }));
    setLoadSave(false);
  };
  //likes
  useEffect(() => {
    if (post.likes.find((like) => like._id === auth.user._id)) {
      setIsLike(true);
    } else setIsLike(false);
  }, [post.likes, auth.user._id]);
  //saved
  useEffect(() => {
    if (auth.user.saved.find((id) => id === post._id)) {
      return setSaved(true);
    } else return setSaved(false);
  }, [auth.user.saved, post._id]);

  return (
    <div className="card_footer">
      <div className="card_icon_menu">
        <div>
          <LikeButton isLike={isLike} handleLike={handleLike} handleUnLike={handleUnLike} />
          <Link to={`/post/${post._id}`} className="text-dark">
            <i className="far fa-comment" aria-hidden="true"></i>
          </Link>
          <i
            className="far fa-paper-plane"
            aria-hidden="true"
            onClick={() => setIsShare(!isShare)}
          ></i>
        </div>
        {saved ? (
          <i className="fas fa-bookmark text-warning" onClick={handleUnsavePost}></i>
        ) : (
          <i className="far fa-bookmark" onClick={handleSavePost}></i>
        )}
      </div>
      <div className="d-flex justify-content-between mx-0">
        <h6 style={{ padding: '0 25px', cursor: 'pointer' }}>{post.likes.length} likes</h6>
        <h6 style={{ padding: '0 25px', cursor: 'pointer' }}>{post.comments.length} comments</h6>
      </div>
      {isShare && <ShareModal url={`${BASE_URL}/post/${post._id}`} />}
    </div>
  );
};

export default CardFooter;
