const { connect } = require("mongoose"); //se exporta el connect de mongoose 
const { CONNECTION_STRING_DB } = require("../utility/environment"); //Se obtiene el string de conexion del enviroment 

const getConnection = async () => { //Se define una funcion para conectarse a la base de datos
    try {
        await connect(CONNECTION_STRING_DB);
        console.log("Database connected");
    } catch (error) {
        console.error("Error connecting the database", error);
    }
};

module.exports = { getConnection };
