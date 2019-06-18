const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'katrine.howell@ethereal.email',
        pass: 'VGpW7ZnBv9nPZNqjkd'
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

async function mailResult(to,score){
    let info = await transporter.sendMail({
        from: '"Test 👻" <shaishavpidadi@gmail.com>',
        to: to,
        subject: "Your Quiz result",
        text: "Hello world?",
        html: `<b>Hello ${to}, </b> <br> <p> Your Score is ${score}</p>`
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}


module.exports = {
    mail,
    mailResult
}