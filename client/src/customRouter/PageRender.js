import React from 'react';
import { useParams } from 'react-router-dom';
import NotFound from '../components/NotFound';
import { useSelector } from 'react-redux';

const PageRender = () => {
  const { page, id } = useParams();
  const { auth } = useSelector((state) => state);

  const generagePage = (pageInfo) => {
    //   must match login or register
    const component = () => {
      return require(`../pages/${pageInfo}`).default;
    };
    try {
      return React.createElement(component());
    } catch (err) {
      return <NotFound />;
    }
  };

  let pageInfo = ``;

  if (auth.token) {
    if (id) pageInfo = `${page}/[id]`;
    else pageInfo = `${page}`;
  }
  return generagePage(pageInfo);
};

export default PageRender;
