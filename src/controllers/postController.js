import Post from "../models/postModel.js";
import User from '../models/userModel.js';
import Comment from "../models/commentModel.js";
import mongoose from 'mongoose';
import Tag from "../models/tagModel.js"; // Ensure Tag model is imported
import Category from '../models/categoryModel.js';

export const searchPosts = async (req, res) => {
    try {
        const size = parseInt(req.query.size) || 10;  // Default size is 10
        const page = parseInt(req.query.page) || 1;  // Default page number is 1
        const sortField = req.query.sortField || 'createdAt';  // Default sorting is by createdAt
        const sortType = req.query.sortType === 'desc' ? -1 : 1;  // Default sorting type is ascending

        // Building the filter object from the request body
        const filter = {};

        // Handling search for fields that might need regex
        if (req.body.search && req.body.search.trim()) {  // Filter for searchQuery
            const searchRegex = { $regex: req.body.search, $options: 'i' };  // Case-insensitive search
            filter.$or = [
                { title: searchRegex },
                { content: searchRegex }            ];
        }

        if (req.body.title && req.body.title.trim()) {  // Filter for title
            filter.title = { $regex: req.body.title, $options: 'i' };  // Case-insensitive search
        }

        if (req.body.content && req.body.content.trim()) {  // Filter for content
            filter.content = { $regex: req.body.content, $options: 'i' };  // Case-insensitive search
        }

        if (req.body.authorId) {  // Filter for authorId
            filter.authorId = req.body.authorId;
        }

        if (req.body.categoryIds && req.body.categoryIds.length > 0) {  // Filter for multiple categories
            filter.categoryId = { $in: req.body.categoryIds };
        }

        if (req.body.tagIds && req.body.tagIds.length > 0) {  // Filter for multiple tags
            filter.tagsId = { $in: req.body.tagIds };
        }

        if (req.body.status) {  // Filter for status
            filter.status = req.body.status;
        }

        if (req.body.startDate && req.body.endDate) {  // Filter for createdAt within a time range
            filter.createdAt = { $gte: new Date(req.body.startDate), $lte: new Date(req.body.endDate) };
        } else if (req.body.startDate) {
            filter.createdAt = { $gte: new Date(req.body.startDate) };
        } else if (req.body.endDate) {
            filter.createdAt = { $lte: new Date(req.body.endDate) };
        }

        filter.isDeleted = false;

        // Check if the request includes a userId for bookmarked posts
        if (req.body.bookmarkedByUserId) {
            const user = await User.findById(req.body.bookmarkedByUserId).select('bookmarkedPosts');
            if (user) {
                filter._id = { $in: user.bookmarkedPosts };
            } else {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
        }

        // Find posts with pagination and sorting
        const posts = await Post.find(filter)
                                .skip((page - 1) * size)
                                .limit(size)
                                .sort({ [sortField]: sortType })
                                .populate('authorId', 'username profile isBanned')
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
};

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
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { title, content, categoryId, tags } = req.body;
        const thumbnail = req.file ? req.file.path : null;

        if (!title || !thumbnail || !content || !categoryId) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ success: false, message: 'Please enter all fields' });
        }

        // Check if category exists
        const category = await Category.findById(categoryId).session(session);
        if (!category) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ success: false, message: 'Invalid category ID' });
        }
        
        const tagIds = [];
        // Ensure tags is an array of strings, remove extraneous characters, and filter out empty strings
        const tagArray = Array.isArray(tags) ? tags : tags.replace(/[\[\]"]/g, '').split(',').map(tag => tag.trim()).filter(tag => tag);
        
        for (const tagName of tagArray) {
            let tag = await Tag.findOne({ name: tagName }).session(session);
            if (!tag) {
                tag = new Tag({ name: tagName, slug: tagName.toLowerCase().replace(/ /g, '-') });
                await tag.save({ session });
            }
            tagIds.push(tag._id);
        }

        // Create post
        const newPost = new Post({
            title,
            content,
            thumbnail,
            categoryId,
            tagsId: tagIds,
            authorId: req.user._id,
            status: 'PENDING',
        });
        await newPost.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ success: true, data: newPost });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


export const updatePost = async (req, res) => {
    const { id } = req.params;
    const post = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Invalid Post ID' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Check and add new tags if they are not available
        const tags = post.tags || [];
        const tagIds = [];
        // Ensure tags is an array of strings, remove extraneous characters, and filter out empty strings
        const tagArray = Array.isArray(tags) ? tags : tags.replace(/[\[\]"]/g, '').split(',').map(tag => tag.trim()).filter(tag => tag);

        for (const tagName of tagArray) {
            let tag = await Tag.findOne({ name: tagName }).session(session);
            if (!tag) {
                tag = new Tag({ name: tagName, slug: tagName.toLowerCase().replace(/ /g, '-') });
                await tag.save({ session });
            }
            tagIds.push(tag._id);
        }
        post.tagsId = tagIds;

        const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true }).session(session);

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ success: true, data: updatedPost });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Invalid Post ID' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const post = await Post.findById(id).session(session);
        if (!post) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Xóa bookmark của người dùng đã bookmark bài viết này
        await User.updateMany(
            { bookmarkedPosts: id },
            { $pull: { bookmarkedPosts: id } },
            { session }
        );

        // Xóa upvote và downvote của người dùng đã upvote hoặc downvote bài viết này
        await User.updateMany(
            { upvotedPosts: id },
            { $pull: { upvotedPosts: id } },
            { session }
        );

        await User.updateMany(
            { downvotedPosts: id },
            { $pull: { downvotedPosts: id } },
            { session }
        );

        // Xóa tất cả các comment thuộc về bài viết này
        await Comment.deleteMany({ postId: id }).session(session);

        // Xóa bài viết
        await Post.findByIdAndDelete(id).session(session);

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ success: true, message: 'Post deleted' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};


