import { Document } from "mongoose";

export const buildBookingEmail = (booking: any) => {
  const currency = booking.currency || "PKR";

  const fmt = (n: number) =>
    n > 0 ? `${currency} ${n.toLocaleString()}` : "—";

  const pricingRows = [
    booking.adults > 0 && booking.adultPrice > 0
      ? `<tr><td style="padding:7px 14px;color:#6b7280;font-size:13px;">Adult × ${booking.adults}</td><td style="padding:7px 14px;text-align:right;font-size:13px;">${fmt(booking.adultPrice * booking.adults)}</td></tr>`
      : "",
    booking.children > 0 && booking.childPrice > 0
      ? `<tr><td style="padding:7px 14px;color:#6b7280;font-size:13px;">Child × ${booking.children}</td><td style="padding:7px 14px;text-align:right;font-size:13px;">${fmt(booking.childPrice * booking.children)}</td></tr>`
      : "",
    booking.infants > 0 && booking.infantPrice > 0
      ? `<tr><td style="padding:7px 14px;color:#6b7280;font-size:13px;">Infant × ${booking.infants}</td><td style="padding:7px 14px;text-align:right;font-size:13px;">${fmt(booking.infantPrice * booking.infants)}</td></tr>`
      : "",
    booking.taxes > 0
      ? `<tr><td style="padding:7px 14px;color:#6b7280;font-size:13px;">Taxes</td><td style="padding:7px 14px;text-align:right;font-size:13px;">${fmt(booking.taxes)}</td></tr>`
      : "",
    booking.fees > 0
      ? `<tr><td style="padding:7px 14px;color:#6b7280;font-size:13px;">Fees</td><td style="padding:7px 14px;text-align:right;font-size:13px;">${fmt(booking.fees)}</td></tr>`
      : "",
    booking.extrasTotal > 0
      ? `<tr><td style="padding:7px 14px;color:#6b7280;font-size:13px;">Extras</td><td style="padding:7px 14px;text-align:right;font-size:13px;">${fmt(booking.extrasTotal)}</td></tr>`
      : "",
    booking.couponDiscount > 0
      ? `<tr><td style="padding:7px 14px;color:#16a34a;font-size:13px;">Discount (${booking.coupon || "coupon"})</td><td style="padding:7px 14px;text-align:right;font-size:13px;color:#16a34a;">− ${fmt(booking.couponDiscount)}</td></tr>`
      : "",
  ]
    .filter(Boolean)
    .join("");

  const passengerRows = (booking.passengers || [])
    .map((p: any, i: number) => {
      const cells = [
        `${p.firstName} ${p.lastName}`,
        p.type
          ? `<span style="text-transform:capitalize;">${p.type}</span>`
          : "",
        p.gender
          ? `<span style="text-transform:capitalize;">${p.gender}</span>`
          : "",
        p.dob || "",
        p.nationality || "",
        p.passportNumber || "",
        p.passportExpiry || "",
      ]
        .map(
          (val) =>
            `<td style="padding:9px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px;">${val}</td>`,
        )
        .join("");

      return `<tr style="background:${i % 2 === 0 ? "#f9fafb" : "#ffffff"};">${cells}</tr>`;
    })
    .join("");

  const paymentMethod =
    booking.paymentMethod === "agency"
      ? "Pay at Agency"
      : booking.paymentMethod === "bank"
        ? "Bank Transfer"
        : booking.paymentMethod || "—";

  const receiptLine =
    booking.payment?.receiptUrl || booking.receiptUrl
      ? `<tr><td style="padding:6px 0;font-size:13px;color:#6b7280;width:180px;">Receipt</td><td style="padding:6px 0;font-size:13px;font-weight:500;color:#16a34a;">✔ Payment receipt submitted</td></tr>`
      : "";

  const paymentRefLine = booking.payment?.transactionId
    ? `<tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Transaction ID</td><td style="padding:6px 0;font-size:13px;font-weight:500;">${booking.payment.transactionId}</td></tr>`
    : "";

  const bankLine = booking.payment?.bankName
    ? `<tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Bank</td><td style="padding:6px 0;font-size:13px;font-weight:500;">${booking.payment.bankName}</td></tr>`
    : "";

  const stopsText =
    booking.stops === 0
      ? "Non-stop"
      : `${booking.stops} stop${booking.stops > 1 ? "s" : ""}${booking.stopCities?.length ? ` (${booking.stopCities.join(", ")})` : ""}`;

  const html = `
      <style>
        @media only screen and (max-width:480px){
          .email-container{padding:12px !important;font-size:13px !important}
          .email-table td{padding:6px 8px !important;font-size:13px !important}
          .passenger-table th, .passenger-table td{padding:8px 6px !important;font-size:12px !important;max-width:120px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
          .route-card div{font-size:11px !important}
        }
      </style>

      <div class="email-container" style="padding:18px 20px;">
      <!-- ── HEADER ─────────────────────────────────── -->
      <div style="text-align:center;margin-bottom:8px;">
        <div style="display:inline-block;background:#dcfce7;border-radius:50%;width:52px;height:52px;line-height:52px;font-size:26px;margin-bottom:10px;">✔</div>
        <h2 style="margin:0 0 6px;font-size:20px;font-weight:700;color:#15803d;">Flight Booking Request Submitted Successfully</h2>
        <p style="margin:0;font-size:14px;color:#6b7280;">Your request has been received. Our team will review it and contact you shortly for confirmation.</p>
      </div>

      <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />

      <!-- ── BOOKING REFERENCE ────────────────────── -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;width:180px;">Booking Reference</td>
          <td style="padding:6px 0;font-size:15px;font-weight:700;color:#2563eb;font-family:monospace;">${booking.requestId}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;">Booking Date</td>
          <td style="padding:6px 0;font-size:13px;font-weight:500;">${new Date(booking.createdAt).toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" })}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;">Status</td>
          <td style="padding:6px 0;font-size:13px;font-weight:600;color:#d97706;text-transform:capitalize;">${booking.status}</td>
        </tr>
      </table>

      <!-- ── ROUTE CARD ───────────────────────────── -->
      <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:10px;padding:18px 20px;margin-bottom:20px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="text-align:center;width:33%;">
              <div style="font-size:32px;font-weight:800;color:#1e3a5f;">${booking.fromCode}</div>
              <div style="font-size:12px;color:#64748b;margin-top:3px;">${booking.from}</div>
              <div style="font-size:11px;color:#94a3b8;">${booking.departureDate}</div>
              <div style="font-size:11px;color:#94a3b8;">${booking.departureTime}</div>
            </td>
            <td style="text-align:center;width:34%;padding:0 10px;">
              <div style="font-size:11px;color:#94a3b8;margin-bottom:4px;">${booking.duration}</div>
              <div style="border-top:2px dashed #93c5fd;margin:6px 0;"></div>
              <div style="font-size:18px;">✈</div>
              <div style="font-size:11px;color:#94a3b8;margin-top:2px;">${stopsText}</div>
            </td>
            <td style="text-align:center;width:33%;">
              <div style="font-size:32px;font-weight:800;color:#1e3a5f;">${booking.toCode}</div>
              <div style="font-size:12px;color:#64748b;margin-top:3px;">${booking.to}</div>
              <div style="font-size:11px;color:#94a3b8;">${booking.arrivalDate}</div>
              <div style="font-size:11px;color:#94a3b8;">${booking.arrivalTime}</div>
            </td>
          </tr>
        </table>
      </div>

      <!-- ── FLIGHT DETAILS ──────────────────────── -->
      <h3 style="font-size:14px;font-weight:700;color:#1e3a5f;margin:0 0 10px;">Flight Information</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;width:180px;">Airline</td><td style="padding:6px 0;font-size:13px;font-weight:500;">${booking.airline} (${booking.airlineCode})</td></tr>
        <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Flight Number</td><td style="padding:6px 0;font-size:13px;font-weight:500;">${booking.flightNumber}</td></tr>
        <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Class / Cabin</td><td style="padding:6px 0;font-size:13px;font-weight:500;">${booking.class} — ${booking.cabin}</td></tr>
        <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Baggage</td><td style="padding:6px 0;font-size:13px;font-weight:500;">${booking.baggage || "—"}</td></tr>
        <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Meal</td><td style="padding:6px 0;font-size:13px;font-weight:500;">${booking.meal ? "Included" : "Not included"}</td></tr>
        <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Stops</td><td style="padding:6px 0;font-size:13px;font-weight:500;">${stopsText}</td></tr>
      </table>

      <!-- ── PASSENGERS ─────────────────────────── -->
      <h3 style="font-size:14px;font-weight:700;color:#1e3a5f;margin:0 0 10px;">Passengers (${(booking.passengers || []).length})</h3>
      <div style="overflow-x:auto;margin-bottom:20px;">
        <table class="passenger-table" style="width:100%;border-collapse:collapse;font-size:13px;border:1px solid #e5e7eb;">
          <thead>
            <tr style="background:#1e3a5f;color:#ffffff;">
              <th style="padding:9px 12px;text-align:left;font-weight:600;white-space:nowrap;">Name</th>
              <th style="padding:9px 12px;text-align:left;font-weight:600;white-space:nowrap;">Type</th>
              <th style="padding:9px 12px;text-align:left;font-weight:600;white-space:nowrap;">Gender</th>
              <th style="padding:9px 12px;text-align:left;font-weight:600;white-space:nowrap;">Date of Birth</th>
              <th style="padding:9px 12px;text-align:left;font-weight:600;white-space:nowrap;">Nationality</th>
              <th style="padding:9px 12px;text-align:left;font-weight:600;white-space:nowrap;">Passport No.</th>
              <th style="padding:9px 12px;text-align:left;font-weight:600;white-space:nowrap;">Expiry</th>
            </tr>
          </thead>
          <tbody>${passengerRows}</tbody>
        </table>
      </div>

      <!-- ── PAYMENT ────────────────────────────── -->
      <h3 style="font-size:14px;font-weight:700;color:#1e3a5f;margin:0 0 10px;">Payment Information</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;width:180px;">Payment Method</td><td style="padding:6px 0;font-size:13px;font-weight:500;">${paymentMethod}</td></tr>
        <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Payment Status</td><td style="padding:6px 0;font-size:13px;font-weight:500;text-transform:capitalize;">${booking.paymentStatus}</td></tr>
        ${paymentRefLine}
        ${bankLine}
        ${receiptLine}
      </table>

      <!-- ── PRICE SUMMARY ──────────────────────── -->
      <h3 style="font-size:14px;font-weight:700;color:#1e3a5f;margin:0 0 10px;">Price Summary</h3>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:20px;">
        <tbody>
          ${pricingRows}
          <tr style="background:#eff6ff;">
            <td style="padding:11px 14px;font-size:14px;font-weight:700;color:#1e40af;">Total Amount</td>
            <td style="padding:11px 14px;text-align:right;font-size:16px;font-weight:800;color:#2563eb;">${currency} ${booking.totalAmount.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      <!-- ── DISCLAIMER ─────────────────────────── -->
      <div style="background:#fef3c7;border:2px solid #f59e0b;border-radius:8px;padding:14px 16px;margin-bottom:8px;">
        <div style="font-size:13px;font-weight:800;color:#92400e;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">⚠ NOT VALID FOR TRAVEL</div>
        <div style="font-size:12px;color:#78350f;line-height:1.65;">
          This is a computer-generated booking <strong>request summary</strong> only. It is <strong>not a confirmed airline ticket</strong> and is not valid for check-in, boarding, airport travel, or airline ticket verification. This booking is pending review by our agency. Our team will contact you to confirm.
        </div>
      </div>
    </div>
    `;

  return html;
};

export default buildBookingEmail;
