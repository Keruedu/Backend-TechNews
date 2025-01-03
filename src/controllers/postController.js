import Post from "../models/postModel.js";
import Comment from "../models/commentModel.js";
import mongoose from 'mongoose';

export const searchPosts = async (req, res) => {
    try {
        const size = parseInt(req.query.size) || 10;  // Default size is 10
        const page = parseInt(req.query.page) || 1;  // Default page number is 1
        const sortField = req.query.sortField || 'createdAt';  // Default sorting is by createdAt
        const sortType = req.query.sortType === 'desc' ? -1 : 1;  // Default sorting type is ascending

        // Building the filter object from the request body
        const filter = req.body;

        // Handling search for fields that might need regex
        if (filter.title) {     // Filter for title
            filter.title = { $regex: filter.title, $options: 'i' };  // Case-insensitive search
        }

        if (filter.content) {   // Filter for content
            filter.content = { $regex: filter.content, $options: 'i' };  // Case-insensitive search
        }

        if (filter.authorId) {  // Filter for authorId
            filter.authorId = filter.authorId;
        }

        if (filter.categoryId) {  // Filter for categoryId
            filter.categoryId = filter.categoryId;
        }

        if (filter.tagsId) {  // Filter for tagsId
            filter.tagsId = { $in: filter.tagsId };
        }

        if (filter.status) {  // Filter for status
            filter.status = filter.status;
        }

        if (filter.createdAt) {  // Filter for createdAt
            filter.createdAt = { $gte: new Date(filter.createdAt) };
        }

        // Excluding deleted posts by default
        filter.isDeleted = false;

        // Find posts with pagination and sorting
        const posts = await Post.find(filter)
                                .skip((page - 1) * size)
                                .limit(size)
                                .sort({ createdAt: -1 })
                                .populate('authorId', 'username profile isBanned') // Sort by createdAt in descending order
                                .populate('categoryId', 'name slug')
                                .populate('tagsId', 'name slug');
        // Count the total posts matching the filter for pagination purposes
        const totalPosts = await Post.countDocuments(filter);

        res.status(200).json({ 
            success: true, 
            size: size,
            page: page,
            totalPosts: totalPosts,
            totalItems: Math.ceil(totalPosts / size),
            data: posts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
}

export const getPostById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Invalid Post ID' });
    }

    try {
        const post = await Post.findById(id)
                               .populate('authorId', 'username profile isBanned')
                               .populate('categoryId', 'name slug')
                               .populate('tagsId', 'name slug');
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        res.status(200).json({ success: true, data: post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
}


export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({});
        res.status(200).json({ success: true, data: posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

export const createPost = async (req, res) => {
    const post = req.body;
    post.authorId = req.user._id; // Gán ID người dùng từ middleware

    if (!post.title || !post.thumbnail || !post.content) {
        return res.status(400).json({ success:false, message: 'Please enter all fields' });
    }

    const newPost = new Post(post);

    try {
        await newPost.save();
        res.status(201).json({ success: true, data: newPost });
    }   catch (error) {
        console.error(error);
        res.status(500 ).json({ success: false, message: 'Internal Server Error' });
    }
}

export const updatePost =  async (req, res) => {
    const {id} = req.params;
    const post = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Invalid Post ID' });
    }

    try {
        const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });
        res.status(200).json({ success: true, data: updatedPost });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const deletePost = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Invalid Post ID' });
    }

    try {
        await Post.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Post deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const getPostComments = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Invalid Post ID' });
    }

    try {
        const comments = await Comment.find({ postId: id }).populate('authorId', 'username profile isBanned');
        if (!comments) {
            return res.status(404).json({ success: false, message: 'Comments not found' });
        }
        res.status(200).json({ success: true, data: comments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
}

// Increase view count
export const increaseViewCount = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findByIdAndUpdate(postId, { $inc: { views: 1 } }, { new: true });
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }
        res.status(200).json({ success: true, post });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Toggle upvote count
export const toggleUpvoteCount = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id; // Assuming user ID is available in req.user

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        const hasUpvoted = post.upvotedBy.includes(userId);
        const update = hasUpvoted
            ? { $inc: { upvotesCount: -1 }, $pull: { upvotedBy: userId } }
            : { $inc: { upvotesCount: 1 }, $push: { upvotedBy: userId } };

        const updatedPost = await Post.findByIdAndUpdate(postId, update, { new: true });
        res.status(200).json({ success: true, post: updatedPost });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Toggle downvote count
export const toggleDownvoteCount = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id; // Assuming user ID is available in req.user

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        const hasDownvoted = post.downvotedBy.includes(userId);
        const update = hasDownvoted
            ? { $inc: { downvotesCount: -1 }, $pull: { downvotedBy: userId } }
            : { $inc: { downvotesCount: 1 }, $push: { downvotedBy: userId } };

        const updatedPost = await Post.findByIdAndUpdate(postId, update, { new: true });
        res.status(200).json({ success: true, post: updatedPost });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};