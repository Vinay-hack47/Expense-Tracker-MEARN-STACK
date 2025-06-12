import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendEmailNotifications = async ( toEmails, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmails.join(","),
      subject: "Expense Tracker Notification",
      text: message,
    };

    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: "Email notification sent successfully"
    }
  } catch (error) {
    console.error("Failed to send email notifications:", error);

    return {
      success: false,
      message: "Failed to send email notifications",
      error: error.message,
    }
  }
};