import Comment from "../models/commentModel.js";
import Post from "../models/postModel.js";
import Notification from "../models/notificationModel.js";

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({});
    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const createComment = async (req, res) => {
  const { content, postId } = req.body;

  if (!content || !postId) {
    return res.status(400).json({ success: false, message: 'Please enter all fields' });
  }

  try {
    const newComment = new Comment({ content, authorId: req.user._id, postId });
    await newComment.save();

    // Cập nhật bài viết với bình luận mới
    const post = await Post.findById(postId).populate('authorId');
    if (!post.commentsID) {
      post.commentsID = [];
    }
    post.commentsID.push(newComment._id);
    post.totalCommentsCount += 1;
    await post.save();

    // Create a notification for the post author
    if (post.authorId._id.toString() !== req.user._id.toString()) {
      const notification = new Notification({
        userId: post.authorId._id,
        message: `User ${req.user.username} commented on your post.`,
        type: 'COMMENT',
        url: `/post/${postId}`,
        createdAt: new Date()
      });
      await notification.save();
    }

    // Populate profileId
    const populatedComment = await newComment.populate({
      path: 'authorId',
      select: 'profile'
    });

    res.status(201).json({ success: true, data: populatedComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const updatedComment = await Comment.findByIdAndUpdate(id, { content }, { new: true });
    res.status(200).json({ success: true, data: updatedComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Tìm bài viết chứa bình luận này
    const post = await Post.findOne({ comments: id });

    if (post) {
      post.commentsID.pull(id);
      post.totalCommentsCount -= 1;
      await post.save();
    }

    res.status(200).json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};