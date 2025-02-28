const Text = require("../models/Text"); // Importa el modelo Text

const insertText = async (req, res) => { //Metodo para insertar un texto
    try {
        const { text } = req.body; //Extrae el texto del cuerpo de la solicitud
        const newText = new Text({ text }); //Crea un nuevo objeto Text

        res.status(201).json(await newText.save()); //Guarda el objeto en la base de datos y devuelve el objeto guardado
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRandomText = async (req, res) => { //Metodo para obtener un texto aleatorio
    try {
        const [randomText] = await Text.aggregate([{ $sample: { size: 1 } }]); //Obtiene un texto aleatorio de la base de datos
        res.status(200).json(randomText); //Devuelve el texto aleatorio
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

module.exports = { insertText, getRandomText }; //Exporta los metodos insertText y getRandomText
