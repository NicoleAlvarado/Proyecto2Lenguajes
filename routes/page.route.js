const { Router } = require("express");
const {
    insertPage,
    addPostToPage,
    insertUserPage,
    updateUserPage,
    deleteUserPage,
    getPages,
    getRamdomPage,
} = require("../controllers/page.controller");

const createPageRouter = () => {
    const router = Router();

    //agregar una validacion en el middleware para que solo los usuarios logueados puedan acceder a las rutas
    router.post("/insertPage", insertPage);
    router.post("/addPostToPage/:email/:pageId", addPostToPage);
    router.post("/insertUserPage/:username", insertUserPage);
    router.put("/updateUserPage/:username/:pageId", updateUserPage);
    router.delete("/deleteUserPage/:username/:pageId", deleteUserPage);
    router.get("/getPages", getPages);
    router.get("/getRamdomPage", getRamdomPage);

    return router;
};

module.exports = { createPageRouter };
