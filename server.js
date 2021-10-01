require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const SocketServer = require('./socketServer');
const { ExpressPeerServer } = require('peer');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// socket
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
  SocketServer(socket);
});

ExpressPeerServer(http, { path: '/' });

// Routes
const authRoute = require('./routes/authRouter');
const userRoute = require('./routes/userRouter');
const postRoute = require('./routes/postRoute');
const commentRoute = require('./routes/commentRouter');
const notifyRoute = require('./routes/notifyRouter');
const messageRoute = require('./routes/messageRouter');
app.use('/api', authRoute);
app.use('/api', userRoute);
app.use('/api', postRoute);
app.use('/api', commentRoute);
app.use('/api', notifyRoute);
app.use('/api', messageRoute);

const URI = process.env.MONGODB_URL;
mongoose.connect(
  URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log('connected to mongodb.');
  }
);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;
http.listen(port, () => {
  console.log('server is running on port ', port);
});
