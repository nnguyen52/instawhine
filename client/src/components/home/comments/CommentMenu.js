import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteComment } from '../../../redux/actions/commentAction';

const CommentMenu = ({ post, comment, setOnEdit }) => {
  const dispatch = useDispatch();
  const { auth, socket } = useSelector((state) => state);

  const MenuItem = () => {
    return (
      <>
        <div className="dropdown-item" onClick={() => setOnEdit(true)}>
          <span className="material-icons">create</span> Edit
        </div>
        <div className="dropdown-item" onClick={handleRemove}>
          <span className="material-icons">delete_outline</span> Remove
        </div>
      </>
    );
  };

  const handleRemove = () => {
    //handle remove (completely delete from database)
    if (post.user._id === auth.user._id || comment.user._id === auth.user._id) {
      dispatch(deleteComment({ comment, post, auth, socket }));
    }
  };

  return (
    /**   LOGIC:
     * if user post => full control user comment
     * if user post with stranger comment => can only remove stranger's comment
     * if stranger visit user post => full control only on their own comment.
     */
    <div className="menu">
      {/* if the post not from user or  the comment is from user   */}
      {(post.user._id === auth.user._id || comment.user._id === auth.user._id) && (
        <div className="nav-item dropdown">
          <span className="material-icons" id="moreLink" data-toggle="dropdown">
            more_vert
          </span>
          {/* showing toggle menu 
          // if the post is user's post 
                => check: if the comment is from user => full menu (full control)
                        else show remove (hide)
          // else if post is from stranger 
                => check: if the comment is from user => full menu (full control)
*/}
          <div className="dropdown-menu" aria-labelledby="moreLink">
            {post.user._id === auth.user._id ? (
              comment.user._id === auth.user._id ? (
                MenuItem()
              ) : (
                <div className="dropdown-item" onClick={handleRemove}>
                  <span className="material-icons">delete_outline</span>
                  Remove
                </div>
              )
            ) : (
              comment.user._id === auth.user._id && MenuItem()
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentMenu;
