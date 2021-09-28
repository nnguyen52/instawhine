import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DISCOVER_TYPES, getDiscoverPosts } from '../redux/actions/discoverAction';
import LoadingLottie from '../components/LoadingLottie';
import PostThumb from '../components/PostThumb';
import LoadMoreBtn from '../components/LoadMoreBtn';
import { getDataAPI } from '../utils/fetchData';

const Discover = () => {
  const dispatch = useDispatch();
  const { auth, discover } = useSelector((state) => state);

  const [load, setLoad] = useState(false);

  const handleLoadMore = async () => {
    setLoad(true);
    const res = await getDataAPI(`post_discover?num=${discover.page * 9}`, auth.token);

    dispatch({ type: DISCOVER_TYPES.UPDATE_POST, payload: res.data });
    setLoad(false);
  };

  useEffect(() => {
    if (!discover.firstLoad) {
      return dispatch(getDiscoverPosts({ auth }));
    }
  }, [dispatch, discover.firstLoad, auth]);

  return (
    <div>
      {discover.loading ? (
        <LoadingLottie />
      ) : (
        <>
          <PostThumb posts={discover.posts} result={discover.result} />
        </>
      )}
      {load && <LoadingLottie />}
      {!discover.loading && (
        <LoadMoreBtn
          result={discover.result}
          page={discover.page}
          load={load}
          handleLoadMore={handleLoadMore}
        />
      )}
    </div>
  );
};

export default Discover;
