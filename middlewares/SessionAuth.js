
const jwt = require("jsonwebtoken");
// Se importa la clave secreta 'SECRET_KEY' desde el enviroment 
const { SECRET_KEY } = require("../utility/environment");

const sessionMiddleware = (req, res, next) => {
    // Obtiene el token de acceso (JWT) desde las cookies de la solicitud HTTP
    const token = req.cookies.access_token;

    // Inicializa la sesion del usuario como nula
    req.session = { user: null };

    try {
        // Si hay un token, intenta verificarlo y decodificarlo usando la clave secreta
        const userData = jwt.verify(token, SECRET_KEY);

        // Si el token es valido, asigna la informacion del usuario decodificada al objeto de la sesion
        req.session.user = userData;
    } catch {
        // Si el token es invalido o ha expirado, no hace nada y la sesion permanecera como nula.
    }

    // Llama al siguiente middleware o controlador en la pila de middleware de Express
    next();
};

// Exporta el middleware para que pueda ser usado en otras partes de la aplicacion 
module.exports = { sessionMiddleware };
