const jwt = require('jsonwebtoken');

const generateTokens = async (user, res) => {
    try {
        const accessToken = jwt.sign(
            { id: user.id, username: user.username },
            process.env.SECRET_KEY,
            { expiresIn: '5m' } // Access token expira en 5 minutos
        );

        const refreshToken = jwt.sign(
            { id: user.id, username: user.username },
            process.env.REFRESH_SECRET_KEY,
            { expiresIn: '7d' } // Refresh token expira en 7 días
        );

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 5 // 5 minutos
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 días
        });

        return res.status(200).json({ accessToken, refreshToken });

    } catch (error) {
        return res.status(500).json({ message: "Error generating tokens", error: error.message });
    }
}

module.exports = { generateTokens };