import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default async function sendMail({ to, subject, text }) {
  await transporter.sendMail({
    from: `"Arsura Factory" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
  });
}
