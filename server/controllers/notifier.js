// notifier.js
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sns = new SNSClient({ region: "us-east-1" });
const ses = new SESClient({ region: "us-east-1" });

export async function sendSMS(phoneNumber, message) {
  const params = {
    Message: message,
    PhoneNumber: phoneNumber,
  };

  try {
    const result = await sns.send(new PublishCommand(params));
    console.log("SMS sent:", result.MessageId);
    return result;
  } catch (error) {
    console.error("SMS error:", error);
    throw error;
  }
}

export async function sendEmail(toAddress, subject, bodyText, fromAddress) {
  const params = {
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
    Body: {
      Html: {
        Data: bodyText//"<h1>Hello!</h1><p>This is an HTML email from AWS SES.</p>",
      },
      Text: {
        Data: "Hello! This is a plain text fallback.",
      },
    },
      Subject: {
      Data: subject,
    },
    },
    Source: fromAddress,
  };

  try {
    const result = await ses.send(new SendEmailCommand(params));
    console.log("Email sent:", result.MessageId);
    return result;
  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
}

// module.exports = { sendSMS, sendEmail };
