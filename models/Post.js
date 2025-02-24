import { Schema, model } from "mongoose";

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

export const Post = model("Post", PostSchema);
