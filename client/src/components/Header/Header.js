import React from 'react';
import { Link } from 'react-router-dom';
import Menu from './menu';
import Search from './Search';

const Header = () => {
  return (
    <div className="header bg-light">
      <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-between align-middle">
        <Link
          to="/"
          className="logo"
          style={{ textDecoration: 'none' }}
          onClick={() => window.scrollTo({ top: 0 })}
        >
          <h1 className="navbar-brand ">Instawhinee</h1>
        </Link>
        <Search />
        <Menu />
      </nav>
    </div>
  );
};

export default Header;
