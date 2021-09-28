import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { likePost } from '../redux/actions/postAction';

const Carousel = ({ post, images, id }) => {
  const dispatch = useDispatch();
  const { theme, auth, socket } = useSelector((state) => state);

  const [isLike, setIsLike] = useState(false);
  const [loadLike, setLoadLike] = useState(false);

  const handleLike = async () => {
    if (loadLike) return;
    setIsLike(true);
    setLoadLike(true);
    await dispatch(likePost({ post, auth, socket }));
    setLoadLike(false);
  };

  const isActive = (index) => {
    if (index === 0) return 'active';
  };

  const handleClick = async (e, post, img) => {
    switch (e.detail) {
      case 1:
        return;
      case 2:
        {
          const heart = await document.getElementById(`heart-${img}`);
          heart.classList.add('heartStart');
          heart.classList.add('like');
          setTimeout(() => {
            heart.classList.remove('like');
            heart.classList.remove('heartStart');
          }, 1200);
          const isLiked = post.likes.find((like) => like._id === auth.user._id);
          if (isLiked) return;
          handleLike();
        }
        break;
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div id={`image${id}`} className="carousel slide" data-ride="carousel">
        <ol className="carousel-indicators" style={{ zIndex: 1 }}>
          {images.map((img, index) => {
            return (
              <li
                key={index}
                data-target={`#image${id}`}
                data-slide-to="0"
                className={isActive(index)}
              />
            );
          })}
        </ol>

        <div className="carousel-inner">
          {images.map((img, index) => {
            return (
              <div className={`carousel-item ${isActive(index)}`} key={index}>
                <div
                  id={`heart-${img.url}`}
                  style={{
                    height: '100%',
                    width: '100%',
                    position: 'absolute',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <h1>
                    <i className="fa fa-heart" style={{ fontSize: '3em', color: 'white' }}></i>
                  </h1>
                </div>
                {img.url.match(/video/i) ? (
                  <video
                    controls
                    onClick={(e) => handleClick(e, post, img.url)}
                    className={`d-block w-100 carousel-img`}
                    id={img.url}
                    src={img.url}
                    alt="image"
                    style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
                  />
                ) : (
                  <img
                    onClick={(e) => handleClick(e, post, img.url)}
                    className={`d-block w-100 carousel-img`}
                    id={img.url}
                    src={img.url}
                    alt="image"
                    style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
                  />
                )}
              </div>
            );
          })}
        </div>
        {images.length > 1 && (
          <>
            <a
              className="carousel-control-prev"
              href={`#image${id}`}
              role="button"
              data-slide="prev"
              style={{ width: '5%' }}
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="sr-only">Previous</span>
            </a>
            <a
              className="carousel-control-next"
              href={`#image${id}`}
              role="button"
              data-slide="next"
              style={{ width: '5%' }}
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="sr-only">Next</span>
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default Carousel;
