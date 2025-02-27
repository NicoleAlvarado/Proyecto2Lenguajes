const nodemailer = require("nodemailer");
require("dotenv").config(); // Carga las variables de entorno

// Configuración del transporte SMTP
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Función para enviar correos electrónicos
const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: `<${process.env.EMAIL_USER}>`,
            to,
            subject,
            text
        };

        await transporter.sendMail(mailOptions);
        console.log(`Correo enviado a: ${to}`);
    } catch (error) {
        console.error("Error al enviar el correo:", error.message);
    }
};

module.exports = { sendEmail };
