import { Router } from "express";
import { loginUser, refreshAccessToken, getUserInSession, logoutUser } from "../controllers/login.controller.js";
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
    router.post("/login", loginUser);
    router.post("/refresh-token", refreshAccessToken);
    router.put("/updateUser/:username", updateUser);
    router.delete("/deleteUser/:username", deleteUser);
    router.get("/getUser/:username", getUser);
    router.get("/getPurchasesByUser/:username", getPurchasesByUser);
    router.get("/login/session", getUserInSession);
    router.get("/login/logout", logoutUser);
    return router;
};
