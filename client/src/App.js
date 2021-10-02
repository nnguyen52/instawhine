import { useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Alert from './components/alert/alert';
import Header from './components/Header/Header';

import PageRender from './customRouter/PageRender';
import Login from './pages/login';
import Home from './pages/home';
import Register from './pages/register';
import StatusModal from './components/StatusModal';

import PrivateRouter from './customRouter/privateRouter';

import { useSelector, useDispatch } from 'react-redux';
import { refreshToken } from './redux/actions/authAction';
import { getPosts } from './redux/actions/postAction';
import { GLOBALTYPES } from './redux/actions/globalTypes';
import { getSuggestions } from './redux/actions/suggestionAction';

import io from 'socket.io-client';
import SocketClient from './SocketClient';

import { getNotifies } from './redux/actions/notifyAction';
import CallModal from './components/message/CallModal';

//peer
import Peer from 'peerjs';

function App() {
  const { auth, status, theme, modal, call } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem('instawhine_theme')) {
      document.getElementById('theme').checked = true;
      dispatch({ type: GLOBALTYPES.THEME, payload: !theme });
    }
    // DO NOT PUT THEME AS DEPENDENCY HERE
  }, [dispatch]);

  useEffect(() => {
    dispatch(refreshToken());

    // establish socket
    const socket = io();
    dispatch({ type: GLOBALTYPES.SOCKET, payload: socket });
    //unmount => disconnect
    return () => socket.close();
  }, [dispatch]);

  useEffect(() => {
    if (auth.token) {
      dispatch(getPosts(auth.token));
      dispatch(getSuggestions(auth.token));
      dispatch(getNotifies(auth.token));
    }
  }, [dispatch, auth.token, auth?.user?.followers, auth?.user?.following]);

  useEffect(() => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
    } else if (Notification.permission === 'granted') {
      if (localStorage.getItem('Instawhine_notification') !== 'true') {
        localStorage.setItem('Instawhine_notification', 'true');
      }
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(function (permission) {
        if (permission === 'granted') {
          if (localStorage.getItem('Instawhine_notification') !== 'true') {
            localStorage.setItem('Instawhine_notification', 'true');
          }
        }
      });
    }
  }, []);

  // peer
  useEffect(() => {
    const newPeer = new Peer(undefined, { path: '/', secure: true });
    dispatch({ type: GLOBALTYPES.PEER, payload: newPeer });
  }, [dispatch]);
  return (
    <Router>
      <Alert />
      <input type="checkbox" id="theme" />
      <div className={`App ${(status || modal) && 'mode'}`}>
        <div className="main">
          {auth.token && <Header />}
          {status && <StatusModal />}
          {auth.token && <SocketClient />}
          {call && <CallModal />}

          <Route exact path="/" component={auth.token ? Home : Login} />
          <Route exact path="/register" component={Register} />

          <PrivateRouter exact path="/:page" component={PageRender} />
          <PrivateRouter exact path="/:page/:id" component={PageRender} />
        </div>
      </div>
    </Router>
  );
}

export default App;
