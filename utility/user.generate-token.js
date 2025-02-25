import jwt from "jsonwebtoken";
import { SECRET_KEY, REFRESH_SECRET_KEY, NODE_ENV } from "./environment.js";

export const getTokenSettings = (maxAge) => ({
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * maxAge,
});

export const generateTokens = async ({ id, username }, res) => {
    try {
        const accessToken = jwt.sign({ id, username }, SECRET_KEY, { expiresIn: "5m" });
        const refreshToken = jwt.sign({ id, username }, REFRESH_SECRET_KEY, { expiresIn: "7d" });

        res.cookie("access_token", accessToken, getTokenSettings(5));
        res.cookie("refresh_token", refreshToken, getTokenSettings(60 * 24 * 7));

        return res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        return res.status(500).json({ message: "Error generating tokens", error: error.message });
    }
};