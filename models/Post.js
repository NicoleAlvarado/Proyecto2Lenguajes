const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PostSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = model("Post", PostSchema);
