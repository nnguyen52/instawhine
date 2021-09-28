const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// NOTE: all errors occur
// => must return with error status
// => front end catches error+dispatch alert with message
const authCtrl = {
  /**register:
   * get user info from body.req
   * find userName in database=> if found => return error
   * sanitization
   * hash password
   * create new User with hahsed password as password
   * generate 2 tokens with createAccessToken and createRefeshToken with new User ID as parameter
   * store refresh_token in cookie => set api path
   * save user in database
   * res.json with user and access_token
   */
  register: async (req, res) => {
    try {
      const { fullName, username, email, password, gender } = req.body;
      let newUserName = username.toString().toLowerCase().replace(/ /g, '');
      const user_name = await User.findOne({ userName: newUserName });
      if (user_name)
        return res
          .status(400)
          .json({ msg: 'This user name is already taken! Please try again.', user: user_name });
      const user_email = await User.findOne({ email });
      if (user_email)
        return res.status(400).json({ msg: 'This email is already taken! Please try again.' });

      if (password.length < 6)
        return res.status(400).json({ msg: 'Password must contain more than 6 characters.' });
      //if password ok => encrypt
      const passwordHash = await bcrypt.hash(password, 12);
      //all good
      const newUser = new User({
        fullName,
        userName: newUserName,
        email,
        password: passwordHash,
        gender,
      });
      const access_token = await createAccessToken({ id: newUser._id });
      const refresh_token = await createRefreshToken({ id: newUser._id });

      res.cookie('refresh_Token_Instawhine', refresh_token, {
        httpOnly: true,
        path: '/api/refresh_token',
        maxAge: 30 * 7 * 24 * 60 * 60 * 1000,
      });
      //save into db
      await newUser.save();
      //after save new User
      res.json({
        msg: 'Welcome to Instawhine!',
        access_token,
        user: { ...newUser._doc, password: '' },
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  /**login:
   *
   *
   */
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).populate(
        'followers following',
        'avatar userName fullName followers following'
      );
      if (!user) return res.status(400).json({ msg: 'Email or Password is not correct.' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Email or Password is not correct.' });

      const access_token = await createAccessToken({ id: user._id });
      const refresh_token = await createRefreshToken({ id: user._id });

      res.cookie('refresh_Token_Instawhine', refresh_token, {
        httpOnly: true,
        path: '/api/refresh_token',
        maxAge: 30 * 7 * 24 * 60 * 60 * 1000,
      });
      //return user;
      res.json({ msg: 'login successful!', access_token, user: { ...user._doc, password: '' } });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      await res.clearCookie('refresh_Token_Instawhine', { path: '/api/refresh_token' });

      return res.json({ msg: 'Logged out!' });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  //look for rf_token in cookie => if no => ask for login
  // if yes => jwt verify
  //        => if err => ask for login
  //        => if ok => find user
  //        => create accessToken
  //        => return {accessToken , user}
  generateAccessToken: async (req, res) => {
    try {
      const refresh_token = req.cookies.refresh_Token_Instawhine;

      if (!refresh_token) return res.status(400).json({ msg: 'Please log in now.' });

      jwt.verify(refresh_token, process.env.REFRESH_TOKEN_JWT, async (err, result) => {
        if (err) return res.json(400).json({ msg: 'Please log in now.' });
        const user = await User.findById(result.id)
          .select('-password')
          .populate('followers following', 'avatar userName fullName followers following');

        if (!user) return res.json(400).json({ msg: 'Please log in now.' });

        const access_token = await createAccessToken({ id: user._id.toString() });
        res.json({ access_token, user });
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
};

const createAccessToken = async (payload) => {
  return await jwt.sign(payload, process.env.ACCESS_TOKEN_JWT, { expiresIn: '1d' });
};

const createRefreshToken = async (payload) => {
  return await jwt.sign(payload, process.env.REFRESH_TOKEN_JWT, { expiresIn: '30d' });
};
module.exports = authCtrl;
