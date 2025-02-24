import { User } from "../models/User.js";
import {
    validateUserData,
    validateUserName,
    generateHashPassword,
    validatePassword,
} from "../utility/user.validation.js";

export const createUser = async (req, res) => {
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

export const deleteUser = async (req, res) => {
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

export const updateUser = async (req, res) => {
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

export const getUser = async (req, res) => {
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

// Registrar una nueva compra
export const registerPurchase = async (req, res) => {
    try {
        const { username } = req.params;
        const { courseId } = req.body;

        if (!username || !courseId) {
            console.log(username, courseId);
            return res.status(400).json("Username and Course ID are required");
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json("User not found");
        }

        const course = await findById(courseId);
        if (!course) {
            return res.status(404).json("Course not found");
        }

        if (user.purchaseCourses.includes(courseId)) {
            return res.status(400).json("Course already purchased");
        }

        if (!course.available) {
            return res.status(400).json("Course not available");
        }

        user.purchaseCourses.push(courseId);
        await user.save();

        return res.status(201).json("Purchase registered successfully");
    } catch (error) {
        return res.status(500).json(`Error: ${error.message}`);
    }
};

// Obtener la lista de compras por usuario
export const getPurchasesByUser = async (req, res) => {
    try {
        const { username } = req.params;

        if (!username) {
            return res.status(400).json("User ID is required");
        }

        const user = await User.findOne({ username: username }).populate("purchaseCourses");
        if (!user) {
            return res.status(404).json("User not found");
        }

        return res.status(200).json(user.purchaseCourses);
    } catch (error) {
        return res.status(500).json(`Error: ${error.message}`);
    }
};
