export const buildHotelBookingEmail = (booking: any): string => {
  const currency = booking.currency || "PKR";

  const fmt = (n: number) =>
    Number(n) > 0 ? `${currency} ${Number(n).toLocaleString()}` : "—";

  // =====================================================
  // HOTEL INFO
  // =====================================================

  const hotelName = booking.hotelName || "—";
  const location = booking.location || "—";
  const city = booking.city || "—";
  const country = booking.country || "—";
  const stars = booking.stars || 0;
  const checkIn = booking.checkIn || "—";
  const checkOut = booking.checkOut || "—";
  const nights = Number(booking.nights || 0);
  const rooms = Number(booking.rooms || 1);
  const adults = Number(booking.adults || 0);
  const children = Number(booking.children || 0);

  // =====================================================
  // PRICING
  // =====================================================

  const pricePerNight = Number(booking.pricePerNight || 0);
  const totalAmount = Number(booking.totalAmount || 0);

  // =====================================================
  // GUESTS
  // =====================================================

  const guestRows = (booking.guests || [])
    .map((guest: any, i: number) => {
      const cells = [
        `${guest.firstName || ""} ${guest.lastName || ""}`.trim(),
        guest.gender
          ? `<span style="text-transform:capitalize;">${guest.gender}</span>`
          : "",
        guest.dob || "",
        guest.nationality || "",
        guest.passportNumber || "",
        guest.passportExpiry || "",
      ]
        .map(
          (v) =>
            `<td style="padding:9px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;white-space:nowrap;">${v}</td>`,
        )
        .join("");

      return `<tr style="background:${i % 2 === 0 ? "#f9fafb" : "#ffffff"};">${cells}</tr>`;
    })
    .join("");

  // =====================================================
  // PAYMENT
  // =====================================================

  const paymentMethod =
    booking.paymentMethod === "agency"
      ? "Pay at Agency"
      : booking.paymentMethod === "bank"
        ? "Bank Transfer"
        : "—";

  const receiptLine =
    booking.payment?.receiptUrl || booking.receiptUrl
      ? `<tr>
           <td style="padding:6px 0;font-size:13px;color:#6b7280;width:180px;">Receipt</td>
           <td style="padding:6px 0;font-size:13px;font-weight:500;color:#16a34a;">✔ Payment receipt submitted</td>
         </tr>`
      : "";

  const paymentRefLine = booking.payment?.transactionId
    ? `<tr>
         <td style="padding:6px 0;font-size:13px;color:#6b7280;">Transaction ID</td>
         <td style="padding:6px 0;font-size:13px;font-weight:500;">${booking.payment.transactionId}</td>
       </tr>`
    : "";

  const bankLine = booking.payment?.bankName
    ? `<tr>
         <td style="padding:6px 0;font-size:13px;color:#6b7280;">Bank</td>
         <td style="padding:6px 0;font-size:13px;font-weight:500;">${booking.payment.bankName}</td>
       </tr>`
    : "";

  // =====================================================
  // BOOKING DATE
  // =====================================================

  const bookingDate = booking.createdAt
    ? new Date(booking.createdAt).toLocaleDateString("en-PK", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  // =====================================================
  // HTML
  // =====================================================

  return `
    <div style="padding:18px 20px;">

      <!-- HEADER -->
      <div style="text-align:center;margin-bottom:8px;">
        <div style="display:inline-block;background:#dcfce7;border-radius:50%;width:52px;height:52px;line-height:52px;font-size:26px;margin-bottom:10px;">✔</div>
        <h2 style="margin:0 0 6px;font-size:20px;font-weight:700;color:#15803d;">Hotel Booking Request Submitted Successfully</h2>
        <p style="margin:0;font-size:14px;color:#6b7280;">Your hotel booking request has been received. Our team will review it and contact you shortly for confirmation.</p>
      </div>

      <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />

      <!-- BOOKING REFERENCE -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;width:180px;">Booking Reference</td>
          <td style="padding:6px 0;font-size:15px;font-weight:700;color:#2563eb;font-family:monospace;">${booking.requestId || "—"}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;">Booking Date</td>
          <td style="padding:6px 0;font-size:13px;font-weight:500;">${bookingDate}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;">Status</td>
          <td style="padding:6px 0;font-size:13px;font-weight:600;color:#d97706;text-transform:capitalize;">${booking.status || "pending"}</td>
        </tr>
      </table>

      <!-- HOTEL DETAILS -->
      <h3 style="font-size:14px;font-weight:700;color:#1e3a5f;margin:0 0 10px;">🏨 Hotel Information</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;width:180px;">Hotel Name</td>
          <td style="padding:6px 0;font-size:13px;font-weight:500;">${hotelName}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;">Location</td>
          <td style="padding:6px 0;font-size:13px;font-weight:500;">${location}, ${city}, ${country}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;">Stars</td>
          <td style="padding:6px 0;font-size:13px;font-weight:500;">${"★".repeat(stars)}</td>
        </tr>
      </table>

      <!-- STAY DETAILS -->
      <h3 style="font-size:14px;font-weight:700;color:#1e3a5f;margin:0 0 10px;">📅 Stay Details</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;width:180px;">Check-in</td>
          <td style="padding:6px 0;font-size:13px;font-weight:500;">${checkIn}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;">Check-out</td>
          <td style="padding:6px 0;font-size:13px;font-weight:500;">${checkOut}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;">Nights</td>
          <td style="padding:6px 0;font-size:13px;font-weight:500;">${nights}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;">Rooms</td>
          <td style="padding:6px 0;font-size:13px;font-weight:500;">${rooms}</td>
        </tr>
      </table>

      <!-- GUESTS -->
      <h3 style="font-size:14px;font-weight:700;color:#1e3a5f;margin:0 0 10px;">👥 Guests (${(booking.guests || []).length})</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:6px;">
        <tr>
          <td style="padding:4px 0;font-size:13px;color:#6b7280;width:180px;">Adults</td>
          <td style="padding:4px 0;font-size:13px;font-weight:500;">${adults}</td>
        </tr>
        ${
          children > 0
            ? `<tr>
                 <td style="padding:4px 0;font-size:13px;color:#6b7280;">Children</td>
                 <td style="padding:4px 0;font-size:13px;font-weight:500;">${children}</td>
               </tr>`
            : ""
        }
      </table>
      <div style="overflow-x:auto;margin-bottom:20px;">
        <table style="width:100%;border-collapse:collapse;font-size:13px;border:1px solid #e5e7eb;">
          <thead>
            <tr style="background:#1e3a5f;color:#ffffff;">
              <th style="padding:9px 12px;text-align:left;font-weight:600;white-space:nowrap;">Name</th>
              <th style="padding:9px 12px;text-align:left;font-weight:600;white-space:nowrap;">Gender</th>
              <th style="padding:9px 12px;text-align:left;font-weight:600;white-space:nowrap;">Date of Birth</th>
              <th style="padding:9px 12px;text-align:left;font-weight:600;white-space:nowrap;">Nationality</th>
              <th style="padding:9px 12px;text-align:left;font-weight:600;white-space:nowrap;">Passport No.</th>
              <th style="padding:9px 12px;text-align:left;font-weight:600;white-space:nowrap;">Expiry</th>
            </tr>
          </thead>
          <tbody>${guestRows}</tbody>
        </table>
      </div>

      <!-- PAYMENT -->
      <h3 style="font-size:14px;font-weight:700;color:#1e3a5f;margin:0 0 10px;">💳 Payment Information</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;width:180px;">Payment Method</td>
          <td style="padding:6px 0;font-size:13px;font-weight:500;">${paymentMethod}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;">Payment Status</td>
          <td style="padding:6px 0;font-size:13px;font-weight:500;text-transform:capitalize;">${booking.paymentStatus || "pending"}</td>
        </tr>
        ${paymentRefLine}
        ${bankLine}
        ${receiptLine}
      </table>

      <!-- PRICE SUMMARY -->
      <h3 style="font-size:14px;font-weight:700;color:#1e3a5f;margin:0 0 10px;">Price Summary</h3>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;overflow:hidden;margin-bottom:20px;">
        <tbody>
          <tr>
            <td style="padding:7px 14px;color:#6b7280;font-size:13px;">Price per Night</td>
            <td style="padding:7px 14px;text-align:right;font-size:13px;">${fmt(pricePerNight)}</td>
          </tr>
          <tr style="background:#f9fafb;">
            <td style="padding:7px 14px;color:#6b7280;font-size:13px;">Duration (${nights} nights × ${rooms} room${rooms !== 1 ? "s" : ""})</td>
            <td style="padding:7px 14px;text-align:right;font-size:13px;">${fmt(pricePerNight * nights * rooms)}</td>
          </tr>
          <tr style="background:#eff6ff;">
            <td style="padding:11px 14px;font-size:14px;font-weight:700;color:#1e40af;">Total Amount</td>
            <td style="padding:11px 14px;text-align:right;font-size:16px;font-weight:800;color:#2563eb;">${fmt(totalAmount)}</td>
          </tr>
        </tbody>
      </table>

      <!-- DISCLAIMER -->
      <div style="background:#fef3c7;border:2px solid #f59e0b;border-radius:8px;padding:14px 16px;margin-bottom:8px;">
        <div style="font-size:13px;font-weight:800;color:#92400e;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">⚠ NOT VALID FOR CHECK-IN</div>
        <div style="font-size:12px;color:#78350f;line-height:1.65;">
          This is a computer-generated hotel booking <strong>request summary</strong> only. 
          It is <strong>not a confirmed hotel reservation</strong> and is not valid for check-in without further confirmation.
          This booking is pending review by our agency. Our team will contact you to confirm and provide your booking confirmation details.
        </div>
      </div>
    </div>
  `;
};

export default buildHotelBookingEmail;
