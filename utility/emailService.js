const nodemailer = require("nodemailer"); // Importar el modulo Nodemailer de Node.js para enviar correos electronicos

const userGmail = "jfelipe070703@gmail.com";
const passAppGmail = "hdfx wtfn xvzn aunj";

// Configurar el transportador de Nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: userGmail,
        pass: passAppGmail,
    },
});

// Funcion para enviar correos electronicos
const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: userGmail,
        to: to,
        subject: subject,
        text: text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
};

module.exports = sendEmail;

