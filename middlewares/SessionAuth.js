const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../utility/environment");

const sessionMiddleware = (req, res, next) => {
    const token = req.cookies.access_token;
    req.session = { user: null };

    try {
        const userData = jwt.verify(token, SECRET_KEY);
        req.session.user = userData;
    } catch {}

    next();
};

module.exports = { sessionMiddleware };
