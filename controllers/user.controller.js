const User = require("../models/User"); // Se importa el modelo User
const Page = require("../models/Page"); // Se importa el modelo Page
const Post = require("../models/Post"); // Se importa el modelo Post
const Comment = require("../models/Comment"); // Se importa el modelo Comment
const mongoose = require("mongoose"); // Se importa mongoose para trabajar con la base de datos y realizar consultas

const {
    // Se importan las funciones de validacion de usuario
    validateUserData,
    validateUserName,
    generateHashPassword,
    validatePassword,
} = require("../utility/user.validation");

const sendEmail = require("../utility/emailService"); // Se importa la funcion sendEmail para enviar correos electronicos

const createUser = async (req, res) => {
    //Funcion para crear un usuario
    try {
        const { username, email, password, bio, avatar } = req.body; // Se obtienen los datos del usuario del cuerpo de la peticion
        if (!username || !email || !password) {
            // Se verifica si los campos obligatorios estan vacios
            return res.status(400).json("Username, email and password are required");
        }
        validateUserData(username, email, password, avatar); // Se valida la informacion del usuario
        await validateUserName(username, email); // Se valida el nombre de usuario y el correo para verificar que no existan previamente
        const hashPassword = await generateHashPassword(password); //Se encripta la contrasenia ingresada para guardarla asi en la base de datos

        const user = new User({ username, email, password: hashPassword, bio, avatar }); //Se crea el usuario con la informacion ingresada
        await user.save(); //Se queda el usuario en la base de datos

        const message = "Welcome to the social network!"; //Mensaje de bienvenida
        await addNotification(email, "welcome", message, "status"); //Se envia una notificacion de bienvenida al usuario

        return res.status(201).json(user); //Se retorna el usuario creado
    } catch (error) {
        return res.status(500).json(`${error}`);
    }
};

