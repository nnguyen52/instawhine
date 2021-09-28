const Users = require('../models/userModel');

const userCtrl = {
  //searchUser => return array of users;
  searchUser: async (req, res) => {
    try {
      const users = await Users.find({ userName: { $regex: req.query.username } })
        .limit(10)
        .select('fullName userName avatar');

      res.json({ users });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id)
        .select('-password')
        .populate('followers following', '-password');

      if (!user) {
        res.status(400).json({ msg: 'User does not exist.' });
      }
      res.json({ user });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { avatar, fullName, mobile, address, story, website, gender } = req.body;
      if (!fullName) return res.status(400).json({ msg: 'Please add your full name.' });
      await Users.findOneAndUpdate(
        { _id: req.user._id },
        { avatar, fullName, mobile, address, story, website, gender }
      );
      res.json({ msg: 'Profile updated!' });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  follow: async (req, res) => {
    try {
      const user = await Users.find({ _id: req.params.id, followers: req.user._id });
      if (user.length > 0) return res.status(500).json({ msg: 'You followed this user.' });

      // find stranger => add me to their followers list
      const newUser = await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { followers: req.user._id },
        },
        { new: true }
      );

      //   find me => add strangers to following list
      await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: { following: req.params.id },
        },
        { new: true }
      );

      res.json({ newUser });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  unfollow: async (req, res) => {
    try {
      // find stranger => add me to their followers list
      const newUser = await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { followers: req.user._id },
        },
        { new: true }
      ).populate('followers following', '-password');
      // find me => add strangers to following list
      await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $pull: { following: req.params.id },
        },
        { new: true }
      );

      res.json({ newUser });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  suggestionsUser: async (req, res) => {
    try {
      const newArr = [...req.user.following, req.user._id];
      const num = parseFloat(req.query.num) || 10;

      const users = await Users.aggregate([
        { $match: { _id: { $nin: newArr } } },
        { $sample: { size: num } },
        {
          $lookup: { from: 'users', localField: 'followers', foreignField: '_id', as: 'followers' },
        },
        {
          $lookup: { from: 'users', localField: 'following', foreignField: '_id', as: 'following' },
        },
      ]).project('-password');

      return res.json({ users, result: users.length });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = userCtrl;
