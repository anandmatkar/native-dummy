const nodemailer = require("nodemailer");
const { welcome } = require("../templates/welcome");

module.exports.welcomeEmail = async (email, otp, userName) => {
    const smtpEndpoint = "smtp.gmail.com";
    const port = 587;
    const senderAddress = "chetanwd01@gmail.com";
    var toAddresses = email;

    let welcomeTemp = welcome(otp, userName)

    var subject = "Welcome to Rental.com";

    var body_text = `Please verify your account with below given OTP`;

    let transporter = nodemailer.createTransport({
        host: smtpEndpoint,
        port: port,
        secure: false,
        auth: {
            user: "chetanwd01@gmail.com",
            pass: "komhguisybntikfn"
        }
    });

    let mailOptions = {
        from: senderAddress,
        to: toAddresses,
        subject: subject,
        text: body_text,
        html: welcomeTemp,
        headers: {}
    };

    let info = await transporter.sendMail(mailOptions)
    console.log("Message sent! Message ID: ", info.messageId);

}