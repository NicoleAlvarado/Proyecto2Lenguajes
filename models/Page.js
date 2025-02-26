const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const Post = require("./Post");

const PageSchema = new Schema({
    title: {
        type: String,
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

PageSchema.index({ title: 1 }, { unique: true });

module.exports = model("Page", PageSchema);
