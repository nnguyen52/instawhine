import React, { useState, useEffect } from 'react';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { getDataAPI } from '../../utils/fetchData';
import LoadingLottie from '../LoadingLottie';
import LoadMoreBtn from '../LoadMoreBtn';
import PostThumb from '../PostThumb';

const Saved = ({ auth, dispatch }) => {
  const [savePosts, setSavePosts] = useState([]);
  const [page, setPage] = useState(0);
  const [result, setResult] = useState(9);
  const [load, setLoad] = useState(false);

  const handleLoadMore = async () => {
    setLoad(true);
    const res = await getDataAPI(`getSavePosts?limit=${page * 9}`, auth.token);
    setSavePosts(res.data.savePosts);
    setResult(res.data.result);
    setPage(page + 1);
    setLoad(false);
  };

  useEffect(() => {
    setLoad(true);
    getDataAPI('getSavePosts', auth.token)
      .then((res) => {
        setSavePosts(res.data.savePosts);
        setResult(res.data.result);
        setLoad(false);
      })
      .catch((err) =>
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } })
      );
    return () => setSavePosts([]);
  }, [dispatch, auth.token]);

  return (
    <div>
      <PostThumb posts={savePosts} result={result} />
      {load && <LoadingLottie />}
      {!load && savePosts.length > 0 && (
        <LoadMoreBtn result={result} page={page} load={load} handleLoadMore={handleLoadMore} />
      )}
    </div>
  );
};

export default Saved;
