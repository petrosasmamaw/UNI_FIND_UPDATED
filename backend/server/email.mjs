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

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    return { success: true, info };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[email] sendVerificationEmail error:', err && err.message ? err.message : err);
    return { success: false, error: err };
  }
}

export async function sendPasswordResetEmail({ to, subject, html }) {
  if (!transporter) {
    return { success: false, skipped: true };
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    return { success: true, info };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[email] sendPasswordResetEmail error:', err && err.message ? err.message : err);
    return { success: false, error: err };
  }
}