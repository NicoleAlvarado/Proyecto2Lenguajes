import User from '../models/User.js';
import { generateTokens } from '../utility/user.generate-token.js';
import { validatePassword } from '../utility/user.validation.js';
import jwt from 'jsonwebtoken';

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
        const user = await User.findOne({ email });
        
        if (!user || !(await validatePassword(password, user.password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        return generateTokens(user, res); 
    } catch (error) {
        return res.status(500).json({ message: "Cannot create token", error: error.message });
    }
}

const refreshAccessToken = async (req, res) => {
    try {
        const { refresh_token } = req.cookies;
        if (!refresh_token) return res.status(401).json({ message: 'Refresh token is required' });

        jwt.verify(refresh_token, process.env.REFRESH_SECRET_KEY, async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Invalid refresh token' });

            const user = await User.findById(decoded.id);
            if (!user) return res.status(404).json({ message: 'User not found' });

            const accessToken = jwt.sign(
                { id: user.id, username: user.username },
                process.env.SECRET_KEY,
                { expiresIn: '5m' } // Access token expira en 5 minutos
            );

            res.cookie('access_token', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 1000 * 60 * 5 // 5 minutos
            });

            return res.status(200).json({ accessToken });
        });
    } catch (error) {
        return res.status(500).json({ message: "Cannot refresh token", error: error.message });
    }
}

const getUserInSession = (req, res) => {
    try {
        const token = req.cookies.access_token;
        if (!token) return res.status(401).json({ message: 'Access token is required' });

        jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Invalid access token' });

            const user = await User.findById(decoded.id);
            if (!user) return res.status(404).json({ message: 'User not found' });

            return res.status(200).json({ email: user.email });
        });
    } catch (error) {
        return res.status(500).json({ message: "Cannot get user in session", error: error.message });
    }
}

const logoutUser = (req, res) => {
    try {
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return res.status(200).json({ message: 'User logged out' });
    } catch (error) {
        return res.status(500).json({ message: "Cannot logout user", error: error.message });
    }
}

export { loginUser, getUserInSession, logoutUser, refreshAccessToken };