const bcrypt = require("bcrypt"); //Importa la libreria bcrypt para encriptar la contrasenia
const { SALT_ROUNDS } = require("./environment"); //Obtiene la cantidad de veces que va a encriptar la contrasenia del archivo environment.js que trabaja con las variables de entorno
const User = require("../models/User");

const validateUserData = (username, email, password, avatar) => { //Metodo para validar los datos del usuario
    if (typeof username != "string") throw new Error("Username must be a string"); //Si el nombre de usuario no es un string, lanza un error
    if (username.length < 3) { //Si el nombre de usuario tiene menos de 3 caracteres, lanza un error
        throw new Error("The name must have 3 characters");
    }

    if (typeof email != "string") throw new Error("Email must be a string"); //Si el email no es un string, lanza un error
    if (!/^\S+@\S+\.\S+$/.test(email)) { //Si el email no tiene el formato correcto, lanza un error
        throw new Error("Invalid email format");
    }

    if (typeof password != "string") throw new Error("Password must be a string"); //Si la contrasenia no es un string, lanza un error
    if (password.length < 6) { //Si la contrasenia tiene menos de 6 caracteres, lanza un error
        throw new Error("The password must have 6 characters");
    }

    if (typeof avatar != "string") throw new Error("Avatar must be a string"); //Si el avatar no es un string, lanza un error
    if (
        ![ //Si el avatar no es uno de los siguientes, lanza un error
            "avatar1.png",
            "avatar2.png",
            "avatar3.png",
            "avatar4.png",
            "avatar5.png",
            "avatar6.png",
            "avatar7.png",
            "avatar8.png",
            "avatar9.png",
            "avatar10.png",
        ].includes(avatar)
    ) {
        throw new Error("Invalid avatar selection");
    }

    return true; //Si todo esta correcto, retorna true
};

const validateUserName = async (username, email) => { //Metodo para validar el nombre de usuario
    if (await User.findOne({ username })) throw new Error("The user already exists"); //Si el nombre de usuario ya existe, lanza un error
    if (await User.findOne({ email })) throw new Error("The email already exists"); //Si el email ya existe, lanza un error
};

const generateHashPassword = async (password) => { //Metodo para encriptar la contrasenia
    try {
        const hashpassword = await bcrypt.hash(password, parseInt(SALT_ROUNDS)); //Encripta la contrasenia la cantidad de veces que se indico en el archivo environment.js
        return hashpassword; //Retorna la contrasenia encriptada
    } catch (error) {
        throw new Error("Can not encript the password");
    }
};

const validatePassword = async (loginPassword, userPassword) => { //Metodo para validar la contrasenia
    try {
        return await bcrypt.compare(loginPassword, userPassword); //Compara la contrasenia ingresada con la contrasenia encriptada
    } catch (error) {
        throw new Error("Can not compare the passwords");
    }
};

module.exports = { validateUserData, validateUserName, generateHashPassword, validatePassword };
