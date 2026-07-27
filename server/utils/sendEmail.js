const nodemailer = require("nodemailer");
const dns = require("dns");

// Force Node.js to prefer IPv4 over IPv6 to prevent ENETUNREACH errors
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
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