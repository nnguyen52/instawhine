import React, { useState, useEffect } from 'react';
import Avatar from '../../Avatar';
import { Link } from 'react-router-dom';
import moment from 'moment';
import LikeButton from '../../LikeButton';
import { useSelector, useDispatch } from 'react-redux';
import CommentMenu from './CommentMenu';
import { updateComment, likeComment, unlikeComment } from '../../../redux/actions/commentAction';
import InputComment from '../InputComment';

const CommentCard = ({ children, comment, post, commentId }) => {
  const dispatch = useDispatch();
  const { auth, socket, theme } = useSelector((state) => state);

  const [content, setContent] = useState('');
  const [readMore, setReadmore] = useState(false);

  //like and unlike comment
  const [isLike, setIsLike] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [loadLike, setLoadLike] = useState(false);

  //reply
  const [onReply, setOnReply] = useState(false);

  const handleLike = async () => {
    if (loadLike) return;
    setIsLike(true);
    setLoadLike(true);
    await dispatch(likeComment({ comment, post, auth, socket }));
    setLoadLike(false);
  };
  const handleUnLike = async () => {
    if (loadLike) return;
    setIsLike(false);
    setLoadLike(true);
    await dispatch(unlikeComment({ comment, post, auth, socket }));
    setLoadLike(false);
  };

  const handleUpdate = async (e) => {
    if (comment.content !== content) {
      await dispatch(updateComment({ comment, post, content, auth, socket }));
      setOnEdit(false);
    } else {
      setOnEdit(false);
      return;
    }
  };

  useEffect(() => {
    setContent(comment.content);
    setIsLike(false);
    setOnReply(false);
    if (comment.likes.find((like) => like._id === auth.user._id)) setIsLike(true);
  }, [comment, auth.user._id]);

  const handleReply = () => {
    if (onReply) return setOnReply(false);
    setOnReply({ ...comment, commentId });
  };

  const styleCard = {
    opacity: comment._id ? 1 : 0.5,
    pointerEvents: comment._id ? 'inherit' : 'none',
  };

  return (
    <div className="comment_card mt-2" style={styleCard}>
      <Link to={`/profile/${comment.user._id}`} className="d-flex text-dark">
        <Avatar src={comment.user.avatar} size="small-avatar" />
        <h6 className="mx-1">{comment.user.userName}</h6>
      </Link>
      <div className="comment_content">
        <div
          className="flex-fill"
          style={{ filter: theme ? 'invert(1)' : 'invert(0)', color: theme ? 'white' : '#111' }}
        >
          {onEdit ? (
            <textarea rows="5" value={content} onChange={(e) => setContent(e.target.value)} />
          ) : (
            <div>
              {comment.tag && comment.tag._id !== comment.user._id && (
                <Link className="mr-1" to={`/profile/${comment.tag._id}`}>
                  @{comment.tag.userName}:
                </Link>
              )}
              <span>
                {content.length < 100
                  ? content
                  : readMore
                  ? content + ' '
                  : `${content.slice(0, 100)}...`}
              </span>
              {content.length < 100 ? null : (
                <span className="readMore" onClick={() => setReadmore(!readMore)}>
                  {readMore ? 'Hide' : 'Read more'}
                </span>
              )}
            </div>
          )}
          <div style={{ cursor: 'pointer' }}>
            <small className="text-muted mr-3">{moment(comment.createdAt).fromNow()}</small>
            <small className="font-weight-bold mr-3 ">{comment.likes.length} likes</small>
            {onEdit ? (
              <>
                <small className="font-weight-bold mr-3" onClick={handleUpdate}>
                  update
                </small>
                <small className="font-weight-bold mr-3" onClick={() => setOnEdit(false)}>
                  cancel
                </small>
              </>
            ) : (
              <small className="font-weight-bold mr-3" onClick={handleReply}>
                {onReply ? 'cancel' : 'reply'}
              </small>
            )}
          </div>
        </div>
        <div className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
          <CommentMenu post={post} comment={comment} auth={auth} setOnEdit={setOnEdit} />
          <LikeButton isLike={isLike} handleLike={handleLike} handleUnLike={handleUnLike} />
        </div>
      </div>
      {onReply && (
        <InputComment post={post} onReply={onReply} setOnReply={setOnReply}>
          <Link className="mr-1" to={`/profile/${onReply.user._id}`}>
            @{onReply.user.fullName}:
          </Link>
        </InputComment>
      )}
      <div>{children}</div>
    </div>
  );
};

export default CommentCard;
