import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createComment } from '../../redux/actions/commentAction';
import Icons from '../Icons';

const InputComment = ({ children, post, onReply, setOnReply }) => {
  const dispatch = useDispatch();
  const { auth, socket, theme } = useSelector((state) => state);

  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      if (setOnReply) {
        return setOnReply(false);
      }
      return;
    }
    setContent('');
    const newComment = {
      content,
      likes: [],
      user: auth.user,
      createAt: new Date().toISOString(),
      //reply is original comment id
      reply: onReply && onReply.commentId,
      //tag is the user who commented the original comment
      tag: onReply && onReply.user,
    };
    dispatch(createComment(post, newComment, auth, socket));

    if (setOnReply) {
      return setOnReply(false);
    }
  };

  return (
    <form className="card-footer comment_input" onSubmit={handleSubmit}>
      {children}
      <input
        style={{
          filter: theme ? 'invert(1)' : 'invert(0)',
          color: theme ? 'white' : '#111',
          background: theme ? 'rgba(0,0,0,.03)' : '',
        }}
        type="textbox"
        value={content}
        placeholder="Add a comment..."
        onChange={(e) => setContent(e.target.value)}
      />
      <Icons content={content} setContent={setContent} />
      <button type="submit" className="postBtn">
        {onReply ? 'Reply' : 'Post'}
      </button>
    </form>
  );
};

export default InputComment;
