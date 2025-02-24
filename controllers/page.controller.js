import { Page } from "../models/Page.js";
import { Post } from "../models/Post.js";

export const insertPage = async (req, res) => {
    try {
        const { title, description, phone, email, address, posts } = req.body;

        const newPage = new Page({
            title,
            description,
            phone,
            email,
            address,
            posts,
        });

        res.status(201).json(await newPage.save());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const insertPostInPage = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        const page = await Page.findById(id);
        page.posts.push(new Post({ content }));

        res.status(201).json(await page.save());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPages = async (req, res) => {
    try {
        res.status(200).json(await Page.find());
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getRamdomPage = async (req, res) => {
    try {
        const [randomPage] = await Page.aggregate([{ $sample: { size: 1 } }]);
        res.status(200).json(randomPage);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};