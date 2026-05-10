import nodemailer from "nodemailer";

const hasEmailCredentials = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);

const transporter = hasEmailCredentials
  ? nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  : null;

if (transporter) {
  transporter.verify((error) => {
    if (error) {
      console.error("Email transporter error:", error);
    }
  });
} else {
  console.warn("Email credentials are not configured. Verification and reset emails are disabled.");
}

export async function sendVerificationEmail({ to, subject, html }) {
  if (!transporter) {
    return { success: false, skipped: true };
  }

  return transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
}

export async function sendPasswordResetEmail({ to, subject, html }) {
  if (!transporter) {
    return { success: false, skipped: true };
  }

  return transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
}