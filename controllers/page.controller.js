const User = require("../models/User"); // Importar el modelo User
const Page = require("../models/Page"); // Importar el modelo Page
const Post = require("../models/Post"); // Importar el modelo Post

const addPostToPage = async (req, res) => {
    //Metodo para agregar un post a una pagina
    try {
        const { email, pageId } = req.params; //Recibe por parametros el email de quien hace el post en la pagina y el id de la pagina
        if (!email || !pageId) {
            //Si no recibe el email o el id de la pagina
            return res.status(400).json({ message: "Email and pageId are required" }); //Retorna un mensaje de error
        }
        const { content } = req.body; //Recibe el contenido del post
        if (!content) {
            //Si no recibe el contenido del post
            return res.status(400).json({ message: "Content is required" }); //Retorna un mensaje de error
        }

        const user = await User.findOne({ email }); //Busca al usuario por email
        if (!user) {
            //Si no encuentra al usuario
            return res.status(404).json({ message: "User not found" }); //Retorna un mensaje de error
        }

        const page = user.pages.id(pageId); //busca en las paginas de ese usuario la pagina con el id recibido
        if (!page) {
            //Si no encuentra la pagina
            return res.status(404).json({ message: "Page not found" }); //Retorna un mensaje de error
        }

        const newPost = new Post({ content }); //Crea un nuevo post con el contenido recibido
        page.posts.push(newPost); //Agrega el post a la pagina de ese usuario

        await user.save(); //Guarda el usuario
        res.status(201).json({ message: "Post correctly added", post: newPost }); //retorna un mensaje de exito
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const insertUserPage = async (req, res) => {
    //Metodo para insertar una pagina a un usuario
    try {
        const { email } = req.params; //Recibe el email del usuario por parametros
        if (!email) {
            //Si no recibe el email
            return res.status(400).json({ message: "Email is required" }); //Retorna un mensaje de error
        }
        const { title, description, phone, pageEmail, address } = req.body; //Recibe los datos de la pagina en el body
        if (!title || !description || !phone || !pageEmail || !address) {
            //Si no recibe alguno de los datos de la pagina
            return res.status(400).json({ message: "All fields are required" }); //Retorna un mensaje de error
        }

        const page = new Page({
            //Crea una nueva pagina con los datos recibidos
            title,
            description,
            phone,
            email: pageEmail,
            address,
        });

        const user = await User.findOne({ email }).populate("pages"); //Busca al usuario por email y trae las paginas que tiene

        if (!user) {
            //Si no encuentra al usuario
            return res.status(404).json({ message: "User not found" }); //Retorna un mensaje de error
        }
        user.pages.push(page); //Agrega la pagina al usuario

        res.status(201).json(await user.save()); //Guarda el usuario y retorna un mensaje de exito
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserPage = async (req, res) => {
    //Metedo para actualizar una pagina de un usuario
    try {
        const { email, pageId } = req.params; //Recibe el email del usuario y el id de la pagina por parametros
        if (!email || !pageId) {
            //Si no recibe el email o el id de la pagina
            return res.status(400).json({ message: "Email and pageId are required" }); //Retorna un mensaje de error
        }
        const { title, description, phone, email: pageEmail, address } = req.body; //Recibe los datos de la pagina en el body
        if (!title || !description || !phone || !pageEmail || !address) {
            //Si no recibe alguno de los datos de la pagina
            return res.status(400).json({ message: "All fields are required" }); //Retorna un mensaje de error
        }

        const user = await User.findOneAndUpdate(
            //Busca al usuario y actualiza la pagina con los datos recibidos
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
            { new: true } //Retorna la pagina actualizada
        );

        if (!user) {
            //Si no encuentra al usuario
            return res.status(404).json({ message: "User or page not found" }); //Retorna un mensaje de error
        }

        res.status(200).json(user); //Retorna el usuario
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserPages = async (req, res) => {
    //Metodo para obtener las paginas de un usuario
    try {
        const { email } = req.params;
        if (!email) {
            //Si no recibe el email
            return res.status(400).json({ message: "Email is required" }); //Retorna un mensaje de error
        }

        const user = await User.findOne({ email }, "pages"); //Busca al usuario por email y trae las paginas que tiene

        if (!user || user.pages.length === 0) {
            //Si no encuentra al usuario o no tiene paginas
            return res.status(404).json({ message: "There is not pages available" }); //Retorna un mensaje de error
        }

        res.status(200).json(user.pages); //Retorna las paginas del usuario
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const getRecommendedPages = async (req, res) => {
    //Metodo para obtener las paginas que un usuario no sigue
    try {
        const { email } = req.params; //Recibe el email del usuario por parametros
        if (!email) {
            //Si no recibe el email
            return res.status(400).json({ message: "Email is required" }); //Retorna un mensaje de error
        }

        const user = await User.findOne({ email }); //Busca al usuario por email
        if (!user) {
            //Si no encuentra al usuario
            return res.status(404).json({ message: "User not found" }); //Retorna un mensaje de error
        }

        const followedPages = user.followedPages || []; //Obtiene las paginas que sigue el usuario

        // Obtener las paginas que el usuario no sigue
        const pages = await Page.find({ _id: { $nin: followedPages } });

        // Obtener paginas creadas por otros usuarios que el usuario no sigue
        const users = await User.find({
            email: { $ne: email },
            "pages.0": { $exists: true }, // Usuarios que tienen al menos una página
        });

        const userPages = users.flatMap(({ pages }) =>
            pages.filter((page) => !followedPages.includes(page._id.toString()))
        );

        res.status(200).json([...pages, ...userPages]); //Retorna las paginas que no sigue el usuario
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const getRamdomPage = async (req, res) => {
    //Metodo para obtener una pagina aleatoria
    try {
        const [randomPage] = await Page.aggregate([{ $sample: { size: 1 } }]); //Obtiene una pagina aleatoria
        res.status(200).json(randomPage); //Retorna la pagina
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Función para obtener los posts de una página a través del usuario
const getPagePosts = async (req, res) => {
    try {
        const { email, pageId } = req.params;
        const user = await User.findOne({ email }).populate("pages.posts");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const page = user.pages.id(pageId);

        if (!page) {
            return res.status(404).json({ message: "Page not found" });
        }

        res.json(page.posts);
    } catch (error) {
        console.error("Error fetching page posts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    //Exporta los metodos
    addPostToPage,
    insertUserPage,
    updateUserPage,
    getUserPages,
    getRecommendedPages,
    getRamdomPage,
    getPagePosts,
};
