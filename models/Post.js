const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const Comment = require("./Comment");

const PostSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    likes: [{ type: String }], // Array de emails
    comments: [Comment.schema],
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = model("Post", PostSchema);
