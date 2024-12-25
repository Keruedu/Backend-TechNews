import Post from "../models/postModel.js";
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
        // TODO: Add more search filter for other fields
        if (filter.title) {     // Filter for title
            filter.title = { $regex: filter.title, $options: 'i' };  // Case-insensitive search
        }

        if (filter.content) {   // Filter for content
            filter.content = { $regex: filter.content, $options: 'i' };  // Case-insensitive search
        }

        // Excluding deleted posts by default
        filter.isDeleted = false;

        // Find posts with pagination and sorting
        const posts = await Post.find(filter)
                                .skip((page - 1) * size)
                                .limit(size)
                                .sort({ [sortField]: sortType });

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
        res.status(500).json({ message: 'Server Error' });
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
    const post = req.body; // user will send this data 
    
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

