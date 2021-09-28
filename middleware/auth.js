const Users = require('../models/userModel');
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  //get token from header

  try {
    const token = req.header('Authorization');
    if (!token) return res.status(400).json({ msg: 'Invalid Authentication.' });
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_JWT);
    if (!decoded) return res.status(400).json({ msg: 'Invalid Authentication' });
    const user = await Users.findOne({ _id: decoded.id });
    //attach user to the request
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = auth;
