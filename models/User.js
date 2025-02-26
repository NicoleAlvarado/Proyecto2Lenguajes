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
    friends: [{ type: String }], // Lista de usernames de amigos
    friendRequests: [{ type: String }], // Lista de usernames de solicitudes pendientes
    followedPages: [{ type: String }], // GUARDAR EL ID DE LA PAGINAS, CUANDO SE LE DA A SEGUIR (FELIPE)
});

module.exports = model("User", UserSchema);