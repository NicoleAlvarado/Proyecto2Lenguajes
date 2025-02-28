const { CONNECTION_STRING_DB, PORT, SALT_ROUNDS, SECRET_KEY, REFRESH_SECRET_KEY, NODE_ENV, API_URL } = process.env; //Obtiene las variables de entorno

module.exports = { // Exporta las variables de entorno
    CONNECTION_STRING_DB,
    PORT,
    SALT_ROUNDS,
    SECRET_KEY,
    REFRESH_SECRET_KEY,
    NODE_ENV,
    API_URL,
};
