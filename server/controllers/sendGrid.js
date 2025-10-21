import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

// Load environment variables
dotenv.config();

// Initialize Express app


// Check for required SendGrid credentials
if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_SENDER) {
  console.error("❌ Missing SENDGRID_API_KEY or SENDGRID_SENDER in .env");
  process.exit(1);
}

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// POST /email/send endpoint
export async function sendMail(to, subject, text, html ) {
//   const { to, subject, text, html } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: to, subject, text",
    });
  }

  const msg = {
    to,
    from: process.env.SENDGRID_SENDER,
    subject,
    text,
    html: html || `<p>${text}</p>`,
  };

  try {
    const response = await sgMail.send(msg);
    console.log(`Email sent successfully to ${to}`);
    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
      response,
    });
  } catch (error) {
    console.error("❌ Error sending email:", error);

  }
};