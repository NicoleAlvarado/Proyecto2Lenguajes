const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const Page = require("./Page");
const Post = require("./Post");

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: "" },
    avatar: { type: String, required: true },
    pages: [Page.schema],
    posts: [Post.schema],
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }], // Lista de amigos
    friendRequests: [{ type: Schema.Types.ObjectId, ref: "User" }] // Solicitudes pendientes
});


module.exports = model("User", UserSchema);
