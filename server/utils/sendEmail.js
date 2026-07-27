const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    console.log("EMAIL_USER:", process.env.EMAIL_USER);

    const info = await transporter.sendMail({
      from: `"MERN Shop" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Mail sent:", info.response);
  } catch (err) {
    console.error("MAIL ERROR:");
    console.error(err);

    throw err;
  }
};

module.exports = sendEmail;