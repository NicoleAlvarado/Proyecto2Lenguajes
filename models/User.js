const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const Page = require("./Page");
const Post = require("./Post");

const NotificationSchema = new Schema({
    type: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, default: "unread" },
});

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: "" },
    avatar: { type: String, required: true },
    pages: [Page.schema],
    posts: [Post.schema],
    friends: [{ type: String }], // Lista de usernames de *Email* de amigos
    friendRequests: [{ type: String }], // Lista de usernames de solicitudes pendientes
   followedPages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Page" }],
 // GUARDAR EL ID DE LA PAGINAS, CUANDO SE LE DA A SEGUIR (FELIPE)
    Usersblocked: [{ type: String }],  // Lista de emails de usuarios bloqueados
    rejectedUsers: [{ type: String }], // Lista de emails de usuarios rechazados
    notifications: [NotificationSchema], // Lista de notificaciones
});

module.exports = model("User", UserSchema);
