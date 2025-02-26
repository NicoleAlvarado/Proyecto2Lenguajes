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
        const { email } = req.params;
        if (!email) return res.status(204).json("Email is required");
        console.log('email', email);
        const userDelete = await User.findOne({ email });
        if (!userDelete) return res.status(404).json(`User with email ${email} to delete not found`);

        await User.findByIdAndDelete(userDelete.id);
        return res.status(200).json(`User with email ${email} deleted`);
    } catch (error) {
        return res.status(500).json(`Error: ${error.message}`);
    }
};

const updateUser = async (req, res) => {
    try {
        const { useremail } = req.params; // Cambiado de name a useremail
        console.log('useremail', useremail);
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
        const { senderEmail, receiverEmail } = req.body;

        if (!senderEmail || !receiverEmail) {
            return res.status(400).json({ message: "Both senderEmail and receiverEmail are required" });
        }

        const sender = await User.findOne({ email: senderEmail });
        const receiver = await User.findOne({ email: receiverEmail });

        if (!sender || !receiver) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verificar si la solicitud ya ha sido enviada
        if (receiver.friendRequests.includes(sender.email)) {
            return res.status(400).json({ message: "Friend request already sent" });
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
        user.friendRequests = user.friendRequests.filter(email => email !== sender.email);
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
        const requestsWithDetails = await Promise.all(user.friendRequests.map(async (requestEmail) => {
            const sender = await User.findOne({ email: requestEmail });
            return {
                email: sender.email,
                username: sender.username,
                avatar: sender.avatar,
            };
        }));

        return res.status(200).json(requestsWithDetails);
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
