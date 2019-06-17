const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'lauriane.lueilwitz9@ethereal.email',
        pass: 'FEq9YyNJXmgRsNzZgH'
    }
});


async function mail(to,link){
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Test 👻" <shaishavpidadi@gmail.com>', // sender address
        to: to, // list of receivers
        subject: "Confirm your email", // Subject line
        text: "Hello world?", // plain text sbody
        html: `<b>Hello to, </b> <br> <p> Click this link to confirm your account.</p> <a href=${link}>Click</a>` // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}


module.exports = {
    mail
}