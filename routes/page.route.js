import { Router } from "express";
import { insertPage, getPages } from "../controllers/page.controller.js";

export const createPageRouter = () => {
    const router = Router();
    router.post("/insertPage", insertPage);
    router.get("/getPages", getPages);
    return router;
};
