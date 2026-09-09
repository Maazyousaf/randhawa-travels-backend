import nodemailer from "nodemailer";

const cleanEnvValue = (value?: string) =>
  (value || "")
    .replace(/^Config\s*/i, "")
    .replace(/[\r\n]/g, "")
    .trim();

const emailHost = cleanEnvValue(process.env.EMAIL_HOST);
const emailPort = Number(cleanEnvValue(process.env.EMAIL_PORT)) || 587;
const emailUser = cleanEnvValue(process.env.EMAIL_USER);
const emailPass = cleanEnvValue(
  process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD,
);

const transporter = nodemailer.createTransport({
  host: emailHost,
  port: emailPort,
  secure: false,
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

export const sendEmail = async (
  email: string,
  subject: string,
  message: string,
) => {
  try {
    await transporter.sendMail({
      from: `"Randhawa Air Travels Int'l" <${emailUser}>`,
      to: email,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
          <body
            style="
              font-family: Arial, Helvetica, sans-serif;
              background:#f5f5f5;
              padding:30px;
            "
          >
            <div
              style="
                max-width:600px;
                margin:auto;
                background:#ffffff;
                border-radius:10px;
                overflow:hidden;
                box-shadow:0 0 10px rgba(0,0,0,.08);
              "
            >
              <div
                style="
                  background:#0d6efd;
                  color:#fff;
                  text-align:center;
                  padding:20px;
                  mminheight:200px;
                "
              >
                <h2 style="margin:0;">Randhawa Air Travels Int'l</h2>
              </div>

              <div style="padding:30px; font-size:16px; line-height:1.5; color:#333;">
                ${message}
              </div>

              <div
                style="
                  text-align:center;
                  padding:15px;
                  background:#f8f9fa;
                  font-size:13px;
                  color:#777;
                "
              >
                © ${new Date().getFullYear()} Randhawa Air Travels Int'l
              </div>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error("Email Error:", error);
    throw new Error("Failed to send email");
  }
};
