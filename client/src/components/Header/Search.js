import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { getDataAPI } from '../../utils/fetchData';
import UserCard from '../UserCard';

const Search = () => {
  const [search, setSearch] = useState('');
  const handleSearch = (e) => {
    setSearch(e.target.value.toString().toLowerCase().replace(/ /g, ''));
  };

  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [load, setLoad] = useState(false);

  const [users, setUsers] = useState([]);

  const handleClose = () => {
    setSearch('');
    setUsers([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!search) {
      return;
    }
    try {
      setLoad(true);
      const res = await getDataAPI(`search?username=${search}`, auth.token);
      setUsers(res.data.users);
      setLoad(false);
    } catch (err) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } });
    }
  };
  return (
    <form className="search_form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="search"
        value={search}
        onChange={handleSearch}
        className="form-control"
        id="search"
        title="Search"
      />
      <div className="search_icon" style={{ opacity: search ? '0' : '.5' }}>
        <span className="material-icons">search</span>
        <span>Search</span>
      </div>
      <div
        className="search_close"
        style={{ opacity: users.length === 0 ? '0' : '1' }}
        onClick={handleClose}
      >
        &times;
      </div>

      <div type="submit" style={{ display: 'none' }}>
        Search
      </div>
      {load && <div className="spinner-border" role="status" />}
      <div className="users">
        {search &&
          users.map((each) => {
            return (
              <UserCard user={each} border="border" key={each._id} handleClose={handleClose} />
            );
          })}
      </div>
    </form>
  );
};

export default Search;
