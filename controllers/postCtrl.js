const Posts = require('../models/postModel');
const Comments = require('../models/commentModel');
const Users = require('../models/userModel');

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  run() {
    return this.query;
  }
  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const postCtrl = {
  createPost: async (req, res) => {
    try {
      const { content, images } = req.body;
      if (images.length == 0) {
        return res.status(400).json({ msg: 'Please add at least 1 image.' });
      }
      const newPost = new Posts({ content, images, user: req.user._id });
      await newPost.save();

      res.json({
        msg: 'Created post.',
        newPost: {
          ...newPost._doc,
          user: req.user,
        },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getPosts: async (req, res) => {
    try {
      const features = new APIFeatures(
        Posts.find({ user: [...req.user.following, req.user._id] }),
        req.query
      ).paginating();
      // find posts that belong to the auth's followings and himself

      const posts = await features.query
        .sort({ createdAt: -1 })
        .populate('user likes', 'avatar userName fullName followers')
        .populate({ path: 'comments', populate: 'user likes', select: '-password' });

      res.json({ msg: 'Success.', result: posts.length, posts });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  updatePost: async (req, res) => {
    try {
      const { content, images } = req.body;
      const post = await Posts.findOneAndUpdate({ _id: req.params.id }, { content, images })
        .populate('user likes', 'avatar userName fullName')
        .populate({ path: 'comments', populate: 'user likes', select: '-password' });

      res.json({ msg: 'Update post!', newPost: { ...post._doc, content, images } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  likePost: async (req, res) => {
    try {
      const post = await Posts.find({ _id: req.params.id, likes: req.user._id });

      if (post.length > 0) return res.status(400).json({ error: 'You liked this post' });

      const like = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { likes: req.user._id },
        },
        { new: true }
      );

      if (!like) {
        return res.status(400).json({ msg: 'Post does not exist' });
      }

      res.json({ msg: 'Liked post!' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  unLikePost: async (req, res) => {
    try {
      const unlike = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { likes: req.user._id },
        },
        { new: true }
      );

      if (!unlike) {
        return res.status(400).json({ msg: 'Post does not exist' });
      }

      res.json({ msg: 'Unliked post!' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getUserPosts: async (req, res) => {
    try {
      const features = new APIFeatures(Posts.find({ user: req.params.id }), req.query).paginating();

      const posts = await features.query.sort({ createdAt: -1 });
      res.json({ posts, result: posts.length });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Posts.findById(req.params.id)
        .sort({ createdAt: -1 })
        .populate('user likes', 'avatar userName fullName')
        .populate({ path: 'comments', populate: 'user likes', select: '-password' });

      if (!post) return res.status(400).json({ msg: 'Post does not exist' });

      res.json({ post });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getPostsDiscover: async (req, res) => {
    try {
      const newArr = [...req.user.following, req.user._id];
      const num = parseFloat(req.query.num) || 9;

      const posts = await Posts.aggregate([
        { $match: { user: { $nin: newArr } } },
        { $sample: { size: num } },
      ]);

      res.json({ msg: 'Success.', result: posts.length, posts });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  deletePost: async (req, res) => {
    try {
      const post = await Posts.findOneAndDelete({ _id: req.params.id, user: req.user._id });

      await Comments.deleteMany({ _id: { $in: post.comments } });

      res.json({ msg: 'Deleted post!', newPost: { ...post, user: req.user } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  savePost: async (req, res) => {
    try {
      const users = await Users.find({ _id: req.user._id, saved: req.params.id });
      if (users.length > 0) return res.status(400).json({ msg: 'You bookmarked this post.' });

      const save = await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: { saved: req.params.id },
        },
        { new: true }
      );
      if (!save) return res.status(400).json({ msg: 'This user does not exist.' });

      return res.json({ msg: 'bookmarked post.' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  unsavePost: async (req, res) => {
    try {
      const save = await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $pull: { saved: req.params.id },
        },
        { new: true }
      );
      if (!save) return res.status(400).json({ msg: 'This user does not exist.' });

      return res.json({ msg: 'unbookmarked post.' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getSavePosts: async (req, res) => {
    try {
      const features = new APIFeatures(
        Posts.find({ _id: { $in: req.user.saved } }),
        req.query
      ).paginating();

      const savePosts = await features.query.sort({ createdAt: -1 });

      res.json({ savePosts, result: savePosts.length });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = postCtrl;
