const nodemailer = require('nodemailer');
const Email = process.env.Email;
const Password = process.env.App_Pass
const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:Email,
        pass:Password,
    },

});

 const ReciveEmail = async (name, email, mobile, message) => {
    try{
        const mailOptions = {
            from: email,
            to: Email,
            subject: 'New Notification Khata-book',
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px; background: #f7f7f7; color: #333;">
                <h2 style="color: #4caf50;">📬 New Contact Form Submission</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px; font-weight: bold;">Name:</td>
                    <td style="padding: 8px;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; font-weight: bold;">Email:</td>
                    <td style="padding: 8px;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; font-weight: bold;">Mobile:</td>
                    <td style="padding: 8px;">${mobile}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; font-weight: bold;">Message:</td>
                    <td style="padding: 8px;">${message}</td>
                  </tr>
                </table>
                <p style="margin-top: 20px;">Regards,<br><strong>Khata Book System</strong></p>
              </div>
            `
          };
          
 transporter.sendMail(mailOptions, ( e ,d ) =>{
            if (e) {
                console.error('Error sending email:', e); 
            }else{
                console.log('Email sent successfully'); 
            }
        });
    

    }catch(error){
        console.error('Error sending email:', error);
    }
};

module.exports = ReciveEmail;