const { Router } = require("express");
const {
    insertPage,
    insertPostInPage,
    updatePage,
    deletePage,
    getPages,
    getRamdomPage,
} = require("../controllers/page.controller");

const createPageRouter = () => {
    const router = Router();

    router.post("/insertPage", insertPage);
    router.post("/insertPostInPage/:id", insertPostInPage);
    router.put("/updatePage/:id", updatePage);
    router.delete("/deletePage/:id", deletePage);
    router.get("/getPages", getPages);
    router.get("/getRamdomPage", getRamdomPage);

    return router;
};

module.exports = { createPageRouter };
