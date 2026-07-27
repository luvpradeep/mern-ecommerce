const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4, // Force IPv4
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify((err) => {
  if (err) {
    console.log("SMTP ERROR:", err);
  } else {
    console.log("SMTP Connected");
  }
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