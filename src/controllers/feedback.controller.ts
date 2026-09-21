import { Request, Response } from "express";
import { sendEmail } from "../utils/email.js";

export const submitFeedback = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const name = String(req.body?.name || "").trim();
    const email = String(req.body?.email || "").trim();
    const subject = String(req.body?.subject || "General Question").trim();
    const message = String(req.body?.message || "").trim();

    if (!name || !message) {
      res.status(400).json({
        success: false,
        message: "Name and message are required.",
      });
      return;
    }

    const adminEmail = (
      process.env.ADMIN_EMAIL ||
      process.env.EMAIL_USER ||
      "randhawa.airtravels@gmail.com"
    )
      .replace(/[\r\n]/g, "")
      .trim();

    const html = `
      <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
        <h2 style="margin-bottom: 12px;">New Feedback / Question</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email || "Not provided"}</p>
        <p><strong>Subject:</strong> ${subject || "General Question"}</p>
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin-top: 12px;">
          <strong>Message:</strong>
          <div style="margin-top: 8px; white-space: pre-wrap;">${message.replace(/\n/g, "<br />")}</div>
        </div>
        <p style="margin-top: 18px; color: #6b7280; font-size: 12px;">
          This message was sent from the website feedback form.
        </p>
      </div>
    `;

    await sendEmail(
      adminEmail,
      `New Feedback: ${subject || "General Question"}`,
      html,
      {
        replyTo: email || undefined,
      },
    );

    res.status(200).json({
      success: true,
      message: "Your feedback has been sent successfully.",
    });
  } catch (error: any) {
    console.error("Feedback submit error:", error);

    res.status(500).json({
      success: false,
      message: error?.message || "Failed to send feedback. Please try again.",
    });
  }
};
