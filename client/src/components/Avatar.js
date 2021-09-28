import React from 'react';
import { useSelector } from 'react-redux';

const Avatar = ({ src, size }) => {
  const { theme } = useSelector((state) => state);

  return (
    <img
      src={src}
      alt="user avatar"
      className={size}
      style={{
        filter: theme ? 'invert(1)' : 'invert(0)',
        border: 'solid 1px #0dcaf0',
      }}
    />
  );
};

export default Avatar;