export const deleteMultiplePosts = async (req, res) => {
    const { postIds } = req.body;

    if (!Array.isArray(postIds) || postIds.some(id => !mongoose.Types.ObjectId.isValid(id))) {
        return res.status(400).json({ success: false, message: 'Invalid Post IDs' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        for (const id of postIds) {
            const post = await Post.findById(id).session(session);
            if (!post) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ success: false, message: `Post not found: ${id}` });
            }

            // Xóa bookmark của người dùng đã bookmark bài viết này
            await User.updateMany(
                { bookmarkedPosts: id },
                { $pull: { bookmarkedPosts: id } },
                { session }
            );

            // Xóa upvote và downvote của người dùng đã upvote hoặc downvote bài viết này
            await User.updateMany(
                { upvotedPosts: id },
                { $pull: { upvotedPosts: id } },
                { session }
            );

            await User.updateMany(
                { downvotedPosts: id },
                { $pull: { downvotedPosts: id } },
                { session }
            );

            // Xóa tất cả các comment thuộc về bài viết này
            await Comment.deleteMany({ postId: id }).session(session);

            // Xóa bài viết
            await Post.findByIdAndDelete(id).session(session);
        }

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ success: true, message: 'Posts deleted' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

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
        const user = await User.findById(userId);
        if (!post || !user) {
            return res.status(404).json({ success: false, message: "Post or User not found" });
        }

        const hasUpvoted = post.upvotedBy.includes(userId);
        const updatePost = hasUpvoted
            ? { $inc: { upvotesCount: -1 }, $pull: { upvotedBy: userId } }
            : { $inc: { upvotesCount: 1 }, $push: { upvotedBy: userId } };

        const updateUser = hasUpvoted
            ? { $pull: { upvotedPosts: postId } }
            : { $push: { upvotedPosts: postId } };

        const updatedPost = await Post.findByIdAndUpdate(postId, updatePost, { new: true });
        await User.findByIdAndUpdate(userId, updateUser, { new: true });

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
        const user = await User.findById(userId);
        if (!post || !user) {
            return res.status(404).json({ success: false, message: "Post or User not found" });
        }

        const hasDownvoted = post.downvotedBy.includes(userId);
        const updatePost = hasDownvoted
            ? { $inc: { downvotesCount: -1 }, $pull: { downvotedBy: userId } }
            : { $inc: { downvotesCount: 1 }, $push: { downvotedBy: userId } };

        const updateUser = hasDownvoted
            ? { $pull: { downvotedPosts: postId } }
            : { $push: { downvotedPosts: postId } };

        const updatedPost = await Post.findByIdAndUpdate(postId, updatePost, { new: true });
        await User.findByIdAndUpdate(userId, updateUser, { new: true });

        res.status(200).json({ success: true, post: updatedPost });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const toggleBookmark = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id; // Assuming user ID is available in req.user

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const hasBookmarked = user.bookmarkedPosts.includes(postId);
        const updateUser = hasBookmarked
            ? { $pull: { bookmarkedPosts: postId } }
            : { $push: { bookmarkedPosts: postId } };

        await User.findByIdAndUpdate(userId, updateUser, { new: true });

        res.status(200).json({ success: true, message: hasBookmarked ? 'Bookmark removed' : 'Bookmark added' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//admin
export const getPendingPosts = async (req, res) => {
    try {
        const pend_posts = await Post.find({status: "APPROVED"})
        res.status(200).json({success: true, data: pend_posts})
    }
    catch {
        res.status(500).json({success: false, message: "Server Error"})
    }
}

export const approvePost = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Invalid Post ID' });
    }

    try {
        const updatedPost = await Post.findByIdAndUpdate(id, { status: 'APPROVED'});
        res.status(200).json({ success: true, data: updatedPost });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const rejectPost = async (req, res) => {
    const {id} = req.params
    const {reason} = req.body

    try {
        const updatePost = await Post.findByIdAndUpdate(id, {status: 'REJECTED'})
        res.status(200).json({success: true, data: updatePost, reason})
    }
    catch {
        res.status(500).json({success: false, message: "Server Error"})
    }
}

export const getDashBoardMetrics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalPosts = await Post.countDocuments();
        const totalPendingPosts = await Post.countDocuments({status: 'PENDING'})
    
        res.status(200).json({
            success: false,
            totalUsers,
            totalPosts,
            totalPendingPosts
        })
    }
    catch {
        res.status(500).json({success: false, message: 'Server Error'})
    }
}

export const updatePostStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Invalid Post ID' });
    }

    if (!status) {
        return res.status(400).json({ success: false, message: 'Status is required' });
    }

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        post.status = status;
        await post.save();

        res.status(200).json({ success: true, message: `Post status updated to ${status}`, data: post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};