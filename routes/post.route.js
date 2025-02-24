import { Router } from "express";
import { insertPost, getPosts } from "../controllers/post.controller.js";

export const createPostRouter = () => {
    const router = Router();
    router.post("/insertPost", insertPost);
    router.get("/getPosts", getPosts);
    return router;
};
