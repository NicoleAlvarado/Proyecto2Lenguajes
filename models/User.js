const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        default: "",
    },
    avatar: {
        type: String,
        required: true,
    },
});

module.exports = model("User", UserSchema);
