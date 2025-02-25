import { Router } from "express";
import { loginUser, refreshToken, logoutUser } from "../controllers/login.controller.js";
import {
    createUser,
    updateUser,
    deleteUser,
    getUser,
    registerPurchase,
    getPurchasesByUser,
} from "../controllers/user.controller.js";

export const createUserRouter = () => {
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
