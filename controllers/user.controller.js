const User = require("../models/User");
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

const deleteUser = async (req, res) => {
    try {
        const { username } = req.params;
        if (!username) return res.status(204).json("Username is required");

        const userDelete = await User.findOne({ username });
        if (!userDelete) return res.status(404).json(`User ${username} to delete not found`);

        await User.findByIdAndDelete(userDelete.id);
        return res.status(200).json(`User ${username} deleted`);
    } catch (error) {
        return res.status(500).json(`Error: ${error.message}`);
    }
};

const updateUser = async (req, res) => {
    try {
        const { username } = req.params; // Cambiado de name a username

        if (!username) return res.status(204).json("Username is required");

        const { newUsername, email, password, bio, avatar } = req.body; // Cambiado de username a newUsername
        validateUserData(newUsername, email, password, avatar);
        console.log(username, newUsername, email, password, bio, avatar);

        const user = await User.findOne({ username });
        if (!user) return res.status(404).json(`User ${username} to update not found`);

        if (user.username !== newUsername) {
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
                avatar: avatar
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
        const { senderId, receiverId } = req.body;

        if (!senderId || !receiverId) {
            return res.status(400).json({ message: "Both sender and receiver are required" });
        }

        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ message: "User not found" });
        }

        if (receiver.friendRequests.includes(senderId)) {
            return res.status(400).json({ message: "Friend request already sent" });
        }

        receiver.friendRequests.push(senderId);
        await receiver.save();

        return res.status(200).json({ message: "Friend request sent successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const respondFriendRequest = async (req, res) => {
    try {
        const { userId, senderId, action } = req.body; // action: "accept" o "reject"

        if (!userId || !senderId) {
            return res.status(400).json({ message: "Both userId and senderId are required" });
        }

        const user = await User.findById(userId);
        const sender = await User.findById(senderId);

        if (!user || !sender) {
            return res.status(404).json({ message: "User not found" });
        }

        // Si la solicitud no existe, retornar error
        if (!user.friendRequests.includes(senderId)) {
            return res.status(400).json({ message: "No friend request found" });
        }

        // Si el usuario acepta la solicitud
        if (action === "accept") {
            user.friends.push(senderId);
            sender.friends.push(userId);
        }

        // Eliminar la solicitud de la lista
        user.friendRequests = user.friendRequests.filter(id => id.toString() !== senderId);
        await user.save();
        await sender.save();

        return res.status(200).json({ message: `Friend request ${action}ed successfully` });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const getFriendRequests = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findById(userId).populate("friendRequests", "username avatar");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ friendRequests: user.friendRequests });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



module.exports = {
    createUser,
    deleteUser,
    updateUser,
    getUser,
    getUsers,
    sendFriendRequest,
    respondFriendRequest,
    getFriendRequests,
};
