const nodemailer = require("nodemailer");

// Use explicit IPv4 and Port 465 to bypass Render's outbound IPv6 restrictions
const transporter = nodemailer.createTransport({
  host: "142.250.115.108", // Hardcoded Gmail IPv4 address
  port: 465,
  secure: true,
  tls: {
    rejectUnauthorized: false, // Prevents certificate mismatch error when using a raw IP
  },
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Must be a 16-character Google App Password
  },
});

transporter.verify((err) => {
  if (err) {
    console.log("SMTP ERROR:", err);
  } else {
    console.log("SMTP Connected Successfully");
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    console.log("Attempting to send email from:", process.env.EMAIL_USER);

    const info = await transporter.sendMail({
      from: `"MERN Shop" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Mail sent successfully:", info.response);
  } catch (err) {
    console.error("MAIL ERROR DETAILS:");
    console.error(err);
    throw err;
  }
};

module.exports = sendEmail;