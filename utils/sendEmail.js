const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.USER,
        accessToken:
          "ya29.a0AWY7Cknr3CPK-MiU4spOxNVOcs-MfxYLsl-eQinyLaLmPcO8shMKRDQDzRjd0CySOHQwf43f9ytVfhfQcZ6wY02Xe7t6QzSia8i2Q-jYsvwYtLBX7479IWIulnoXUF1_y_mQEI_DHLlNVdeF4ShEfDXbKmTqaCgYKAZASARMSFQG1tDrpwmB3oP2MzDccU2jQJbKxKg0163"
      }
    });
    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text
    });
    console.log("email sent successfully");
  } catch (err) {
    console.log("Email not sent");
    console.log(err);
  }
};
