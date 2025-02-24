import bcrypt from "bcrypt";
import { User } from "../models/User.js";

export const validateUserData = (username, email, password, avatar) => {
    if (typeof username != "string") throw new Error("Username must be a string");
    if (username.length < 3) {
        throw new Error("The name must have 3 characters");
    }

    if (typeof email != "string") throw new Error("Email must be a string");
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        throw new Error("Invalid email format");
    }

    if (typeof password != "string") throw new Error("Password must be a string");
    if (password.length < 6) {
        throw new Error("The password must have 6 characters");
    }

    if (typeof avatar != "string") throw new Error("Avatar must be a string");
    if (
        ![
            "avatar1.png",
            "avatar2.png",
            "avatar3.png",
            "avatar4.png",
            "avatar5.png",
            "avatar6.png",
            "avatar7.png",
            "avatar8.png",
            "avatar9.png",
            "avatar10.png",
        ].includes(avatar)
    ) {
        throw new Error("Invalid avatar selection");
    }

    return true;
};

export const validateUserName = async (username, email) => {
    if (await User.findOne({ username })) throw new Error("The user already exists");
    if (await User.findOne({ email })) throw new Error("The email already exists");
};

export const generateHashPassword = async (password) => {
    try {
        const hashpassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
        return hashpassword;
    } catch (error) {
        throw new Error("Can not encript the password");
    }
};

export const validatePassword = async (loginPassword, userPassword) => {
    try {
        return await bcrypt.compare(loginPassword, userPassword);
    } catch (error) {
        throw new Error("Can not compare the passwords");
    }
};
