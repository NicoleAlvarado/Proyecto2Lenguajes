const User = require("../models/User");
const Page = require("../models/Page");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const mongoose = require("mongoose");

const {
    validateUserData,
    validateUserName,
    generateHashPassword,
    validatePassword,
} = require("../utility/user.validation");

const createUser = async (req, res) => {
    try {
        const { username, email, password, bio, avatar } = req.body;
        validateUserData(username, email, password, avatar);
        await validateUserName(username, email);
        const hashPassword = await generateHashPassword(password);

        const user = new User({ username, email, password: hashPassword, bio, avatar });
        await user.save();
        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json(`${error}`);
    }
};

const addCommentToUserPost = async (req, res) => {
    try {
        const { commentPostUserEmail, postId } = req.params;
        const { userEmail, comment } = req.body;

        const user = await User.findOne({ email: commentPostUserEmail });
        const post = user.posts.id(postId);
        post.comments.push(new Comment({ userEmail, comment }));

        res.status(200).json(await user.save());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addCommentToPagePost = async (req, res) => {
    try {
        const { pageId, postId } = req.params;
        const { userEmail, comment } = req.body;

        let page = await Page.findById(pageId);

        if (!page) {
            const userWithPage = await User.findOne({ "pages._id": pageId });
            page = userWithPage.pages.id(pageId);
        }

        const post = page.posts.id(postId);
        post.comments.push(new Comment({ userEmail, comment }));

        res.status(200).json(page.parent() ? await page.parent().save() : page.save());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const insertUserPost = async (req, res) => {
    try {
        const { email } = req.params;
        const { content } = req.body;

        const user = await User.findOne({ email });
        user.posts.push(new Post({ content }));

        res.status(201).json(await user.save());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const likeUserPost = async (req, res) => {
    try {
        const { likedPostUserEmail, postId } = req.params;
        const { userEmail } = req.body;

        const user = await User.findOne({ email: likedPostUserEmail });
        const post = user.posts.id(postId);
        const likeIndex = post.likes.indexOf(userEmail);

        likeIndex === -1 ? post.likes.push(userEmail) : post.likes.splice(likeIndex, 1);

        res.status(201).json(await user.save());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const likePagePost = async (req, res) => {
    try {
        const { pageId, postId } = req.params;
        const { userEmail } = req.body;

        let page = await Page.findById(pageId);

        if (!page) {
            const userWithPage = await User.findOne({ "pages._id": pageId });
            page = userWithPage.pages.id(pageId);
        }

        const post = page.posts.id(postId);
        const likeIndex = post.likes.indexOf(userEmail);

        likeIndex === -1 ? post.likes.push(userEmail) : post.likes.splice(likeIndex, 1);

        res.status(201).json(page.parent() ? await page.parent().save() : page.save());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { email } = req.params;
        if (!email) return res.status(400).json("Email is required");

        console.log("email", email);
        const userDelete = await User.findOne({ email });
        if (!userDelete) return res.status(404).json(`User with email ${email} to delete not found`);

        console.log("userDelete", userDelete);

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
    try {
        const { useremail } = req.params; // Cambiado de name a useremail
        console.log("useremail", useremail);
        if (!useremail) return res.status(204).json("useremail is required");

        const { newUsername, email, password, bio, avatar } = req.body; // Cambiado de username a newUsername
        validateUserData(newUsername, email, password, avatar);
        console.log(useremail, newUsername, email, password, bio, avatar);

        const user = await User.findOne({ email: useremail });
        if (!user) return res.status(404).json(`User with email ${useremail} to update not found`);

        if (user.email !== email) {
            await validateUserName(newUsername, email);
        }

        let modifyPassword = user.password;
        if (!(await validatePassword(modifyPassword, password))) {
            modifyPassword = await generateHashPassword(password);
        }

        const updatedUser = await User.findByIdAndUpdate(
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
    try {
        const { username } = req.params;
        if (!username) return res.status(204).json("Username is required");
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json("User not found");
        return res.status(200).json(user);
    } catch (error) {
        return res.status(404).json(error.message);
    }
};

const getUsers = async (req, res) => {
    try {
        return res.status(200).json(await User.find());
    } catch (error) {
        return res.status(404).json(error.message);
    }
};

const sendFriendRequest = async (req, res) => {
    try {
        const { senderEmail, receiverEmail } = req.body;

        if (!senderEmail || !receiverEmail) {
            return res.status(400).json({ message: "Both senderEmail and receiverEmail are required" });
        }

        const sender = await User.findOne({ email: senderEmail });
        const receiver = await User.findOne({ email: receiverEmail });

        if (!sender || !receiver) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verificar si ya son amigos
        if (sender.friends.includes(receiverEmail) || receiver.friends.includes(senderEmail)) {
            return res
                .status(400)
                .json({ message: "You are already friends with this user", status: "already_friends" });
        }

        // Verificar si la solicitud ya ha sido enviada
        if (receiver.friendRequests.includes(sender.email)) {
            return res.status(400).json({ message: "Friend request already sent", status: "already_sent" });
        }

        // Agregar la solicitud de amistad
        receiver.friendRequests.push(sender.email);
        await receiver.save();

        return res.status(200).json({ message: "Friend request sent successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const respondFriendRequest = async (req, res) => {
    try {
        const { userEmail, senderEmail, action } = req.body; // action: "accept" o "reject"

        if (!userEmail || !senderEmail) {
            return res.status(400).json({ message: "Both userEmail and senderEmail are required" });
        }

        const user = await User.findOne({ email: userEmail });
        const sender = await User.findOne({ email: senderEmail });

        if (!user || !sender) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verificar si la solicitud existe
        if (!user.friendRequests.includes(sender.email)) {
            return res.status(400).json({ message: "No friend request found" });
        }

        // Si el usuario acepta la solicitud
        if (action === "accept") {
            user.friends.push(sender.email);
            sender.friends.push(user.email);
        }

        // Eliminar la solicitud de la lista
        user.friendRequests = user.friendRequests.filter((email) => email !== sender.email);
        await user.save();
        await sender.save();

        return res.status(200).json({ message: `Friend request ${action}ed successfully` });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getFriendRequests = async (req, res) => {
    try {
        const { email } = req.params;
        if (!email) {
            return res.status(400).json({ message: "User email is required" });
        }

        const user = await User.findOne({ email }).populate("friendRequests");

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
    const users = await User.find({ email: { $in: friends }, "posts.0": { $exists: true } }).limit(25);

    return users.map(({ username, email, avatar, posts }) => ({
        pageId: 0,
        username,
        email,
        avatar,
        isPage: false,
        randomPost: posts[Math.floor(Math.random() * posts.length)],
    }));
};

const getFollowedIndependentPagesPosts = async (pageIds) => {
    const pages = await Page.find({ _id: { $in: pageIds }, "posts.0": { $exists: true } }).limit(25);

    return pages.map(({ _id, title, posts }) => ({
        pageId: _id,
        title,
        email: "",
        isPage: true,
        randomPost: posts[Math.floor(Math.random() * posts.length)],
    }));
};

const getFollowedUserPagesPosts = async (pageIds) => {
    const users = await User.find({ "pages._id": { $in: pageIds }, "pages.posts.0": { $exists: true } }).limit(25);

    return users.flatMap((user) =>
        user.pages
            .filter((page) => pageIds.some((id) => id.toString() === page._id.toString()) && page.posts.length > 0)
            .map(({ _id, title, email, posts }) => ({
                pageId: _id,
                title,
                email,
                isPage: true,
                randomPost: posts[Math.floor(Math.random() * posts.length)],
            }))
    );
};

const getInitialPosts = async () => {
    const pages = await Page.find({ "posts.0": { $exists: true } }).limit(25);

    return pages.map(({ _id, title, posts }) => ({
        pageId: _id,
        title,
        email: "",
        isPage: true,
        randomPost: posts[Math.floor(Math.random() * posts.length)],
    }));
};

const getRecommendedPosts = async (req, res) => {
    try {
        const { email } = req.params;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        const { friends, followedPages } = user;
        const pagesIds = followedPages.map((id) => new mongoose.Types.ObjectId(id));

        if (friends.length === 0 && followedPages.length === 0) return res.status(200).json(await getInitialPosts());

        const [friendPostsResult, independentPagesResult, userPagesResult] = await Promise.all([
            friends.length > 0 ? getFriendPosts(friends) : [],
            followedPages.length > 0 ? getFollowedIndependentPagesPosts(pagesIds) : [],
            followedPages.length > 0 ? getFollowedUserPagesPosts(pagesIds) : [],
        ]);

        const combinedResults = [...friendPostsResult, ...independentPagesResult, ...userPagesResult];
        const shuffledResults = combinedResults.sort(() => Math.random() - 0.5);

        return res.status(200).json(shuffledResults);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getFriends = async (req, res) => {
    try {
        const { email } = req.params;
        if (!email) {
            return res.status(400).json({ message: "User email is required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Obtener información de los amigos (nombre, avatar, email)
        const friendsList = await Promise.all(
            user.friends.map(async (friendEmail) => {
                const friend = await User.findOne({ email: friendEmail });
                return friend ? { email: friend.email, username: friend.username, avatar: friend.avatar } : null;
            })
        );

        return res.status(200).json(friendsList.filter((friend) => friend !== null));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const removeFriend = async (req, res) => {
    try {
        const { userEmail, friendEmail } = req.body;

        if (!userEmail || !friendEmail) {
            return res.status(400).json({ message: "Both userEmail and friendEmail are required" });
        }

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
    try {
        const { userEmail, pageId } = req.body;

        if (!userEmail || !pageId) {
            return res.status(400).json({ message: "User email and Page ID are required" });
        }

        // Verificar si el pageId es un formato válido de MongoDB
        if (!mongoose.Types.ObjectId.isValid(pageId)) {
            return res.status(400).json({ message: "Invalid Page ID" });
        }

        const user = await User.findOne({ email: userEmail });
        const page = await Page.findById(pageId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!page) {
            return res.status(404).json({ message: "Page not found" });
        }

        // Verificar si ya sigue la página
        if (user.followedPages.includes(pageId)) {
            return res.status(400).json({ message: "You already follow this page" });
        }

        // Agregar la página a la lista de seguidas
        user.followedPages.push(pageId);
        await user.save();

        return res.status(200).json({ message: "Page followed successfully", followedPages: user.followedPages });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const rejectUser = async (req, res) => {
    try {
        const { email } = req.params;
        const { emailToReject } = req.body;
        if (!email || !emailToReject) {
            return res.status(400).json({ message: "Both email and emailToReject are required" });
        }

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
        const { email } = req.params;
        const { emailToBlock } = req.body;
        if (!email || !emailToBlock) {
            return res.status(400).json({ message: "Both email and emailToBlock are required" });
        }

        const user = await User.findOne({ email });
        const userToBlock = await User.findOne({ email: emailToBlock });

        if (!user || !userToBlock) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remover el amigo de ambas listas
        user.Usersblocked.push(emailToBlock);
        await user.save();

        return res.status(200).json({ message: "User blocked successfully" });
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
};
