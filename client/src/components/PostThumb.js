import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PostThumb = ({ posts, result }) => {
  const { theme } = useSelector((state) => state);
  if (result === 0)
    return (
      <div className="text-center teoxt-danger">
        <span style={{ fontSize: '18px', fontWeight: '600' }}>
          Start capturing and sharing your moments!
        </span>
      </div>
    );
  return (
    <div className="post_thumb">
      {posts.map((post) => {
        return (
          <Link key={post._id} to={`/post/${post._id}`}>
            <div className="post_thumb_display">
              {post.images[0].url.match(/video/i) ? (
                <video
                  src={post.images[0].url}
                  alt={`post video ${post.images[0].url}`}
                  style={{
                    filter: theme ? 'invert(1)' : 'invert(0)',
                  }}
                />
              ) : (
                <img
                  src={post.images[0].url}
                  alt={`post img ${post.images[0].url}`}
                  style={{
                    filter: theme ? 'invert(1)' : 'invert(0)',
                  }}
                />
              )}
              <div className="post_thumb_menu">
                <i className="far fa-heart">{post.likes.length}</i>
                <i className="far fa-comment">{post.comments.length}</i>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default PostThumb;
