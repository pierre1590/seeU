import dotenv from 'dotenv';
import transporter from '../utils/transporte.js';
import generateToken from '../utils/generateToken.js';

dotenv.config();

const sendEmail = async(id,email,option) => {

    if (option === 'forgot password') {
        const forgetPasswordToken = generateToken(id,'forgot password');
        const url = `http://localhost:3000/forgotpassword/${forgetPasswordToken}`;

        const mailOptions = {
            from: {name:"seeU", address: process.env.EMAIL_FROM},
            to: email,
            subject: 'Reset your password',
            html: `<h1>Hello ${email}</h1>
                    <p>Please click on the link below to reset your password</p>
                    <a href="${url}">Reset Password</a>`
        };

            const mailSent = await transporter.sendMail(
                mailOptions,
                (error, info) => (
                    error? console.log(error) : console.log(info)
                ),
            );
            
            if(mailSent) {
                return Promise.resolve(1);
            }

        


    }
}

export default sendEmail;