const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const Post = require("./Post");

const PageSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    posts: [Post.schema],
});

module.exports = model("Page", PageSchema);
