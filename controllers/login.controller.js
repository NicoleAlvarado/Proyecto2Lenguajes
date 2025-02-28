const User = require("../models/User"); //Se importa el modelo User
const { getTokenCookieConfig, generateAuthTokens, refreshAccessToken } = require("../utility/jtw.service"); //Se importan las funciones getTokenCookieConfig, generateAuthTokens y refreshAccessToken del archivo jtw.service para los manejos del token 
const { validatePassword } = require("../utility/user.validation"); //Se importa la funcion validatePassword del archivo user.validation para validar la contrasenia

const loginUser = async (req, res) => { //Funcion para inicio de sesion 
    try {
        const { email, password } = req.body; //Recibe el email y la contrasenia de quien va a iniciar sesion 
        if (!email || !password) { //Si no se recibe el email o la contrasenia
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email }); //Se busca el usuario por el email

        if (!user || !(await validatePassword(password, user.password))) //Si no se encuentra el usuario o la contrasenia no es valida
            return res.status(401).json({ message: "Invalid email or password" }); //Se envia un mensaje de error

        return generateAuthTokens(user, res); //Se genera el token de autenticacion
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const refreshToken = async (req, res) => { //Funcion para refrescar el token
    try {
        const { refresh_token } = req.cookies; //Obtiene el refresh token del usuario que esta en las cookies

        const newAccessToken = refreshAccessToken(refresh_token); //Refresca el token de autenticacion

        res.cookie("access_token", newAccessToken, getTokenCookieConfig(5)); //Se guarda el nuevo token de autenticacion en las cookies

        return res.status(200).json({ success: true, accessToken: newAccessToken }); //Se envia un mensaje de exito
    } catch (error) {
        return res.status(500).json({ message: "Cannot refresh token", error: error.message }); 
    }
};

const logoutUser = (req, res) => { //Funcion para cerrar sesion
    try {
        res.clearCookie("access_token"); //Se limpia la cookie del token de autenticacion
        res.clearCookie("refresh_token"); //Se limpia la cookie del refresh token

        return res.status(200).json({ message: "El usuario ha cerrado sesión" }); //Se envia un mensaje de exito
    } catch (error) {
        return res.status(500).json({ message: "Error al cerrar sesión", error: error.message });
    }
};

module.exports = { loginUser, refreshToken, logoutUser }; //Exporta las funciones loginUser, refreshToken y logoutUser
