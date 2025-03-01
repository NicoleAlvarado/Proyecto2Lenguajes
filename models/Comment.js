const mongoose = require("mongoose"); //Se exporta mongoose 
const { Schema, model } = mongoose; // se exporta el Schema de mongoose 

const CommentSchema = new Schema({ //Esquema para los comentarios 
    userEmail: { //Tiene el email del usuario que hace el comentario 
        type: String,
        required: true,
    },
    comment: { //Tiene el comentario 
        type: String,
        required: true,
    },
    date: { //Tiene la fecha 
        type: Date,
        default: Date.now,
    },
});

module.exports = model("Comment", CommentSchema);
