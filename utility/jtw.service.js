import jwt from "jsonwebtoken";
import { SECRET_KEY, REFRESH_SECRET_KEY, NODE_ENV } from "./environment.js";

export const getTokenCookieConfig = (maxAgeMinutes) => ({
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * maxAgeMinutes,
});

export const generateToken = (payload, secret, expiresIn) => jwt.sign(payload, secret, { expiresIn });

export const verifyToken = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
};

export const generateAuthTokens = (user, res) => {
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

export const refreshAccessToken = (refreshToken) => {
    const decoded = verifyToken(refreshToken, REFRESH_SECRET_KEY);
    if (!decoded) return null;

    const payload = { id: decoded.id, username: decoded.username };
    return generateToken(payload, SECRET_KEY, "5m");
};
