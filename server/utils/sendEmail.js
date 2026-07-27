const sendEmail = async (to, subject, html) => {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "MERN Shop",
          // This MUST exactly match the email you verified in Brevo
          email: "mernshop5@gmail.com" 
        },
        to: [
          {
            // The user's email passed in from your forgot-password route
            email: to, 
          }
        ],
        subject: subject,
        htmlContent: html,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send email via Brevo");
    }

    console.log("Email sent successfully via Brevo HTTP:", data);
  } catch (err) {
    console.error("MAIL ERROR DETAILS:", err);
    throw err;
  }
};

module.exports = sendEmail;