import { connect } from "mongoose";
import { CONNECTION_STRING_DB } from "../utility/environment.js";

export const getConnection = async () => {
    try {
        await connect(CONNECTION_STRING_DB);
        console.log("Base de datos conectada correctamente");
    } catch (error) {
        console.error("Error al conectar a la base de datos", error);
    }
};
