export const buildGroupTicketBookingEmail = (booking: any): string => {
  const ticket = booking.ticketSnapshot || {};
  const passengers = Array.isArray(booking.passengers)
    ? booking.passengers
    : [];
  const customer = booking.customer || {};
  const currency = booking.currency || ticket.currency || "PKR";
  const money = `${currency} ${Number(booking.totalAmount || 0).toLocaleString()}`;
  const paymentMethod =
    booking.payment?.method === "agency"
      ? "Pay at Agency"
      : booking.payment?.method === "bank"
        ? "Bank Transfer"
        : "—";
  const paymentStatus =
    booking.paymentStatus === "submitted" ? "Submitted" : "Pending";
  const legs = String(ticket.sector || "")
    .split("/")
    .map((leg: string) => leg.trim());
  const outbound = legs[0] || "—";
  const inbound = legs[1] || outbound;
  const outboundCodes = outbound.split("-").filter(Boolean);
  const inboundCodes = inbound.split("-").filter(Boolean);
  const route =
    !legs[1] && outboundCodes.length >= 3
      ? {
          outboundFrom: outboundCodes[0],
          outboundTo: outboundCodes[1],
          returnFrom: outboundCodes[1],
          returnTo: outboundCodes[2],
        }
      : {
          outboundFrom: outboundCodes[0] || "—",
          outboundTo: outboundCodes[outboundCodes.length - 1] || "—",
          returnFrom:
            inboundCodes[0] || outboundCodes[outboundCodes.length - 1] || "—",
          returnTo:
            inboundCodes[inboundCodes.length - 1] || outboundCodes[0] || "—",
        };
  const passengerRows = passengers
    .map(
      (passenger: any, index: number) => `
    <tr style="background:${index % 2 === 0 ? "#f9fafb" : "#ffffff"};">
      <td style="padding:9px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;white-space:nowrap;">${passenger.firstName || ""} ${passenger.lastName || ""}</td>
      <td style="padding:9px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;text-transform:capitalize;white-space:nowrap;">${passenger.type || "adult"}</td>
      <td style="padding:9px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;white-space:nowrap;">${passenger.gender || "—"}</td>
      <td style="padding:9px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;white-space:nowrap;">${passenger.dob || "—"}</td>
      <td style="padding:9px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;white-space:nowrap;">${passenger.nationality || "—"}</td>
      <td style="padding:9px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;white-space:nowrap;">${passenger.passportNumber || "—"}</td>
      <td style="padding:9px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;white-space:nowrap;">${passenger.passportExpiry || "—"}</td>
    </tr>`,
    )
    .join("");

  return `
    <style>
      @media only screen and (max-width:480px) {
        .email-container { padding: 12px !important; }
        .email-table td, .email-table th { padding: 7px 6px !important; font-size: 11px !important; }
      }
    </style>
    <div class="email-container" style="padding:18px 20px;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
      <div style="text-align:center;margin-bottom:8px;">
        <div style="display:inline-block;background:#dcfce7;border-radius:50%;width:52px;height:52px;line-height:52px;font-size:26px;margin-bottom:10px;">✔</div>
        <h2 style="margin:0 0 6px;font-size:20px;font-weight:700;color:#15803d;">Group Ticket Booking Request Submitted Successfully</h2>
        <p style="margin:0;font-size:14px;color:#6b7280;">Your request has been received. Our team will review it and contact you shortly for confirmation.</p>
      </div>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;width:180px;">Booking Reference</td><td style="padding:6px 0;font-size:15px;font-weight:700;color:#2563eb;font-family:monospace;">${booking.bookingReference}</td></tr>
        <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Booking Date</td><td style="padding:6px 0;font-size:13px;font-weight:500;">${new Date(booking.createdAt || Date.now()).toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" })}</td></tr>
        <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Status</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#d97706;text-transform:capitalize;">${booking.status || "Pending"}</td></tr>
      </table>
      <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:10px;padding:18px 20px;margin-bottom:20px;">
        <table style="width:100%;border-collapse:collapse;"><tr>
          <td style="text-align:center;width:33%;"><div style="font-size:32px;font-weight:800;color:#1e3a5f;">${route.outboundFrom}</div><div style="font-size:12px;color:#64748b;">${ticket.outboundDate || "—"}</div><div style="font-size:11px;color:#94a3b8;">${ticket.outboundTime || "—"}</div></td>
          <td style="text-align:center;width:34%;padding:0 10px;"><div style="border-top:2px dashed #93c5fd;margin:6px 0;"></div><div style="font-size:18px;">✈</div><div style="font-size:11px;color:#94a3b8;">Outbound</div></td>
          <td style="text-align:center;width:33%;"><div style="font-size:32px;font-weight:800;color:#1e3a5f;">${route.outboundTo}</div><div style="font-size:12px;color:#64748b;">${ticket.outboundDate || "—"}</div><div style="font-size:11px;color:#94a3b8;">${ticket.outboundTime || "—"}</div></td>
        </tr></table>
        <div style="border-top:1px solid #bae6fd;margin:16px 0;"></div>
        <table style="width:100%;border-collapse:collapse;"><tr>
          <td style="text-align:center;width:33%;"><div style="font-size:32px;font-weight:800;color:#1e3a5f;">${route.returnFrom}</div><div style="font-size:12px;color:#64748b;">${ticket.returnDate || "—"}</div><div style="font-size:11px;color:#94a3b8;">${ticket.returnTime || "—"}</div></td>
          <td style="text-align:center;width:34%;padding:0 10px;"><div style="border-top:2px dashed #93c5fd;margin:6px 0;"></div><div style="font-size:18px;">✈</div><div style="font-size:11px;color:#94a3b8;">Return</div></td>
          <td style="text-align:center;width:33%;"><div style="font-size:32px;font-weight:800;color:#1e3a5f;">${route.returnTo}</div><div style="font-size:12px;color:#64748b;">${ticket.returnDate || "—"}</div><div style="font-size:11px;color:#94a3b8;">${ticket.returnTime || "—"}</div></td>
        </tr></table>
      </div>
      <h3 style="font-size:14px;font-weight:700;color:#1e3a5f;margin:0 0 10px;">Flight Information</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;width:180px;">Airline</td><td style="padding:6px 0;font-size:13px;font-weight:500;">${ticket.airline || "—"} (${ticket.airlineCode || "—"})</td></tr>
        <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Sector</td><td style="padding:6px 0;font-size:13px;font-weight:500;">${ticket.sector || "—"}</td></tr>
        <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Baggage</td><td style="padding:6px 0;font-size:13px;font-weight:500;">${ticket.baggage || "—"}</td></tr>
        <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Meal</td><td style="padding:6px 0;font-size:13px;font-weight:500;">${ticket.meal ? "Included" : "Not included"}</td></tr>
      </table>
      <h3 style="font-size:14px;font-weight:700;color:#1e3a5f;margin:0 0 10px;">Passengers (${passengers.length})</h3>
      <div style="overflow-x:auto;"><table class="email-table" style="width:100%;min-width:760px;border-collapse:collapse;font-size:13px;border:1px solid #e5e7eb;"><thead><tr style="background:#1e3a5f;color:#ffffff;"><th style="padding:9px 12px;text-align:left;white-space:nowrap;">Name</th><th style="padding:9px 12px;text-align:left;white-space:nowrap;">Type</th><th style="padding:9px 12px;text-align:left;white-space:nowrap;">Gender</th><th style="padding:9px 12px;text-align:left;white-space:nowrap;">Date of Birth</th><th style="padding:9px 12px;text-align:left;white-space:nowrap;">Nationality</th><th style="padding:9px 12px;text-align:left;white-space:nowrap;">Passport No.</th><th style="padding:9px 12px;text-align:left;white-space:nowrap;">Expiry</th></tr></thead><tbody>${passengerRows}</tbody></table></div>
      <h3 style="font-size:14px;font-weight:700;color:#1e3a5f;margin:20px 0 10px;">Payment Information</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;"><tr><td style="padding:6px 0;font-size:13px;color:#6b7280;width:180px;">Payment Method</td><td style="padding:6px 0;font-size:13px;font-weight:500;">${paymentMethod}</td></tr><tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Payment Status</td><td style="padding:6px 0;font-size:13px;font-weight:500;">${paymentStatus}</td></tr>${booking.payment?.receiptUrl ? `<tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Receipt</td><td style="padding:6px 0;font-size:13px;font-weight:500;color:#16a34a;">✔ Payment receipt submitted</td></tr>` : ""}</table>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;margin-bottom:20px;"><tr style="background:#eff6ff;"><td style="padding:11px 14px;font-size:14px;font-weight:700;color:#1e40af;">Total Amount</td><td style="padding:11px 14px;text-align:right;font-size:16px;font-weight:800;color:#2563eb;">${money}</td></tr></table>
      <div style="background:#fef3c7;border:2px solid #f59e0b;border-radius:8px;padding:14px 16px;"><div style="font-size:13px;font-weight:800;color:#92400e;text-transform:uppercase;">⚠ NOT VALID FOR TRAVEL</div><div style="font-size:12px;color:#78350f;line-height:1.65;margin-top:6px;">This is a computer-generated booking request summary only. It is not a confirmed airline ticket and is not valid for check-in, boarding, airport travel, or airline ticket verification.</div></div>
    </div>`;
};
