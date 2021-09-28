import React from 'react';
import Avatar from '../../Avatar';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
import { deletePost } from '../../../redux/actions/postAction';
import { BASE_URL } from '../../../utils/config';

const CardHeader = ({ post }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth, socket } = useSelector((state) => state);

  const handleEditPost = () => {
    dispatch({ type: GLOBALTYPES.STATUS, payload: { ...post, onEdit: true } });
  };

  const handleDeletePost = async () => {
    if (window.confirm('Are you want to delete this post?')) {
      await dispatch(deletePost({ post, auth, socket }));
      return history.push(`/`);
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(`${BASE_URL}/post/${post._id}`);
    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: 'Copied post link!' } });
  };

  return (
    <div className="card_header">
      <div className="d-flex ">
        <Avatar src={post.user.avatar} size="big-avatar" />
        <div className="card_name ml-2">
          <h6 className="m-0">
            <Link to={`/profile/${post.user._id}`} className="text-dark">
              {post.user.userName}
            </Link>
          </h6>
          <small className="text-muted">{moment(post.createdAt).fromNow()}</small>
        </div>
      </div>
      <div className="nav-item dropdown">
        <span
          className="material-icons"
          id="moreLink"
          data-bs-toggle="dropdown"
          data-toggle="dropdown"
        >
          more_horiz
        </span>
        <div className="dropdown-menu">
          {auth.user._id === post.user._id && (
            <>
              <div className="dropdown-item" onClick={handleEditPost}>
                <span className="material-icons">create</span> Edit post
              </div>
              <div className="dropdown-item" onClick={handleDeletePost}>
                <span className="material-icons">delete_outline</span> Remove post
              </div>
            </>
          )}
          <div className="dropdown-item" onClick={handleCopyLink}>
            <span className="material-icons">content_copy</span> Copy link
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardHeader;
