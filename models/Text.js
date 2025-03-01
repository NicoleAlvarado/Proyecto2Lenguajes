const mongoose = require("mongoose"); //Exporta mongoose
const { Schema, model } = mongoose; //exporta el schema de mongoose 

const TextSchema = new Schema({ //Crea un esquema de textos para utilizarlo en los cron jobs 
    text: { // unicamente tiene el texto 
        type: String,
        required: true,
    },
});

module.exports = model("Text", TextSchema);
