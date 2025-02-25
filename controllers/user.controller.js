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
        const { name } = req.params;
        if (!name) return res.status(204).json("Username is required");

        const { username, password } = req.body;
        validateUserData(username, password);

        const user = await User.findOne({ username: name });
        if (!user) return res.status(404).json(`User ${name} to update not found`);

        if (user.username !== username) {
            await validateUserName(username);
        }

        let modifyPassword = user.password;
        if (!(await validatePassword(modifyPassword, password))) {
            modifyPassword = await generateHashPassword(password);
        }

        const updatedUser = await User.findByIdAndUpdate(
            user.id,
            { username, password: modifyPassword },
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

module.exports = {
    createUser,
    deleteUser,
    updateUser,
    getUser,
    getUsers,
};
