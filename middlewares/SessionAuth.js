import jwt from "jsonwebtoken";

export const sessionMiddleware = (req, res, next) => {
    const token = req.cookies.access_token;
    req.session = { user: null };

    try {
        const userData = jwt.verify(token, process.env.SECRET_KEY);
        req.session.user = userData;
    } catch {}

    next();
};
