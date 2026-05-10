export function getVerificationEmailTemplate(userName, verifyUrl) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px; }
        .container { background-color: #ffffff; border-radius: 8px; padding: 32px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
        h1 { color: #1f2937; font-size: 24px; margin-bottom: 24px; text-align: center; }
        p { color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 24px; }
        .button-wrapper { text-align: center; margin: 32px 0; }
        .button { display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: 500; }
        .link-section { font-size: 14px; color: #6b7280; margin: 24px 0; padding: 16px; background-color: #f9fafb; border-radius: 6px; word-break: break-all; }
        .footer { border-top: 1px solid #e5e7eb; margin-top: 32px; padding-top: 24px; text-align: center; font-size: 12px; color: #9ca3af; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Verify Your Email Address</h1>
        <p>Thank you <strong>${userName}</strong> for signing up! Please verify your email address to complete your account setup.</p>
        <div class="button-wrapper"><a href="${verifyUrl}" class="button">Verify Email Address</a></div>
        <p>This verification link will expire in 24 hours. If you did not create an account, you can ignore this email.</p>
        <p>If the button does not work, copy and paste this link into your browser:</p>
        <div class="link-section">${verifyUrl}</div>
        <div class="footer">
          <div>© 2026 UNIFIND. All rights reserved.</div>
          <div>UNI FIND - University Lost &amp; Found Platform</div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getPasswordResetEmailTemplate(userName, resetUrl) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px; }
        .container { background-color: #ffffff; border-radius: 8px; padding: 32px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
        h1 { color: #1f2937; font-size: 24px; margin-bottom: 24px; text-align: center; }
        p { color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 24px; }
        .button-wrapper { text-align: center; margin: 32px 0; }
        .button { display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: 500; }
        .link-section { font-size: 14px; color: #6b7280; margin: 24px 0; padding: 16px; background-color: #f9fafb; border-radius: 6px; word-break: break-all; }
        .footer { border-top: 1px solid #e5e7eb; margin-top: 32px; padding-top: 24px; text-align: center; font-size: 12px; color: #9ca3af; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Reset Your Password</h1>
        <p>Hi <strong>${userName}</strong>, we received a request to reset your password. Click the button below to create a new password.</p>
        <div class="button-wrapper"><a href="${resetUrl}" class="button">Reset Password</a></div>
        <p>This link will expire in 24 hours. If you did not request a password reset, you can ignore this email.</p>
        <p>If the button does not work, copy and paste this link:</p>
        <div class="link-section">${resetUrl}</div>
        <div class="footer">
          <div>© 2026 UNIFIND. All rights reserved.</div>
          <div>UNI FIND - University Lost &amp; Found Platform</div>
        </div>
      </div>
    </body>
    </html>
  `;
}