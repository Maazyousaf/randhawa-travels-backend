import nodemailer from "nodemailer";

// =====================================================
// EMAIL SERVICE
// =====================================================

interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingReference: string;
  bookingDate: string;
  hotelStays?: Array<{
    city: string;
    hotelName: string;
    roomType: string;
    checkInDate: string;
    checkOutDate: string;
    nights: number;
  }>;
  visa?: {
    name: string;
  };
  transport?: {
    name: string;
  };
  totalAmount: number;
  adults: number;
  children: number;
  infants: number;
  agentRemarks?: string;
}

// Initialize transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASSWORD || "",
  },
});

// =====================================================
// SEND BOOKING CONFIRMATION EMAIL
// =====================================================

export const sendBookingConfirmationEmail = async (
  data: BookingEmailData,
): Promise<void> => {
  try {
    if (!data.customerEmail) {
      console.warn("❌ Email service: No customer email provided");
      return;
    }

    // Generate HTML email template
    const emailHtml = generateBookingConfirmationHTML(data);

    const mailOptions = {
      from: process.env.EMAIL_USER || "noreply@wanderluxe.com",
      to: data.customerEmail,
      cc: process.env.ADMIN_EMAIL || "",
      subject: `Booking Confirmation - ${data.bookingReference} | Wander Luxe`,
      html: emailHtml,
      replyTo: process.env.SUPPORT_EMAIL || "",
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("❌ Error sending booking email:", error);
    // Don't throw - email failures shouldn't block booking creation
  }
};

// =====================================================
// GENERATE BOOKING CONFIRMATION HTML EMAIL
// =====================================================

const generateBookingConfirmationHTML = (data: BookingEmailData): string => {
  const hotelStaysHTML = data.hotelStays
    ? data.hotelStays
        .map(
          (stay) => `
    <tr>
      <td colspan="2" style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
        <div style="margin-bottom: 8px;">
          <strong style="color: #1f2937; font-size: 14px;">
            ${stay.city === "makkah" ? "🕋 Makkah" : "🕌 Madinah"} Hotel
          </strong>
        </div>
        <div style="color: #6b7280; font-size: 13px; line-height: 1.6;">
          <div><strong>Hotel:</strong> ${stay.hotelName}</div>
          <div><strong>Room Type:</strong> ${stay.roomType}</div>
          <div><strong>Dates:</strong> ${stay.checkInDate} to ${stay.checkOutDate} (${stay.nights} nights)</div>
        </div>
      </td>
    </tr>
  `,
        )
        .join("")
    : "";

  const servicesHTML =
    data.visa || data.transport
      ? `
    <tr>
      <td colspan="2" style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
        <strong style="color: #1f2937; font-size: 14px;">Services</strong>
        <div style="color: #6b7280; font-size: 13px; line-height: 1.6; margin-top: 8px;">
          ${data.visa ? `<div>✓ ${data.visa.name}</div>` : ""}
          ${data.transport ? `<div>✓ ${data.transport.name}</div>` : ""}
        </div>
      </td>
    </tr>
  `
      : "";

  const remarksHTML = data.agentRemarks
    ? `
    <tr>
      <td colspan="2" style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
        <strong style="color: #1f2937; font-size: 14px;">Special Notes</strong>
        <div style="color: #6b7280; font-size: 13px; line-height: 1.6; margin-top: 8px;">
          ${data.agentRemarks}
        </div>
      </td>
    </tr>
  `
    : "";

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">✅ Booking Confirmed!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">Your Customized Umrah package has been successfully created</p>
        </div>

        <!-- Content -->
        <div style="padding: 30px 20px;">
            
            <!-- Booking Reference -->
            <div style="background-color: #eff6ff; border: 2px solid #667eea; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.5px;">Booking Reference</p>
                <p style="color: #667eea; font-size: 24px; margin: 0; font-weight: bold; font-family: 'Courier New', monospace;">
                    ${data.bookingReference}
                </p>
                <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">Please save this for your records</p>
            </div>

            <!-- Booking Details Table -->
            <table style="width: 100%; margin-bottom: 24px; border-collapse: collapse;">
                <tbody>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                            <span style="color: #6b7280; font-size: 13px;">Booking Date</span>
                            <div style="color: #1f2937; font-weight: 600; font-size: 14px; margin-top: 4px;">${data.bookingDate}</div>
                        </td>
                        <td style="padding: 12px 0 12px 20px; border-bottom: 1px solid #e5e7eb;">
                            <span style="color: #6b7280; font-size: 13px;">Total Amount</span>
                            <div style="color: #667eea; font-weight: 600; font-size: 16px; margin-top: 4px;">PKR ${data.totalAmount.toLocaleString()}</div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Customer Details -->
            <div style="margin-bottom: 24px;">
                <h3 style="color: #1f2937; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">Customer Information</h3>
                <div style="background-color: #f3f4f6; border-radius: 8px; padding: 12px; font-size: 13px; line-height: 1.8; color: #374151;">
                    <div><strong>Name:</strong> ${data.customerName}</div>
                    <div><strong>Email:</strong> ${data.customerEmail}</div>
                    <div><strong>Phone:</strong> ${data.customerPhone}</div>
                </div>
            </div>

            <!-- Travelers -->
            <div style="margin-bottom: 24px;">
                <h3 style="color: #1f2937; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">Travelers</h3>
                <div style="background-color: #f3f4f6; border-radius: 8px; padding: 12px; font-size: 13px; line-height: 1.8; color: #374151;">
                    <div>👥 Adults: ${data.adults}</div>
                    ${data.children > 0 ? `<div>👶 Children: ${data.children}</div>` : ""}
                    ${data.infants > 0 ? `<div>🍼 Infants: ${data.infants}</div>` : ""}
                </div>
            </div>

            <!-- Booking Summary Table -->
            <table style="width: 100%; margin-bottom: 24px; border-collapse: collapse;">
                <tbody>
                    ${hotelStaysHTML}
                    ${servicesHTML}
                    ${remarksHTML}
                </tbody>
            </table>

            <!-- Next Steps -->
            <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <h4 style="color: #166534; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">📋 Next Steps</h4>
                <ul style="color: #166534; font-size: 13px; margin: 0; padding-left: 20px; line-height: 1.8;">
                    <li>Our team will contact you within 24 hours to confirm details</li>
                    <li>Complete payment using your selected payment method</li>
                    <li>Prepare required documents for visa processing</li>
                    <li>Track your booking status on our website</li>
                </ul>
            </div>

            <!-- Contact Information -->
            <div style="background-color: #f3f4f6; border-radius: 8px; padding: 16px; text-align: center;">
                <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px 0;">Have questions? We're here to help!</p>
                <div style="color: #667eea; font-size: 13px; font-weight: 600;">
                    <a href="mailto:support@wanderluxe.com" style="color: #667eea; text-decoration: none;">support@wanderluxe.com</a>
                </div>
            </div>

        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © 2026 Wander Luxe. All rights reserved.
            </p>
            <p style="color: #9ca3af; font-size: 11px; margin: 8px 0 0 0;">
                This is an automated email. Please do not reply directly.
            </p>
        </div>

    </div>
</body>
</html>
  `;
};

export default {
  sendBookingConfirmationEmail,
};
