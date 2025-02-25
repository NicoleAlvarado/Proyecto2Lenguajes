import { User } from "../models/User.js";
import { getTokenCookieConfig, generateAuthTokens, refreshAccessToken } from "../utility/jtw.service.js";
import { validatePassword } from "../utility/user.validation.js";

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
        const user = await User.findOne({ email });

        if (!user || !(await validatePassword(password, user.password)))
            return res.status(401).json({ message: "Invalid email or password" });

        return generateAuthTokens(user);
    } catch (error) {
        return res.status(500).json({ message: "Cannot create token", error: error.message });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const { refresh_token } = req.cookies;

        const newAccessToken = refreshAccessToken(refresh_token);

        res.cookie("access_token", newAccessToken, getTokenCookieConfig(15));

        return res.status(200).json({ success: true, accessToken: newAccessToken });
    } catch (error) {
        return res.status(500).json({ message: "Cannot refresh token", error: error.message });
    }
};

export const logoutUser = (req, res) => {
    try {
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        
        return res.status(200).json({ message: "El usuario ha cerrado sesión" });
    } catch (error) {
        return res.status(500).json({ message: "Error al cerrar sesión", error: error.message });
    }
};
