import { Schema, model } from "mongoose";

const TextSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
});

export const Text = model("Text", TextSchema);
