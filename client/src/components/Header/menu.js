import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Avatar from '../Avatar';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/actions/authAction';
import NotifyModal from '../NotifyModal';

const Menu = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { theme, auth, notify } = useSelector((state) => state);

  const navLinks = [
    { label: 'Home', icon: 'home', path: '/' },
    { label: 'Message', icon: 'near_me', path: '/message' },
    { label: 'Discover', icon: 'explore', path: '/discover' },
  ];
  const isActive = (pathName) => {
    if (pathName === pathname) return 'active';
  };
  const handleLogout = (e) => {
    dispatch(logout());
  };
  return (
    <div className="menu">
      <ul className="navbar-nav flex-row">
        {navLinks.map((each, index) => {
          return (
            <li className={`nav-item  ${isActive(each.path)} px-2`} key={index}>
              <Link className="nav-link" to={each.path}>
                {each.icon === 'near_me' ? (
                  <i
                    style={{ fontSize: '1.5em', transform: 'translateY(3px)' }}
                    className="far fa-paper-plane"
                    aria-hidden="true"
                  ></i>
                ) : (
                  <span className="material-icons">{each.icon}</span>
                )}
              </Link>
            </li>
          );
        })}
        {/* notify */}
        <li className="nav-item dropdown" style={{ opacity: 1 }}>
          <span
            className="nav-link position-relative"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <span
              className="material-icons"
              style={{ color: notify.data.length > 0 ? 'crimson' : '' }}
            >
              favorite
            </span>

            <span className="notify_length">{notify.data.length}</span>
          </span>

          <div
            className="dropdown-menu"
            aria-labelledby="navbarDropdown"
            style={{ transform: 'translateX(74px)' }}
          >
            <NotifyModal />
          </div>
        </li>
        {/* menu */}
        <li className="nav-item dropdown" style={{ opacity: 1 }}>
          <span
            className="nav-link"
            id="navbarDropdown"
            data-bs-toggle="dropdown"
            data-toggle="dropdown"
            role="button"
            aria-expanded="false"
            aria-haspopup="true"
            style={{ position: 'relative' }}
          >
            <Avatar src={auth.user.avatar} size="small-avatar" />
          </span>
          <div className="dropdown-menu" aria-labelledby="navbarDropdown">
            <Link className="dropdown-item" to={`/profile/${auth.user._id}`}>
              Profile
            </Link>
            <label
              htmlFor="theme"
              className="dropdown-item"
              onClick={() => {
                localStorage.getItem('instawhine_theme')
                  ? localStorage.removeItem('instawhine_theme')
                  : localStorage.setItem('instawhine_theme', 'true');
                dispatch({ type: GLOBALTYPES.THEME, payload: !theme });
              }}
            >
              {theme ? 'Light mode' : 'Dark mode'}
            </label>

            <hr className="dropdown-divider" />
            <Link className="dropdown-item" to="/" onClick={handleLogout}>
              Log Out
            </Link>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
