import React, { useState } from 'react';
import Carousel from '../../Carousel';

const CardBody = ({ post, theme }) => {
  const [readMore, setReadmore] = useState(false);

  return (
    <div className="card_body">
      <div
        className="card_body-content"
        style={{ filter: theme ? 'invert(1)' : 'invert(0)', color: theme ? 'white' : '#111' }}
      >
        <span>
          {post.content.length < 60
            ? post.content
            : readMore
            ? post.content
            : post.content.slice(0, 60) + '...'}
          {post.content.length > 60 && (
            <span
              style={{ color: 'rgb(13, 202, 240)', cursor: 'pointer' }}
              onClick={() => (readMore ? setReadmore(false) : setReadmore(true))}
            >
              {readMore ? ' Hide' : ' Read more'}
            </span>
          )}
        </span>
      </div>
      {post.images.length > 0 && <Carousel post={post} images={post.images} id={post._id} />}
    </div>
  );
};

export default CardBody;
