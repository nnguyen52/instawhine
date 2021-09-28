import React, { useState, useEffect } from 'react';
import CommentCard from './CommentCard';

const CommentDisplay = ({ comment, post, replyCm }) => {
  const [showRep, setShowRep] = useState([]);
  const [next, setNext] = useState(1);

  useEffect(() => {
    setShowRep(replyCm.slice(replyCm.length - next));
  }, [replyCm, next]);

  return (
    <div className="comment_display">
      {/* commentId acting like a root comment */}
      <CommentCard comment={comment} post={post} commentId={comment._id}>
        <div className="pl-4">
          {showRep.map(
            (item, index) =>
              item.reply && (
                <CommentCard key={index} post={post} comment={item} commentId={comment._id} />
              )
          )}
          {replyCm.length - next > 0 ? (
            <div
              style={{
                cursor: 'pointer',
              }}
              onClick={() => setNext(next + 10)}
            >
              See more replies...
            </div>
          ) : (
            showRep.length > 1 && (
              <div
                style={{ cursor: 'pointer', color: '#0DCAF0', fontWeight: '400' }}
                onClick={() => setNext(1)}
              >
                Hide replies.
              </div>
            )
          )}
        </div>
      </CommentCard>
    </div>
  );
};

export default CommentDisplay;
