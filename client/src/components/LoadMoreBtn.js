import React from 'react';

const LoadMoreBtn = ({ result, load, handleLoadMore, page }) => {
  return (
    <>
      {result < 9 * (page - 1)
        ? ''
        : !load && (
            <button className="btn btn-dark mx-auto d-block load_more" onClick={handleLoadMore}>
              Load more
            </button>
          )}
    </>
  );
};

export default LoadMoreBtn;
