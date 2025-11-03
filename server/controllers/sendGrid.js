import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

// Load environment variables
dotenv.config();
// import dotenv from 'dotenv';
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

  if (!to || !subject) {
  console.log('Missing required fields')
  }

  const msg = {
    to,
    from: process.env.SENDGRID_SENDER,
    subject,
    text,
    html: html,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent successfully to ${to}`);

  } catch (error) {
    console.error("❌ Error sending email:", error);

  }
};




// twilio sms

import twilio from 'twilio';;


const clients = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export function sendSMS(to, message) {
  clients.messages
    .create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    })
    .then((message) => console.log(`SMS sent: ${message.sid}`))
    .catch((error) => console.error('Error sending SMS:', error));
}

// Example usage
// sendSMS('+2348012345678', 'Hello from Twilio via Node.js!');


import { NigeriaBulkSMSClient } from 'nigeriabulksms-sdk';

// Initialize the client
const client = new NigeriaBulkSMSClient({
    username: process.env.NGBULKSMS_ID, //'godstreasurer@gmail.com',
    password: process.env.NGBULKSMS_SECRET, //'Godstreasury.com20$'
});

// Send an SMS
export async function sendSMSNG(to, msg) {
    try {
        const response = await client.sms.send({
            message: msg,
            sender: 'GTCS',
            mobiles: to
        });
        console.log('SMS sent successfully:', response);

    } catch (error) {
        console.error('Error sending SMS:', error.message);
    }
}



// export async function twiliosms(req, res) {
//   const {to, msg} = req.body
//   sendSMSNG(to, msg)
// }