const addCommentToUserPost = async (req, res) => {
    //Funcion para agregar un comentario a una publicacion de un usuario
    try {
        const { commentPostUserEmail, postId } = req.params; //Recibe el email de quien va a dejar el comentario y el id del post
        if (!commentPostUserEmail || !postId) {
            //Si no se recibe alguno de los dos envia un mensaje de error
            return res.status(400).json("Comment post user email and post id are required");
        }
        const { userEmail, comment } = req.body; //Recibe el correo del usuario y el comentario que va a dejar
        if (!userEmail || !comment) {
            //Si no se recibe alguno de los dos envia un mensaje de error
            return res.status(400).json("User email and comment are required");
        }
        const user = await User.findOne({ email: commentPostUserEmail }); //Busca al usuario
        if (!user) {
            //Si no lo encuentra envia un mensaje de error
            return res.status(404).json(`User with email ${commentPostUserEmail} not found`);
        }
        const post = user.posts.id(postId); //Y obtiene el post de ese usuario
        post.comments.push(new Comment({ userEmail, comment })); //Agrega el comentario a ese post

        res.status(200).json(await user.save()); //Retorna un mensaje de exito

        // Agregar notificacion de comentario
        await addNotification(commentPostUserEmail, "comment", `Someone commented on your post`, "status");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addCommentToPagePost = async (req, res) => {
    //Funcion para agregar un comentario a una publicacion de una pagina
    try {
        const { pageId, postId } = req.params; //recibe el id de la pagina y el id de la publicacion
        if (!pageId || !postId) {
            //Si no se recibe alguno de los dos envia un mensaje de error
            return res.status(400).json("Page id and post id are required");
        }
        const { userEmail, comment } = req.body; //Recibe el email del usuario que va a comentar y el comentario
        if (!userEmail || !comment) {
            //Si no se recibe alguno de los dos envia un mensaje de error
            return res.status(400).json("User email and comment are required");
        }
        let page = await Page.findById(pageId); //Busca la pagina

        if (!page) {
            const userWithPage = await User.findOne({ "pages._id": pageId });
            page = userWithPage.pages.id(pageId);
        }

        const post = page.posts.id(postId); //Busca el post de la pagina
        post.comments.push(new Comment({ userEmail, comment })); // y agrega el comentario

        res.status(200).json(page.parent() ? await page.parent().save() : page.save());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const insertUserPost = async (req, res) => {
    //Funcion para que un usuario inserte una publicacion
    try {
        const { email } = req.params; //Recibe el Email del usuario que va a publicar
        const { content } = req.body; //Recibe el contenido del Post
        if (!content) {
            //Si no se recibe envia un mensaje de error
            return res.status(400).json("Content is required");
        }
        const user = await User.findOne({ email }); //Busca al usuario
        if (!user) {
            //Si no lo encuentra envia un mensaje de error
            return res.status(404).json(`User with email ${email} not found`);
        }

        user.posts.push(new Post({ content })); //Y agrega el nuevo post a los posts del usuario

        res.status(201).json(await user.save());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const likeUserPost = async (req, res) => {
    //Funcion para dar like a la publicacion de un usuario
    try {
        const { likedPostUserEmail, postId } = req.params; //Recibe el email del usuario que recibe el like y el id del post que recibe el like
        if (!likedPostUserEmail || !postId) {
            //Si no se recibe alguno de los dos envia un mensaje de error
            return res.status(400).json("Liked post user email and post id are required");
        }
        const { userEmail } = req.body; //Recibe el email de quien envia el like
        if (!userEmail) {
            //Si no se recibe envia un mensaje de error
            return res.status(400).json("User email is required");
        }
        const user = await User.findOne({ email: likedPostUserEmail }); //Busca al usuario que va a recibir el like
        if (!user) {
            //Si no lo encuentra envia un mensaje de error
            return res.status(404).json(`User with email ${likedPostUserEmail} not found`);
        }
        const post = user.posts.id(postId); //Busca la publicacion de ese usuario
        if (!post) {
            //Si no la encuentra envia un mensaje de error
            return res.status(404).json(`Post with id ${postId} not found`);
        }
        const likeIndex = post.likes.indexOf(userEmail); // Devuelve la posicion del array donde esta el like del usuario que quiere dar like

        likeIndex === -1 ? post.likes.push(userEmail) : post.likes.splice(likeIndex, 1); //Si no tiene el like, es decir, si retorna -1, se agrega el like, sino, se quita

        res.status(200).json(await user.save());
        await addNotification(likedPostUserEmail, "like", `Someone liked your post`, "status"); //Se agrega la notificacion de like al usuario
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const likePagePost = async (req, res) => {
    //Funcion para darle like a un post de una pagina
    try {
        const { pageId, postId } = req.params; //recibe el id de la pagina y el id del post
        if (!pageId || !postId) {
            //Si no se recibe alguno de los dos envia un mensaje de error
            return res.status(400).json("Page id and post id are required");
        }
        const { userEmail } = req.body; //recibe el email del usuario que va a dar like
        if (!userEmail) {
            //Si no se recibe envia un mensaje de error
            return res.status(400).json("User email is required");
        }
        let page = await Page.findById(pageId); //Busca la pagina
        if (!page) {
            //Si no la encuentra busca al usuario que tiene esa pagina
            const userWithPage = await User.findOne({ "pages._id": pageId });
            page = userWithPage.pages.id(pageId);
        }
        if (!page) {
            const userWithPage = await User.findOne({ "pages._id": pageId }); //o la busca en las paginas de los usuarios
            page = userWithPage.pages.id(pageId);
        }

        const post = page.posts.id(postId); //busca la publicacion en la pagina
        if (!post) {
            //Si no la encuentra envia un mensaje de error
            return res.status(404).json(`Post with id ${postId} not found`);
        }
        const likeIndex = post.likes.indexOf(userEmail); //Revisa el indice donde esta el like
        if (likeIndex === -1) {
            post.likes.push(userEmail);
        }
        likeIndex === -1 ? post.likes.push(userEmail) : post.likes.splice(likeIndex, 1); //Si no tiene like lo agrega, si ya tiene like lo quita

        res.status(201).json(page.parent() ? await page.parent().save() : page.save());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    //Funcion para eliminar un usuario
    try {
        const { email } = req.params; //Recibe el email del usuario que va a eliminar
        if (!email) return res.status(400).json("Email is required"); //si no se le pasa por parametro envia un mensaje de error

        const userDelete = await User.findOne({ email }); //Busca al usuario que va a eliminar
        if (!userDelete) return res.status(404).json(`User with email ${email} to delete not found`); //Si no lo encuentra envia un mensaje de error

        // Eliminar el email del usuario de las listas de amigos de otros usuarios
        await User.updateMany({ friends: email }, { $pull: { friends: email } });

        // Eliminar el usuario
        await User.findByIdAndDelete(userDelete._id);

        return res.status(200).json(`User with email ${email} deleted`);
    } catch (error) {
        return res.status(500).json(`Error: ${error.message}`);
    }
};

const updateUser = async (req, res) => {
    //Funcion para actualizar la informacion de un usuario
    try {
        const { useremail } = req.params; //Recibe el correo del usuario que va a actualizar
        if (!useremail) return res.status(204).json("useremail is required"); //Si no se recibe envia un mensaje de error

        const { newUsername, email, password, bio, avatar } = req.body; // Recibe la nueva informacion para actualizar
        validateUserData(newUsername, email, password, avatar); //Valida esa informacion

        const user = await User.findOne({ email: useremail }); //Busca al usuario que va a editar
        if (!user) return res.status(404).json(`User with email ${useremail} to update not found`); //Si no o encuentra envia un mensaje de error

        if (user.email !== email) {
            //Si se cambio el correo se valida
            await validateUserName(newUsername, email);
        }

        let modifyPassword = user.password; //Se hashea la nueva contrasenia
        if (!(await validatePassword(modifyPassword, password))) {
            modifyPassword = await generateHashPassword(password);
        }

        const updatedUser = await User.findByIdAndUpdate(
            //Actualiza la informacion del usuario
            user.id,
            {
                username: newUsername,
                email: email,
                password: modifyPassword,
                bio: bio,
                avatar: avatar,
            },
            { new: true, runValidators: true }
        );
        return res.status(200).json({ user: updatedUser });
    } catch (error) {
        return res.status(500).json(`Error: ${error.message}`);
    }
};

const getUser = async (req, res) => {
    //Funcion para obtener un usuario por su username para la funcionalidad de buscar amigos
    try {
        const { username } = req.params; //Recibe el username
        if (!username) return res.status(204).json("Username is required");
        const user = await User.findOne({ username }); //Busca al usuario
        if (!user) return res.status(400).json("User not found");
        return res.status(200).json(user); //Retorna la informacion del usuario
    } catch (error) {
        return res.status(404).json(error.message);
    }
};

const getUserbyEmail = async (req, res) => {
    //Funcion para obtener un usuario pos su email, sirve para cargar la informacion en el perfil
    try {
        const { email } = req.params; //Recibe el email del usuario
        if (!email) return res.status(204).json("Email is required");
        const user = await User.findOne({ email }); //Busca al usuario
        if (!user) return res.status(400).json("User not found");
        return res.status(200).json(user); //Retorna la informacion del usuario
    } catch (error) {
        return res.status(404).json(error.message);
    }
};

const getUsers = async (req, res) => {
    //Funcion para obtener todos los usuarios
    try {
        return res.status(200).json(await User.find()); //Busca todos los usuarios en la base de datos
    } catch (error) {
        return res.status(404).json(error.message);
    }
};

const sendFriendRequest = async (req, res) => {
    //Funcion para enviar una solicitud de amistad
    try {
        const { senderEmail, receiverEmail } = req.body; //recibe ambos correos

        if (!senderEmail || !receiverEmail) {
            return res.status(400).json({ message: "Both senderEmail and receiverEmail are required" });
        }

        const sender = await User.findOne({ email: senderEmail }); //Busca al usuario que envia la solicitud
        const receiver = await User.findOne({ email: receiverEmail }); //Busca al usuario que recibe la solicitud

        if (!sender || !receiver) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verificar si ya son amigos
        if (sender.friends.includes(receiverEmail) || receiver.friends.includes(senderEmail)) {
            return res
                .status(400)
                .json({ message: "You are already friends with this user", status: "already_friends" }); //Si ya son amigos envia un mensaje
        }

        // Verificar si la solicitud ya ha sido enviada
        if (receiver.friendRequests.includes(sender.email)) {
            return res.status(400).json({ message: "Friend request already sent", status: "already_sent" }); //Si ya se ha enviado la solicitud envia un mensaje
        }

        // Agregar la solicitud de amistad
        receiver.friendRequests.push(sender.email);
        await receiver.save();
        sendEmail(receiverEmail, "Friend Request", `${sender.username} sent you a friend request`); //Envia un correo al usuario que recibe la solicitud
        sendEmail(senderEmail, "Friend Request", `You sent a friend request to ${receiver.username}`); //Envia un correo al usuario que envia la solicitud

        return res.status(200).json({ message: "Friend request sent successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const respondFriendRequest = async (req, res) => {
    //Funcion para responder una solicitud de amistad
    try {
        const { userEmail, senderEmail, action } = req.body; // action: "accept" o "reject"

        if (!userEmail || !senderEmail) {
            return res.status(400).json({ message: "Both userEmail and senderEmail are required" });
        }

        const user = await User.findOne({ email: userEmail }); //Busca al usuario que tiene la solicitud
        const sender = await User.findOne({ email: senderEmail }); //Busca al usuario que envia la solicitud

        if (!user || !sender) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verificar si la solicitud existe
        if (!user.friendRequests.includes(sender.email)) {
            return res.status(400).json({ message: "No friend request found" });
        }

        // Si el usuario acepta la solicitud
        if (action === "accept") {
            user.friends.push(sender.email); //Agrega el amigo al arreglo de ambos usuarios
            sender.friends.push(user.email);
        }

        // Eliminar la solicitud de la lista
        user.friendRequests = user.friendRequests.filter((email) => email !== sender.email);
        await user.save();
        await sender.save();

        // Agregar notificacion de aceptacion de solicitud de amistad
        await addNotification(
            senderEmail,
            "friend_request_accepted",
            `${user.username} Accepted your Friend Request`,
            "status"
        );

        return res.status(200).json({ message: `Friend request ${action}ed successfully` });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getFriendRequests = async (req, res) => {
    //Funcion para obtener las solicitudes de amistad de un usuario
    try {
        const { email } = req.params; //Recibe el email del usuario
        if (!email) {
            return res.status(400).json({ message: "User email is required" });
        }

        const user = await User.findOne({ email }).populate("friendRequests"); //Busca al usuario y obtiene sus solicitudes de amistad

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Agregar el nombre de usuario y avatar de las solicitudes de amistad
        const requestsWithDetails = await Promise.all(
            user.friendRequests.map(async (requestEmail) => {
                const sender = await User.findOne({ email: requestEmail });
                return {
                    email: sender.email,
                    username: sender.username,
                    avatar: sender.avatar,
                };
            })
        );

        return res.status(200).json(requestsWithDetails);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getFriendPosts = async (friends) => {
    //Funcion para obtener las publicaciones de un amigo
    const users = await User.find({ email: { $in: friends }, "posts.0": { $exists: true } }).limit(25); //Busca usuarios cuyo email este en el array friends

    return users.map(({ username, email, avatar, posts }) => ({
        pageId: 0,
        username,
        email,
        avatar,
        isPage: false,
        randomPost: posts[Math.floor(Math.random() * posts.length)], //Se toma un post aleatorio de los obtenidos
    }));
};

const getFollowedIndependentPagesPosts = async (pageIds) => {
    //Obtener publicaciones de paginas independientes que se siguen
    const pages = await Page.find({ _id: { $in: pageIds }, "posts.0": { $exists: true } }).limit(25);

    return pages.map(({ _id, title, posts }) => ({
        pageId: _id,
        title,
        email: "",
        isPage: true,
        randomPost: posts[Math.floor(Math.random() * posts.length)], //Obtiene un post random de los obtenidos
    }));
};

const getFollowedUserPagesPosts = async (pageIds) => {
    //Obtener publicaciones de la pagina de un usuario que se sigue
    const users = await User.find({ "pages._id": { $in: pageIds }, "pages.posts.0": { $exists: true } }).limit(25);

    return users.flatMap((user) =>
        user.pages
            .filter((page) => pageIds.some((id) => id.toString() === page._id.toString()) && page.posts.length > 0)
            .map(({ _id, title, email, posts }) => ({
                pageId: _id,
                title,
                email,
                isPage: true,
                randomPost: posts[Math.floor(Math.random() * posts.length)], //Obtiene un post random de esas paginas
            }))
    );
};

const getInitialPosts = async () => {
    //Funcion para obtener los post iniciales en caso de que no se siga ninguna pagina o no se tenga amigos
    const pages = await Page.find({ "posts.0": { $exists: true } }).limit(25);

    return pages.map(({ _id, title, posts }) => ({
        pageId: _id,
        title,
        email: "",
        isPage: true,
        randomPost: posts[Math.floor(Math.random() * posts.length)], //Obtiene un post random de cada pagina
    }));
};

const getRecommendedPosts = async (req, res) => {
    //Funcion para obtener los post recomendados que se mostraran en el feed
    try {
        const { email } = req.params; //Se recibe el email del usuario
        if (!email) return res.status(400).json({ message: "User email is required" });
        const user = await User.findOne({ email }); //Se busca al usuario
        if (!user) return res.status(404).json({ message: "User not found" });

        const { friends, followedPages } = user; //Se obtienen los amigos y paginas seguidas del usuario

        const pagesIds = followedPages.map((id) => new mongoose.Types.ObjectId(id)); //Convierte los id de las paginas a ObjectId

        //Si no tiene amigos y no sigue a nadie retorna las paginas iniciales

        if (friends.length === 0 && followedPages.length === 0) return res.status(200).json(await getInitialPosts());

        //Si tiene amigos o sigue alguna pagina obtiene los posts de los amigos y de las paginas que sigue
        const [friendPostsResult, independentPagesResult, userPagesResult] = await Promise.all([
            friends.length > 0 ? getFriendPosts(friends) : [],
            followedPages.length > 0 ? getFollowedIndependentPagesPosts(pagesIds) : [],
            followedPages.length > 0 ? getFollowedUserPagesPosts(pagesIds) : [],
        ]);

        const combinedResults = [...friendPostsResult, ...independentPagesResult, ...userPagesResult]; //Mezcla los resultados
        const shuffledResults = combinedResults.sort(() => Math.random() - 0.5); //Y lo desordena para no enviarlas en un unico orden

        return res.status(200).json(shuffledResults);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getFriends = async (req, res) => {
    //Funcion para obtener los amigos de un usuario
    try {
        const { email } = req.params; //Recibe el email del usuario

        if (!email) return res.status(400).json({ message: "User email is required" });

        const user = await User.findOne({ email }); //Busca al usuario

        if (!user) return res.status(404).json({ message: "User not found" });

        const friends = await User.find({ email: { $in: user.friends } }, { email: 1, username: 1, avatar: 1, _id: 0 }); //Obtiene los amigos de ese usuario

        return res.status(200).json(friends);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const removeFriend = async (req, res) => {
    //Funcion para eliminar un amigo
    try {
        const { userEmail, friendEmail } = req.body; //Recibe el email de ambos usuarios

        if (!userEmail || !friendEmail) {
            return res.status(400).json({ message: "Both userEmail and friendEmail are required" });
        }

        //Busca a ambos usuarios
        const user = await User.findOne({ email: userEmail });
        const friend = await User.findOne({ email: friendEmail });

        if (!user || !friend) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remover el amigo de ambas listas
        user.friends = user.friends.filter((email) => email !== friendEmail);
        friend.friends = friend.friends.filter((email) => email !== userEmail);

        await user.save();
        await friend.save();

        return res.status(200).json({ message: "Friend removed successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const followPage = async (req, res) => {
    //Funcion para seguir una pagina
    try {
        const { userEmail, pageId } = req.body; //Se recibe el correo del usuario y el id de la pagina

        if (!userEmail || !pageId) {
            return res.status(400).json({ message: "All fields required" });
        }

        // Validar que pageId sea un ObjectId valido
        if (!mongoose.Types.ObjectId.isValid(pageId)) {
            return res.status(400).json({ message: "The page id is invalid" });
        }

        const user = await User.findOne({ email: userEmail }); //Busca al usuario
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verificar si el usuario ya sigue la pagina
        if (user.followedPages.some((id) => id.equals(pageId))) {
            return res.status(400).json({ message: "Ya sigues esta página." });
        }

        // Agregar la pagina a la lista de paginas seguidas
        user.followedPages.push(pageId);
        await user.save();

        return res.status(200).json({
            message: "Page followed",
            followedPages: user.followedPages,
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const rejectUser = async (req, res) => {
    //Funcion para rechazar la solicitud de un usuario
    try {
        const { email } = req.params; //Recibe el email
        const { emailToReject } = req.body; //Y el email para rechazar
        if (!email || !emailToReject) {
            return res.status(400).json({ message: "Both email and emailToReject are required" });
        }

        //Busca ambos usuarios
        const user = await User.findOne({ email });
        const userToBlock = await User.findOne({ email: emailToReject });

        if (!user || !userToBlock) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remover el amigo de ambas listas
        user.rejectedUsers.push(emailToReject);
        await user.save();

        return res.status(200).json({ message: "User rejected successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const blockUser = async (req, res) => {
    try {
        // Recibe ambos correos
        const { email } = req.params;
        const { emailToBlock } = req.body;

        // Validar que los emails fueron proporcionados
        if (!email || !emailToBlock) {
            return res.status(400).json({ message: "Both email and emailToBlock are required" });
        }

        // Buscar a los usuarios en la base de datos
        const user = await User.findOne({ email });

        const userToBlock = await User.findOne({ email: emailToBlock });

        // Si alguno de los usuarios no existe, retorna error
        if (!user || !userToBlock) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verificar si ya está bloqueado
        if (user.Usersblocked.includes(emailToBlock)) {
            return res.status(400).json({ message: "User is already blocked" });
        }

        // Eliminarse mutuamente de la lista de amigos
        user.friends = user.friends.filter((friendEmail) => friendEmail !== emailToBlock);
        userToBlock.friends = userToBlock.friends.filter((friendEmail) => friendEmail !== email);

        // Agregar a la lista de bloqueados
        user.Usersblocked.push(emailToBlock);

        // Guardar cambios en la base de datos
        await user.save();
        await userToBlock.save();

        return res.status(200).json({ message: "User blocked successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getNotifications = async (req, res) => {
    //Funcion para obtener las notificaciones de un usuario
    try {
        const { email } = req.params; //Recibe el correo del usuario
        if (!email) {
            return res.status(400).json({ message: "User email is required" });
        }

        const user = await User.findOne({ email }); //Busca al usuario
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user.notifications); //Retorna las notificaciones
    } catch (errror) {
        return res.status(500).json({ message: error.message });
    }
};

const addNotification = async (userEmail, type, message, status) => {
    //Funcion para agregar una notificacion
    try {
        const user = await User.findOne({ email: userEmail }); //Busca al usuario
        if (!user) {
            throw new Error("User not found");
        }

        user.notifications.push({ type, message, status }); //Agrega la notificacion
        await user.save();

        //send email
        sendEmail(userEmail, `Notification of ${type}`, message); //Envia el correo 
    } catch (error) {
        console.error("Error adding notification:", error);
    }
};

const getUserPosts = async (req, res) => {
    //Funcion para obtener las publicaciones de un usuario
    try {
        const { email } = req.params; //recibe el email del usuario
        if (!email) {
            return res.status(400).json({ message: "User email is required" });
        }

        const user = await User.findOne({ email }).populate("posts"); //Busca al usuario y obtiene sus publicaciones
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user.posts); //retorna los posts
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createUser,
    addCommentToUserPost,
    addCommentToPagePost,
    insertUserPost,
    likeUserPost,
    likePagePost,
    deleteUser,
    updateUser,
    getUser,
    getUsers,
    sendFriendRequest,
    respondFriendRequest,
    getFriendRequests,
    getRecommendedPosts,
    getFriends,
    removeFriend,
    blockUser,
    rejectUser,
    followPage,
    addNotification,
    getNotifications,
    getUserbyEmail,
    getUserPosts,
};
