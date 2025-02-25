const User = require("../models/User");
const { getTokenCookieConfig, generateAuthTokens, refreshAccessToken } = require("../utility/jtw.service");
const { validatePassword } = require("../utility/user.validation");

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await validatePassword(password, user.password)))
            return res.status(401).json({ message: "Invalid email or password" });

        return generateAuthTokens(user, res);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const refreshToken = async (req, res) => {
    try {
        const { refresh_token } = req.cookies;

        const newAccessToken = refreshAccessToken(refresh_token);

        res.cookie("access_token", newAccessToken, getTokenCookieConfig(5));

        return res.status(200).json({ success: true, accessToken: newAccessToken });
    } catch (error) {
        return res.status(500).json({ message: "Cannot refresh token", error: error.message });
    }
};

const logoutUser = (req, res) => {
    try {
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");

        return res.status(200).json({ message: "El usuario ha cerrado sesión" });
    } catch (error) {
        return res.status(500).json({ message: "Error al cerrar sesión", error: error.message });
    }
};

module.exports = { loginUser, refreshToken, logoutUser };
