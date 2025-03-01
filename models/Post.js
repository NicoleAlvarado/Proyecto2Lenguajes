const mongoose = require("mongoose"); //Importa mongoose 
const { Schema, model } = mongoose; // importa el Schema de mongoose 
const Comment = require("./Comment"); //Importa el schema de comentarios 

const PostSchema = new Schema({ //Crea un schema para publicaciones que sirve para que un usuario cree un post o para que agregue un post a una pagina
    content: { //Tiene el contenido del post 
        type: String,
        required: true,
    },
    likes: [{ type: String }], // Array de emails de los usuarios que han dado like
    comments: [Comment.schema], //Tiene un array de comentarios 
    date: { //Tiene la fecha de la publicacion 
        type: Date,
        default: Date.now,
    },
});

module.exports = model("Post", PostSchema);
