const mongoose = require("mongoose"); //Exporta mongoose
const { Schema, model } = mongoose; //Exporta el Schema de mongoose 
const Page = require("./Page"); //Exporta el modelo de paginas 
const Post = require("./Post"); //Exporta el modelo de publicaciones

const NotificationSchema = new Schema({ //Crea un esquema para las notificaciones 
    type: { type: String, required: true }, //Tiene un tipo de notificacion
    message: { type: String, required: true }, //un mensaje 
    timestamp: { type: Date, default: Date.now }, //La fecha y hora de la notificacion
    status: { type: String, default: "unread" }, //Y el estado de la notificacion 
});

const UserSchema = new Schema({ //Crea un esquema para los usuarios 
    username: { type: String, required: true, unique: true }, //Tiene un nombre de usuario 
    email: { type: String, required: true, unique: true }, //Tiene un email
    password: { type: String, required: true }, //Tiene una contrasenia
    bio: { type: String, default: "" }, //Tiene una biografia que por defecto es un string vacio en caso de que no se ingrese nada 
    avatar: { type: String, required: true }, //Tiene un avatar que es la ruta de la imagen a utilizar 
    pages: [Page.schema], //Tiene un esquema de paginas que son las pagina que creo el usuario 
    posts: [Post.schema], //Tiene un esquema de posts que son los post que crea el usuario fuera de las paginas, en su perfil normal 
    friends: [{ type: String }], // Lista de emails de los amigos que tiene el usuario 
    friendRequests: [{ type: String }], // Lista de emails de las solicitudes de amistad pendientes
    followedPages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Page" }], //Lista de ids de las paginas que sigue el usuario 
    Usersblocked: [{ type: String }], // Lista de emails de usuarios bloqueados
    rejectedUsers: [{ type: String }], // Lista de emails de usuarios rechazados
    notifications: [NotificationSchema], // Lista de notificaciones
});

module.exports = model("User", UserSchema);
