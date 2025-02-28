const { Router } = require("express"); //Importa solo el metodo Router de express

const { createPageRouter } = require("./routes/page.route"); //Importa la funcion createPageRouter del archivo page.route para habilitar la ruta /pages
const { createTextRouter } = require("./routes/text.route"); //Importa la funcion createTextRouter del archivo text.route para habilitar la ruta /texts
const { createUserRouter } = require("./routes/user.route"); //Importa la funcion createUserRouter del archivo user.route para habilitar la ruta /users

const createAPIRouter = () => { //Crea la funcion createAPIRouter que es la que se utilizara en el index.js
    const router = Router(); //Crea la variable router que es igual a Router

    router.use("/pages", createPageRouter()); //Habilita la ruta /pages
    router.use("/users", createUserRouter()); //Habilita la ruta /users
    router.use("/texts", createTextRouter()); //Habilita la ruta /texts

    return router; //Retorna el router
};

module.exports = { createAPIRouter }; //Exporta la funcion createAPIRouter

 