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
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const page = user.pages.id(pageId);
        if (!page) {
            return res.status(404).json({ message: "Página no encontrada" });
        }

        const newPost = new Post({ content });
        page.posts.push(newPost);

        await user.save();
        res.status(201).json({ message: "Post añadido correctamente", post: newPost });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const insertUserPage = async (req, res) => {
    try {
        const { email } = req.params;
        const { title, description, phone, pageEmail, address } = req.body;

        const page = new Page({
            title,
            description,
            phone,
            email: pageEmail,
            address,
        });

        const user = await User.findOne({ email }).populate("pages");
        user.pages.push(page);

        res.status(201).json(await user.save());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserPage = async (req, res) => {
    try {
        const { email, pageId } = req.params;
        const { title, description, phone, email: pageEmail, address } = req.body;

        const user = await User.findOneAndUpdate(
            { email, "pages._id": pageId },
            {
                $set: {
                    "pages.$.title": title,
                    "pages.$.description": description,
                    "pages.$.phone": phone,
                    "pages.$.email": pageEmail,
                    "pages.$.address": address,
                },
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "Usuario o página no encontrada" });
        }

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

const getUserPages = async (req, res) => {
    try {
        const { email } = req.params;

        const user = await User.findOne({ email }, "pages");

        if (!user || user.pages.length === 0) {
            return res.status(404).json({ message: "No se encontraron páginas para este usuario." });
        }

        res.status(200).json(user.pages);
    } catch (error) {
        console.error("Error en getUserPages:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

const getRecommendedPages = async (req, res) => {
    try {
        const { email } = req.params;
        const { followedPages } = User.findOne({ email });

        const pages = await Page.find({ _id: { $nin: followedPages } });
        const users = await User.find({
            email: { $ne: email },
            "pages.0": { $exists: true },
            "pages._id": { $nin: followedPages },
        });
        const userPages = users.flatMap(({ pages }) => pages);

        res.status(200).json([...pages, ...userPages]);
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
    getUserPages,
    getRecommendedPages,
    getRamdomPage,
};
