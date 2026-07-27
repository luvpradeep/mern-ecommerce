const { Resend } = require('resend');

// Initialize Resend with your API Key
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    // Send the email via standard HTTP (port 443) which Render allows
    const { data, error } = await resend.emails.send({
      from: 'MERN Shop <onboarding@resend.dev>', // Resend's default testing domain
      to: [to], 
      subject: subject,
      html: html,
    });

    if (error) {
      console.error("RESEND API ERROR:", error);
      throw new Error(error.message);
    }

    console.log("Email sent successfully via HTTP:", data);
  } catch (err) {
    console.error("MAIL ERROR DETAILS:", err);
    throw err;
  }
};

module.exports = sendEmail;