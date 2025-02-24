import { Post } from "../models/Post.js";

export const insertPost = async (req, res) => {
    try {
        const { content } = req.body;
        const newPost = new Post({ content });

        const post = await newPost.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
