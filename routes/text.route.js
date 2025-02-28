const { Router } = require("express"); // Importa el metodo Router de express
const { insertText, getRandomText } = require("../controllers/text.controller"); // Importa los metodos insertText y getRandomText del controlador text.controller

const createTextRouter = () => { //Crea un router para los metodos de text
    const router = Router(); //Crea un router

    router.post("/insertText", insertText); //Crea una ruta para insertar un texto
    router.get("/getRandomText", getRandomText); //Crea una ruta para obtener un texto aleatorio

    return router; //Devuelve el router
};

module.exports = { createTextRouter }; //Exporta el metodo createTextRouter
