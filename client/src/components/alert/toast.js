import React from 'react';

const Toast = ({ msg, handleShow, bgColor }) => {
  return (
    <div
      className={`toast show position-fixed text-light ${bgColor}`}
      style={{ top: '5px', right: '5px', minWidth: '200px', zIndex: 50, width: '200px' }}
    >
      <div
        className={`toast-header text-light ${bgColor}`}
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <strong className="mr-auto text-light">{msg.title}</strong>
        <button
          className={`ml-2 mb-1 close text-light ${bgColor}`}
          data-dismiss="toast"
          style={{ outline: 'none', border: 'none' }}
          onClick={handleShow}
        >
          &times;
        </button>
      </div>
      <div className="toast-body">{msg.body}</div>
    </div>
  );
};

export default Toast;
