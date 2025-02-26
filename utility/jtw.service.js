const jwt = require("jsonwebtoken");
const { SECRET_KEY, REFRESH_SECRET_KEY, NODE_ENV } = require("./environment");

const getTokenCookieConfig = (maxAgeMinutes) => ({
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * maxAgeMinutes,
});

const generateToken = (payload, secret, expiresIn) => jwt.sign(payload, secret, { expiresIn });

const verifyToken = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
};

const generateAuthTokens = (user, res) => {
    try {
        const payload = { id: user._id, username: user.username };

        const accessToken = generateToken(payload, SECRET_KEY, "5m");
        const refreshToken = generateToken(payload, REFRESH_SECRET_KEY, "7d");

        res.cookie("access_token", accessToken, getTokenCookieConfig(5));
        res.cookie("refresh_token", refreshToken, getTokenCookieConfig(60 * 24 * 7));

        return res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        return res.status(500).json({ message: "Error generating tokens", error: error.message });
    }
};

const refreshAccessToken = (refreshToken) => {
    const decoded = verifyToken(refreshToken, REFRESH_SECRET_KEY);
    if (!decoded) return null;

    const payload = { id: decoded.id, username: decoded.username };
    return generateToken(payload, SECRET_KEY, "5m");
};

module.exports = {
    getTokenCookieConfig,
    generateToken,
    verifyToken,
    generateAuthTokens,
    refreshAccessToken,
};
