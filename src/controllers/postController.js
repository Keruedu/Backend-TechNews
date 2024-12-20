import Post from "../models/post.model.js";
import mongoose from 'mongoose';

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

