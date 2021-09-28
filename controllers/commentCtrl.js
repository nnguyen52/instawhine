const Comments = require('../models/commentModel');
const Posts = require('../models/postModel');

const commentCtrl = {
  createComment: async (req, res) => {
    try {
      const { postId, content, tag, reply, postUserId } = req.body;

      const post = await Posts.findById(postId);
      if (!post) {
        return res.status(500).json({ msg: 'This post does not exist.' });
      }

      if (reply) {
        const cm = await Comments.findById(reply);
        if (!cm) {
          return res.status(500).json({ msg: 'This comment does not exist.' });
        }
      }

      const newComment = new Comments({
        user: req.user._id,
        content,
        tag,
        reply,
        postUserId,
        postId,
      });
      await Posts.findOneAndUpdate(
        { _id: postId },
        {
          $push: { comments: newComment._id },
        },
        { new: true }
      );
      await newComment.save();
      res.json({ newComment });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  updateComment: async (req, res) => {
    try {
      const { content } = req.body;
      const res = await Comments.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        { content }
      );
      // prevent from editing comments from stranger.
      if (!res) res.status(400).json({ msg: 'You dont have the permission.' });

      res.json({ msg: 'Update comment!' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  likeComment: async (req, res) => {
    const comment = await Comments.find({ _id: req.params.id, likes: req.user._id });

    if (comment.length > 0) return res.status(400).json({ error: 'You liked this comment' });

    try {
      await Comments.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { likes: req.user._id },
        },
        { new: true }
      );
      res.json({ msg: 'Like comment!' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  unlikeComment: async (req, res) => {
    try {
      await Comments.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { likes: req.user._id },
        },
        { new: true }
      );
      res.json({ msg: 'Unliked comment!' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  deleteComment: async (req, res) => {
    try {
      const comment = await Comments.findOneAndDelete({
        _id: req.params.id,
        $or: [{ user: req.user._id }, { postUserId: req.user._id }],
      });
      await Posts.findOneAndUpdate(
        { _id: comment._id },
        {
          $pull: { comments: req.params.id },
        }
      );

      res.json({ msg: 'Delete comment!' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = commentCtrl;
