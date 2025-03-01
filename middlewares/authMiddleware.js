
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    // Se obtiene el token de la cabecera 'Authorization' de la solicitud HTTP. Se espera que el token este en el formato 'Bearer <token>'.
    // Si la cabecera no existe, 'token' sera undefined.
    const token = req.header("Authorization")?.replace("Bearer ", "");

    // Si no se encuentra un token, se responde con un codigo de estado 401 (No autorizado) y un mensaje de error
    if (!token) {
        return res.status(401).json({ message: "Acces denied ." });
    }

    // En este bloque intentamos verificar la validez del token con la clave secreta definida
    try {
        // El metodo verify() verifica y decodifica el token usando la clave secreta
        // Si el token es valido, se obtiene la informacion del payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Si el token es valido, asignamos los datos decodificados a 'req.user' para que esta disponible en las rutas siguientes
        req.user = decoded;

        // Llamamos a next
        next();
    } catch (error) {
        res.status(400).json({ message: "Token no válido." });
    }
};
module.exports = authMiddleware;
