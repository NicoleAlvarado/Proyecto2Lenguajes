import { Page } from "../models/Page.js";

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

        console.log({ newPage });

        const page = await newPage.save();
        res.status(201).json(page);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPages = async (req, res) => {
    try {
        const pages = await Page.find();
        res.status(200).json(pages);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
