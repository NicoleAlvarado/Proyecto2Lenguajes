const { connect } = require("mongoose");
const { CONNECTION_STRING_DB } = require("../utility/environment");

const getConnection = async () => {
    try {
        await connect(CONNECTION_STRING_DB);
        console.log("Base de datos conectada correctamente");
    } catch (error) {
        console.error("Error al conectar a la base de datos", error);
    }
};

module.exports = { getConnection };
