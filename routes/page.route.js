const { Router } = require("express");
const {
    insertPage,
    insertPostInPage,
    insertUserPage,
    updateUserPage,
    deleteUserPage,
    getPages,
    getRamdomPage,
} = require("../controllers/page.controller");

const createPageRouter = () => {
    const router = Router();

    router.post("/insertPage", insertPage);
    router.post("/insertPostInPage/:pageId", insertPostInPage);
    router.post("/insertUserPage/:username", insertUserPage);
    router.put("/updateUserPage/:username/:pageId", updateUserPage);
    router.delete("/deleteUserPage/:username/:pageId", deleteUserPage);
    router.get("/getPages", getPages);
    router.get("/getRamdomPage", getRamdomPage);

    return router;
};

module.exports = { createPageRouter };
