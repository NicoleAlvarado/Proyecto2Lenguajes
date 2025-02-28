const { Router } = require("express"); //Importa solo el metodo Router de express

const { createPageRouter } = require("./routes/page.route");
const { createTextRouter } = require("./routes/text.route");
const { createUserRouter } = require("./routes/user.route");

const createAPIRouter = () => {
    const router = Router();

    router.use("/pages", createPageRouter());
    router.use("/users", createUserRouter());
    router.use("/texts", createTextRouter());

    return router;
};

module.exports = { createAPIRouter };
