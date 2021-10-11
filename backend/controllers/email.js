// Config pour envoyer email au user ( routes de forgot et reset password)
const nodemailer = require ('nodemailer');

const sendEmail = async options => {
    // 1) Creation transporter
    const transporter = nodemailer.createTransport( {
        // Utiliser service mailtrap pour attraper les emails envoyés
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    } );
    //2) Email options
    const emailOptions = {
        from: ' Groupomania service réseau interne <admin@groupomania.fr>',
        to: options.email,
        subject: options.subject,
        // text: options.message,
        html: options.message
    }
    // 3) Send email avec nodemailer
    await transporter.sendMail(emailOptions)
}

module.exports = sendEmail