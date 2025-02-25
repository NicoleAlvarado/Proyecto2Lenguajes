import { Router } from "express";
import { insertText, getRandomText } from "../controllers/text.controller.js";

export const createTextRouter = () => {
    const router = Router();

    router.post("/insertText", insertText);
    router.get("/getRandomText", getRandomText);

    return router;
}