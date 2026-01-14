import nodemailer from "nodemailer";

export const sendOtpMail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: "Arsura Factory <arsurafactory@gmail.com>",
    to: email,
    subject: "Codice di accesso Arsura",
    html: `<h2>Codice OTP</h2><p><strong>${otp}</strong></p><p>Valido 1 minuto</p>`,
  });
};
