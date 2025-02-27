const { Router } = require("express");
const {
    insertPage,
    addPostToPage,
    insertUserPage,
    updateUserPage,
    deleteUserPage,
    getUserPages,
    getRecommendedPages,
    getRamdomPage,
} = require("../controllers/page.controller");

const createPageRouter = () => {
    const router = Router();

    //agregar una validacion en el middleware para que solo los usuarios logueados puedan acceder a las rutas
    router.post("/insertPage", insertPage);
    router.post("/addPostToPage/:email/:pageId", addPostToPage);
    router.post("/insertUserPage/:email", insertUserPage);
    router.put("/updateUserPage/:email/:pageId", updateUserPage);
    router.delete("/deleteUserPage/:username/:pageId", deleteUserPage);
    router.get("/getUserPages/:email", getUserPages);
    router.get("/getRecommendedPages/:email", getRecommendedPages);
    router.get("/getRamdomPage", getRamdomPage);

    return router;
};

module.exports = { createPageRouter };
