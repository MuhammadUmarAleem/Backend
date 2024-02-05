const { transporter } = require("../utils/nodemailer");

function generateRandomNumber() {
  
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function sendEmail(email, subject, body) {
  const mailOptions = {
    from: `Evently <muhammadumaraleem@gmail.com>`,
    to: email,
    subject: subject,
    html: body,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return false;
    } else {
      return true;
    }
  });
}

module.exports = {
  sendEmail,
  generateRandomNumber,
};
