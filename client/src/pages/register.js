import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { register } from '../redux/actions/authAction';

const Register = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { auth, alert } = useSelector((state) => state);

  const initialState = {
    email: '',
    password: '',
    fullName: '',
    username: '',
    gender: 'male',
    confirmPassword: '',
  };
  const [userData, setUserData] = useState(initialState);
  const { email, password, fullName, username, confirmPassword } = userData;
  const [typePass, setTypePass] = useState(false);

  useEffect(() => {
    if (auth.token) return history.push('/');
  }, [auth.token, history]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(userData));
  };

  return (
    <div className="auth_page">
      <form onSubmit={handleSubmit}>
        <h3 className="text-uppercase text-center mb-5">Instawhine</h3>
        <div className="mb-3" style={{ display: 'flex' }}>
          <div className="col-8" style={{ paddingRight: '10px' }}>
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              className="form-control"
              onChange={handleChangeInput}
              value={fullName}
              name="fullName"
              id="fullName"
              style={{
                border: alert.fullName ? 'solid 1px red' : '',
                background: alert.fullName ? '#fd2d6a14' : '',
              }}
            />
            <small
              className="form-text"
              style={{
                color: alert.fullName ? 'red ' : '',
                background: alert.fullName ? '#fd2d6a14' : '',
              }}
            >
              {alert.fullName ? alert.fullName : ''}
            </small>
          </div>
          <div className="col-4">
            <label htmlFor="gender">Gender</label>
            <select
              class="form-select"
              aria-label="Default select example"
              onChange={handleChangeInput}
              style={{
                border: alert.gender ? 'solid 1px red' : '',
                background: alert.gender ? '#fd2d6a14' : '',
              }}
            >
              <option value="male" selected>
                Male
              </option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select>
          </div>
        </div>
        <div className="mb-3 ">
          <label htmlFor="exampleInputEmail1">User Name</label>
          <input
            type="text"
            className="form-control"
            onChange={handleChangeInput}
            value={username.toLowerCase().replace(/ /g, '')}
            name="username"
            style={{
              border: alert.username ? 'solid 1px red' : '',
              background: alert.username ? '#fd2d6a14' : '',
            }}
          />
          <small className="form-text" style={{ color: alert.username ? 'red' : '' }}>
            {alert.username ? alert.username : ''}
          </small>
          <ul className="mt-2" style={{ margin: 0, paddingLeft: '1em' }}>
            <li>Username must be in lower case</li>
            <li>Username must have no space</li>
          </ul>
        </div>
        <div className="mb-3">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            onChange={handleChangeInput}
            value={email}
            name="email"
            style={{
              border: alert.email ? 'solid 1px red' : '',
              background: alert.email ? '#fd2d6a14' : '',
            }}
          />
          <small className="form-text" style={{ color: alert.email ? 'red' : '' }}>
            {alert.email ? alert.email : ''}
          </small>
        </div>

        <div className="mb-3">
          <label htmlFor="password">Password</label>
          <div className="pass">
            <input
              name="password"
              type={typePass ? 'text' : 'password'}
              className="form-control"
              id="password"
              onChange={handleChangeInput}
              value={password}
              style={{
                border: alert.password ? 'solid 1px red' : '',
                background: alert.password ? '#fd2d6a14' : '',
              }}
            />
            <small onClick={() => setTypePass(!typePass)}>{typePass ? 'Hide' : 'Show'}</small>
          </div>
          <small className="form-text" style={{ color: alert.password ? 'red' : '' }}>
            {alert.password ? alert.password : ''}
          </small>
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword">Confirmed password</label>
          <div className="pass">
            <input
              name="confirmPassword"
              type={typePass ? 'text' : 'password'}
              className="form-control"
              id="confirmPassword"
              aria-describedby="confirmPassHelp"
              onChange={handleChangeInput}
              value={confirmPassword}
              style={{
                border: alert.confirmPassword ? 'solid 1px red' : '',
                background: alert.confirmPassword ? '#fd2d6a14' : '',
              }}
            />
            <small onClick={() => setTypePass(!typePass)}>{typePass ? 'Hide' : 'Show'}</small>
          </div>
          <small className="form-text" style={{ color: alert.confirmPassword ? 'red' : '' }}>
            {alert.confirmPassword ? alert.confirmPassword : ''}
          </small>
          <div id="confirmPassHelp">Ensure confirm password matches password!</div>
        </div>
        <button
          type="submit"
          className="btn btn-dark w-100 mt-1"
          disabled={email && password ? false : true}
        >
          Register
        </button>
        <p className="my-2">
          Already have an account? <Link to="/">Login now</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
