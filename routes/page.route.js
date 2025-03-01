const { Router } = require("express"); // Importar el modulo Router de express
const { // Importar los metodos del controlador page.controller
    addPostToPage,
    insertUserPage,
    updateUserPage,
    getUserPages,
    getRecommendedPages,
    getRamdomPage,
    getPagePosts
} = require("../controllers/page.controller");



const createPageRouter = () => { //Funcion para crear el router de las rutas de las paginas
    const router = Router(); //Inicializa el router
    // Definir las rutas
    router.post("/addPostToPage/:email/:pageId", addPostToPage);
    router.post("/insertUserPage/:email", insertUserPage);
    router.put("/updateUserPage/:email/:pageId", updateUserPage);
    router.get("/getUserPages/:email", getUserPages);
    router.get("/getRecommendedPages/:email", getRecommendedPages);
    router.get("/getRamdomPage", getRamdomPage);
    router.get("/getPagePosts/:email/:pageId", getPagePosts); 


    return router; //Retorna el router
};

module.exports = { createPageRouter }; //Exporta la funcion createPageRouter
