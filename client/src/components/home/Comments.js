import React, { useState, useEffect } from 'react';
import CommentDisplay from './comments/CommentDisplay';

const Comments = ({ post }) => {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState([]);

  const [replyComments, setReplyComments] = useState([]);

  const [next, setNext] = useState(2);

  useEffect(() => {
    //get 2 latest comments with no reply
    const newComments = post.comments.filter((cm) => !cm.reply);
    setComments(newComments);
    setShowComments(newComments.slice(newComments.length - next));
  }, [post.comments, next]);

  useEffect(() => {
    const newRep = post.comments.filter((cm) => cm.reply);
    setReplyComments(newRep);
  }, [post.comments]);

  return (
    <div className="comments">
      {showComments.map((comment) => {
        return (
          <CommentDisplay
            comment={comment}
            key={comment._id}
            post={post}
            //filter
            replyCm={replyComments.filter((item) => item.reply === comment._id)}
          />
        );
      })}
      {comments.length - next > 0 ? (
        <div
          className="p-2 border-top"
          style={{ cursor: 'pointer', color: '#0DCAF0', fontWeight: '400' }}
          onClick={() => setNext(next + 10)}
        >
          See more comments...
        </div>
      ) : (
        comments.length > 2 && (
          <div
            className="p-2 border-top"
            style={{ cursor: 'pointer', color: '#0DCAF0', fontWeight: '400' }}
            onClick={() => setNext(2)}
          >
            Hide comments.
          </div>
        )
      )}
    </div>
  );
};

export default Comments;
