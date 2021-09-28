import React from 'react';

const Times = ({ total }) => {
  return (
    <div>
      <span>
        {parseInt(total / 3600).toString().length < 2
          ? '0' + parseInt(total / 3600).toString()
          : parseInt(total / 3600).toString()}
      </span>
      <span>:</span>
      <span>
        {parseInt(total / 60).toString().length < 2
          ? '0' + parseInt(total / 60).toString()
          : parseInt(total / 60).toString()}
      </span>
      <span>:</span>
      <span>
        {parseInt(total % 60).toString().length < 2
          ? '0' + parseInt(total % 60).toString() + 's'
          : parseInt(total % 60).toString() + 's'}
      </span>
    </div>
  );
};

export default Times;
