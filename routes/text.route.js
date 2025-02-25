const { Router } = require("express");
const { insertText, getRandomText } = require("../controllers/text.controller");

const createTextRouter = () => {
    const router = Router();

    router.post("/insertText", insertText);
    router.get("/getRandomText", getRandomText);

    return router;
};

module.exports = { createTextRouter };
