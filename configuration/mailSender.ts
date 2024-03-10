import nodemailer from 'nodemailer'
require('dotenv').config();

async function mailSender(email:string, title:string, body:string){
    try {
        const transporter=nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }
        });

        let response=await transporter.sendMail({
            from:"CodeX",
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        });
    } catch (error) {
        return error;
    }
}

export  {mailSender};