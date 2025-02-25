const { Router } = require("express");
const { loginUser, refreshToken, logoutUser } = require("../controllers/login.controller");
const {
    createUser,
    updateUser,
    deleteUser,
    getUser,
    registerPurchase,
    getPurchasesByUser,
} = require("../controllers/user.controller");

const createUserRouter = () => {
    const router = Router();

    router.post("/createUser", createUser);
    router.post("/registerPurchase/:username", registerPurchase);
    router.post("/loginUser", loginUser);
    router.post("/refreshToken", refreshToken);
    router.put("/updateUser/:username", updateUser);
    router.delete("/deleteUser/:username", deleteUser);
    router.get("/getUser/:username", getUser);
    router.get("/getPurchasesByUser/:username", getPurchasesByUser);
    router.get("/login/logout", logoutUser);

    return router;
};

module.exports = { createUserRouter };
