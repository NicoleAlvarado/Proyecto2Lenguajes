// Importa la libreria jsonwebtoken para generar y verificar tokens JWT
const jwt = require("jsonwebtoken");

// Obtiene las variables de entorno necesarias 
const { SECRET_KEY, REFRESH_SECRET_KEY, NODE_ENV } = require("./environment");

// Funcion para generar la configuracion de las cookies que contienen los tokens
const getTokenCookieConfig = (maxAgeMinutes) => ({
    // Asegura que la cookie no sea accesible desde JavaScript 
    httpOnly: true,
    // Define que la cookie solo sera enviada a traves de una conexion segura 
    secure: NODE_ENV === "production", 
    // Define que la cookie solo puede ser enviada en el mismo sitio
    sameSite: "strict", // Esto previene el envio de cookies en solicitudes cruzadas
    // Define el tiempo de expiracion de la cookie en milisegundos
    maxAge: 1000 * 60 * maxAgeMinutes, // Convierte los minutos en milisegundos
});

// Funcion para generar un token JWT con un payload, una clave secreta y un tiempo de expiracion
const generateToken = (payload, secret, expiresIn) => jwt.sign(payload, secret, { expiresIn });

// Funcion para verificar un token JWT usando la clave secreta
const verifyToken = (token, secret) => {
    try {
        // Intenta verificar y decodificar el token
        return jwt.verify(token, secret);
    } catch (error) {
        // Si ocurre un error, token no valido o expirado, retorna null
        return null;
    }
};

// Funcion para generar tokens de autenticacion access y refresh tokens  para un usuario
const generateAuthTokens = (user, res) => {
    try {
        // Crea el payload que se incluira en los tokens
        const payload = { id: user._id, username: user.username };

        // Genera el token de acceso con una expiracion de 5 minutos
        const accessToken = generateToken(payload, SECRET_KEY, "5m");
        // Genera el token de actualizacion (refresh token) con una expiracion de 7 dias
        const refreshToken = generateToken(payload, REFRESH_SECRET_KEY, "7d");

        // Configura y envia los tokens como cookies al cliente
        res.cookie("access_token", accessToken, getTokenCookieConfig(5)); // Cookie con el access token (expira en 5 minutos)
        res.cookie("refresh_token", refreshToken, getTokenCookieConfig(60 * 24 * 7)); // Cookie con el refresh token (expira en 7 días)

        // Retorna los tokens en formato JSON como respuesta del servidor
        return res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        // Si ocurre un error generando los tokens, retorna un error 500
        return res.status(500).json({ message: "Error generating tokens", error: error.message });
    }
};

// Funcion para refrescar el token de acceso utilizando un refresh token
const refreshAccessToken = (refreshToken) => {
    // Verifica y decodifica el refresh token usando la clave secreta del refresh token
    const decoded = verifyToken(refreshToken, REFRESH_SECRET_KEY);
    // Si el refresh token no es valido, retorna null
    if (!decoded) return null;

    // Crea un nuevo payload usando la informacion del refresh token
    const payload = { id: decoded.id, username: decoded.username };
    // Genera un nuevo access token con el nuevo payload
    return generateToken(payload, SECRET_KEY, "5m"); // El nuevo access token tiene una expiracion de 5 minutos
};

// Exporta todas las funciones para que puedan ser utilizadas en otros archivos
module.exports = {
    getTokenCookieConfig,
    generateToken,
    verifyToken,
    generateAuthTokens,
    refreshAccessToken,
};
