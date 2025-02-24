import { Router } from "express";
import { insertPage, insertPostInPage, getPages, getRamdomPage } from "../controllers/page.controller.js";

export const createPageRouter = () => {
    const router = Router();
    router.post("/insertPage", insertPage);
    router.post("/insertPostInPage/:id", insertPostInPage);
    router.get("/getPages", getPages);
    router.get("/getRamdomPage", getRamdomPage);
    return router;
};
