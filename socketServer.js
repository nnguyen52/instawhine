let users = [];
const editData = (data, id, call) => {
  const newData = data.map((item) => (item.id === id ? { ...item, call } : item));
  return newData;
};

const SocketServer = (socket) => {
  socket.on('joinUser', (user) => {
    users.push({ id: user._id, socketId: socket.id, followers: user.followers });
  });

  socket.on('disconnect', () => {
    //data is user who just left
    const data = users.find((user) => user.socketId === socket.id);
    if (data) {
      //find people that are followers of the left user
      const clients = users.filter((user) => data.followers.find((item) => item._id === user.id));
      if (clients.length > 0) {
        clients.forEach((client) => {
          //let all followers know the left user disconnected
          socket.to(`${client.socketId}`).emit('checkUserOffline', data.id);
        });
      }
      //when disconnect if user have call in redux
      //=> find user that have id same to call in redux
      //remove call from him and let him know other is out
      if (data.call) {
        const callUser = users.find((user) => user.id === data.call);
        if (callUser) {
          users = editData(users, callUser.id, null);
          socket.to(`${callUser.socketId}`).emit('callerDisconnect');
        }
      }
    }

    users.filter((user) => user.socketId !== socket.id);
  });

  // like post
  socket.on('likePost', (newPost) => {
    //add the one who like button to the follower arr
    // => notify both followers and the user who liked.
    const ids = [...newPost.user.followers, newPost.user._id];
    //check if user who like the post is the follower
    clients = users.filter((user) => ids.includes(user.id));

    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit('likeToClient', newPost);
      });
    }
  });

  socket.on('unlikePost', (newPost) => {
    const ids = [...newPost.user.followers, newPost.user._id];
    clients = users.filter((user) => ids.includes(user.id));

    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit('unlikeToClient', newPost);
      });
    }
  });

  socket.on('createComment', (newPost) => {
    const ids = [...newPost.user.followers, newPost.user._id];
    clients = users.filter((user) => ids.includes(user.id));

    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit('createCommentToClient', newPost);
      });
    }
  });

  socket.on('deleteComment', (newPost) => {
    const ids = [...newPost.user.followers, newPost.user._id];
    clients = users.filter((user) => ids.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit('deleteCommentToClient', newPost);
      });
    }
  });
  socket.on('likeComment', (newPost) => {
    const ids = [...newPost.user.followers, newPost.user._id];
    clients = users.filter((user) => ids.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit('likeCommentToClient', newPost);
      });
    }
  });
  socket.on('unlikeComment', (newPost) => {
    const ids = [...newPost.user.followers, newPost.user._id];
    clients = users.filter((user) => ids.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit('unlikeCommentToClient', newPost);
      });
    }
  });
  socket.on('updateComment', (newPost) => {
    const ids = [...newPost.user.followers, newPost.user._id];
    clients = users.filter((user) => ids.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit('updateCommentToClient', newPost);
      });
    }
  });

  socket.on('follow', (newUser) => {
    const user = users.find((user) => user.id === newUser._id);
    user && socket.to(`${user.socketId}`).emit('followToClient', newUser);
  });

  socket.on('unfollow', (newUser) => {
    const user = users.find((user) => user.id === newUser._id);
    user && socket.to(`${user.socketId}`).emit('unfollowToClient', newUser);
  });

  socket.on('createNotify', (msg) => {
    client = users.find((user) => msg.recipients.includes(user.id));
    client && socket.to(`${client.socketId}`).emit('createNotifyToClient', msg);
  });

  socket.on('removeNotify', (msg) => {
    client = users.find((user) => msg.recipients.includes(user.id));
    client && socket.to(`${client.socketId}`).emit('removeNotifyToCilent', msg);
  });

  socket.on('addMessage', (msg) => {
    const user = users.find((user) => user.id === msg.recipient);
    user && socket.to(`${user.socketId}`).emit('addMessageToClient', msg);
  });

  socket.on('checkUserOnline', (data) => {
    //find users'following that online
    const following = users.filter((user) => data.following.find((item) => item._id == user.id));
    //let me know
    socket.emit('checkUserOnlineToMe', following);

    //find user's followers
    const clients = users.filter((user) => data.followers.find((item) => item._id == user.id));
    //if they are online => let them know im online
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit('checkUserOnlineToClient', data._id);
      });
    }
  });

  //peer

  socket.on('callUser', (data) => {
    //caller call recipient
    users = editData(users, data.sender, data.recipient);
    //fint client that is recipient
    const client = users.find((user) => user.id === data.recipient);
    // if found =>
    if (client) {
      //if data has call => remove call from caller
      //let caller know that recipient is busy
      if (client.call) {
        users = editData(users, data.sender, null);
        socket.emit('userBusy', data);
      } else {
        //else add call from sender to recipient
        users = editData(users, data.recipient, data.sender);
        socket.to(`${client.socketId}`).emit('callUserToClient', data);
      }
    }
  });

  socket.on('endCall', (data) => {
    //find caller
    const client = users.find((user) => user.id === data.sender);
    // if found => let caller know that call ended
    if (client) {
      socket.to(`${client.socketId}`).emit('endCallToClient', data);
      users = editData(users, client.id, null);

      // if call have call =>
      // find recipient and let them know call ended
      if (client.call) {
        // find the one who ended call and let them know
        const clientCall = users.find((user) => user.id === client.call);
        clientCall && socket.to(`${clientCall.socketId}`).emit('endCallToClient', data);
        users = editData(users, client.call, null);
      }
    }
  });
};

module.exports = SocketServer;
