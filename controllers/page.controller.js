const User = require("../models/User");
const Page = require("../models/Page");
const Post = require("../models/Post");

const insertPage = async (req, res) => {
    try {
        const { title, description, phone, email, address, posts } = req.body;

        const page = await Page.create({
            title,
            description,
            phone,
            email,
            address,
            posts,
        });

        res.status(201).json(page);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addPostToPage = async (req, res) => {
    try {
        const { email, pageId } = req.params;
        const { content } = req.body;

        const user = await User.findOne({ email });
        const page = user.pages.id(pageId);
        page.posts.push(new Post({ content }));

        res.status(201).json(await user.save());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const insertUserPage = async (req, res) => {
    try {
        const { username } = req.params;
        const { title, description, phone, email, address } = req.body;

        const page = new Page({
            title,
            description,
            phone,
            email,
            address,
        });

        const user = await User.findOne({ username }).populate("pages");
        user.pages.push(page);

        res.status(201).json(await user.save());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserPage = async (req, res) => {
    try {
        const { username, pageId } = req.params;
        const { title, description, phone, email, address } = req.body;

        const user = await User.findOneAndUpdate(
            { username, "pages._id": pageId },
            {
                $set: {
                    "pages.$.title": title,
                    "pages.$.description": description,
                    "pages.$.phone": phone,
                    "pages.$.email": email,
                    "pages.$.address": address,
                },
            },
            { new: true }
        );

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUserPage = async (req, res) => {
    try {
        const { username, pageId } = req.params;

        const user = await User.findOneAndUpdate(
            { username },
            { $pull: { pages: { _id: pageId } } },
            { new: true, runValidators: true }
        );

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPages = async (req, res) => {
    try {
        const pages = await Page.find();
        res.status(200).json(pages);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const getRamdomPage = async (req, res) => {
    try {
        const [randomPage] = await Page.aggregate([{ $sample: { size: 1 } }]);
        res.status(200).json(randomPage);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

module.exports = {
    insertPage,
    addPostToPage,
    insertUserPage,
    updateUserPage,
    deleteUserPage,
    getPages,
    getRamdomPage,
};
