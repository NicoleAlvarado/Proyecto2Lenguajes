const User = require("../models/User"); // Importar el modelo User
const Page = require("../models/Page"); // Importar el modelo Page
const Post = require("../models/Post"); // Importar el modelo Post


const addPostToPage = async (req, res) => { //Metodo para agregar un post a una pagina
    try {
        const { email, pageId } = req.params; //Recibe por parametros el email de quien hace el post en la pagina y el id de la pagina
        const { content } = req.body; //Recibe el contenido del post 

        const user = await User.findOne({ email }); //Busca al usuario por email
        if (!user) { //Si no encuentra al usuario
            return res.status(404).json({ message: "User not found" }); //Retorna un mensaje de error
        }

        const page = user.pages.id(pageId); //busca en las paginas de ese usuario la pagina con el id recibido
        if (!page) {
            return res.status(404).json({ message: "Page not found" });
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

        // Obtener el usuario y sus páginas seguidas
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        const followedPages = user.followedPages || []; // Asegurar que sea un array

        // Obtener las páginas que el usuario no sigue
        const pages = await Page.find({ _id: { $nin: followedPages } });

        // Obtener páginas creadas por otros usuarios que el usuario no sigue
        const users = await User.find({
            email: { $ne: email },
            "pages.0": { $exists: true }, // Usuarios que tienen al menos una página
        });

        const userPages = users.flatMap(({ pages }) =>
            pages.filter((page) => !followedPages.includes(page._id.toString()))
        );

        res.status(200).json([...pages, ...userPages]);
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor." });
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
