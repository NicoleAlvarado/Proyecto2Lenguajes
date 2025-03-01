const mongoose = require("mongoose"); //Exporta mongoose 
const { Schema, model } = mongoose; //exporta el schema de mongoose 
const Post = require("./Post"); //Exporta el schema de posts 

const PageSchema = new Schema({ //Crea un esquema para las paginas 
    title: { // La pagina tiene un titulo
        type: String,
        required: true,
    },
    description: { //Una descripcion 
        type: String,
        required: true,
    },
    phone: { //Un telefono 
        type: String,
        required: true,
    },
    email: { //un email propio de la pagina 
        type: String,
        required: true,
    },
    address: { //una direccion 
        type: String,
        required: true,
    },
    posts: [Post.schema], //y tiene un arreglo de posts 
});

PageSchema.index({ title: 1 }, { unique: true });

module.exports = model("Page", PageSchema);
