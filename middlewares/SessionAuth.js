import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../utility/environment.js";

export const sessionMiddleware = (req, res, next) => {
    const token = req.cookies.access_token;
    req.session = { user: null };

    try {
        const userData = jwt.verify(token, SECRET_KEY);
        req.session.user = userData;
    } catch {}

    next();
};
