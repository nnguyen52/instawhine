import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { login } from '../redux/actions/authAction';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
const Login = () => {
  const history = useHistory();

  const initialState = { email: '', password: '' };
  const [userData, setUserData] = useState(initialState);
  const { email, password } = userData;
  const [typePass, setTypePass] = useState(false);

  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  useEffect(() => {
    if (auth.token) return history.push('/');
  }, [auth, history]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(userData));
  };

  return (
    <div className="auth_page">
      <form onSubmit={handleSubmit}>
        <h3 className="text-uppercase text-center mb-5">Instawhine</h3>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            onChange={handleChangeInput}
            value={email}
            name="email"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1">Password</label>
          <div className="pass">
            <input
              name="password"
              type={typePass ? 'text' : 'password'}
              className="form-control"
              id="exampleInputPassword1"
              onChange={handleChangeInput}
              value={password}
            />
            <small onClick={() => setTypePass(!typePass)}>{typePass ? 'Hide' : 'Show'}</small>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-dark w-100"
          disabled={email && password ? false : true}
        >
          Login
        </button>
        <p className="my-2">
          Don't have an account? <Link to="/register">Register now</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
