const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const TextSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
});

module.exports = model("Text", TextSchema);