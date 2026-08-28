export const buildGroupBookingEmail = (booking: any): string => {
  const currency = booking.currency || "PKR";

  const fmt = (n: number) =>
    Number(n) > 0 ? `${currency} ${Number(n).toLocaleString()}` : "—";

  // =====================================================
  // GROUP & BOOKING INFO
  // =====================================================

  const groupName = booking.groupName || booking.groupLabel || "—";
  const bookingType = booking.bookingType || "—";

  // =====================================================
  // FLIGHT INFO (for flight and customized bookings)
  // =====================================================

  const airline = booking.airline || "—";
  const airlineCode = booking.airlineCode || "";
  const flightNumber = booking.flightNumber || "—";

  const fromCode = booking.fromCode || "—";
  const toCode = booking.toCode || "—";

  const departureDate = booking.departureDate || "—";
  const departureTime = booking.departureTime || "—";
  const arrivalDate = booking.arrivalDate || "—";
  const arrivalTime = booking.arrivalTime || "—";

  const duration = booking.duration || "—";
  const baggage = booking.baggage || "—";
  const meal = booking.meal === true || booking.meal === "true" ? "Included" : "Not included";

  const flightClass = booking.class || "Economy";

  const stopsNum = Number(booking.stops ?? 0);
  const stopsText =
    stopsNum === 0
      ? "Non-stop"
      : `${stopsNum} stop${stopsNum > 1 ? "s" : ""}${
          booking.stopCities?.length
            ? ` (${booking.stopCities.join(", ")})`
            : ""
        }`;

  // =====================================================
  // PACKAGE INFO (for fixed package bookings)
  // =====================================================

  const packageName = booking.packageName || "—";
  const packageType = booking.packageType || "—";

  // =====================================================
  // PASSENGERS & PRICING
  // =====================================================

  const adults = Number(booking.adults ?? 0);
  const children = Number(booking.children ?? 0);
  const infants = Number(booking.infants ?? 0);

  const adultPrice = Number(booking.adultPrice || 0);
  const childPrice = Number(booking.childPrice || 0);
  const infantPrice = Number(booking.infantPrice || 0);

  const adultTotal = adults * adultPrice;
  const childTotal = children * childPrice;
  const infantTotal = infants * infantPrice;

  const pricingRows = [
    adults > 0
      ? `<tr>
           <td style="padding:7px 14px;color:#6b7280;font-size:13px;">Adult × ${adults}</td>
           <td style="padding:7px 14px;text-align:right;font-size:13px;">${adultPrice > 0 ? fmt(adultTotal) : "—"}</td>
         </tr>`
      : "",
    children > 0
      ? `<tr>
           <td style="padding:7px 14px;color:#6b7280;font-size:13px;">Child × ${children}</td>
           <td style="padding:7px 14px;text-align:right;font-size:13px;">${childPrice > 0 ? fmt(childTotal) : "—"}</td>
         </tr>`
      : "",
    infants > 0
      ? `<tr>
           <td style="padding:7px 14px;color:#6b7280;font-size:13px;">Infant × ${infants}</td>
           <td style="padding:7px 14px;text-align:right;font-size:13px;">${infantPrice > 0 ? fmt(infantTotal) : "—"}</td>
         </tr>`
      : "",
    Number(booking.taxes) > 0
      ? `<tr>
           <td style="padding:7px 14px;color:#6b7280;font-size:13px;">Taxes</td>
           <td style="padding:7px 14px;text-align:right;font-size:13px;">${fmt(booking.taxes)}</td>
         </tr>`
      : "",
    Number(booking.fees) > 0
      ? `<tr>
           <td style="padding:7px 14px;color:#6b7280;font-size:13px;">Fees</td>
           <td style="padding:7px 14px;text-align:right;font-size:13px;">${fmt(booking.fees)}</td>
         </tr>`
      : "",
    Number(booking.couponDiscount) > 0
      ? `<tr>
           <td style="padding:7px 14px;color:#16a34a;font-size:13px;">Discount</td>
           <td style="padding:7px 14px;text-align:right;font-size:13px;color:#16a34a;">− ${fmt(booking.couponDiscount)}</td>
         </tr>`
      : "",
  ]
    .filter(Boolean)
    .join("");

  // =====================================================
  // PASSENGERS
  // =====================================================

  const passengerRows = (booking.passengers || [])
    .map((p: any, i: number) => {
      const cells = [
        `${p.firstName || ""} ${p.lastName || ""}`.trim(),
        p.type
          ? `<span style="text-transform:capitalize;">${p.type}</span>`
          : "",
        p.gender
          ? `<span style="text-transform:capitalize;">${p.gender}</span>`
          : "",
        p.dob || p.dateOfBirth || "",
        p.nationality || "",
        p.passportNumber || "",
        p.passportExpiry || "",
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
        <h2 style="margin:0 0 6px;font-size:20px;font-weight:700;color:#15803d;">Group Booking Request Submitted Successfully</h2>
        <p style="margin:0;font-size:14px;color:#6b7280;">Your group booking request has been received. Our team will review it and contact you shortly for confirmation.</p>
      </div>

      <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />

      <!-- BOOKING REFERENCE -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;width:180px;">Booking Reference</td>
          <td style="padding:6px 0;font-size:15px;font-weight:700;color:#2563eb;font-family:monospace;">${booking.bookingReference || "—"}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;">Booking Date</td>
          <td style="padding:6px 0;font-size:13px;font-weight:500;">${bookingDate}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;">Group</td>
          <td style="padding:6px 0;font-size:13px;font-weight:600;">${groupName}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;">Booking Type</td>
          <td style="padding:6px 0;font-size:13px;font-weight:600;text-transform:capitalize;">${bookingType}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;">Status</td>
          <td style="padding:6px 0;font-size:13px;font-weight:600;color:#d97706;text-transform:capitalize;">${booking.status || "pending"}</td>
        </tr>
      </table>

      ${
        booking.bookingType === "flight" || booking.bookingType === "customized"
          ? `
      <!-- ROUTE CARD -->
      <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:10px;padding:18px 20px;margin-bottom:20px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="text-align:center;width:33%;">
              <div style="font-size:32px;font-weight:800;color:#1e3a5f;">${fromCode}</div>
              <div style="font-size:12px;color:#64748b;margin-top:3px;">Departure</div>
              <div style="font-size:11px;color:#94a3b8;">${departureDate}</div>
              <div style="font-size:11px;color:#94a3b8;">${departureTime}</div>
            </td>
            <td style="text-align:center;width:34%;padding:0 10px;">
              <div style="font-size:11px;color:#94a3b8;margin-bottom:4px;">${duration}</div>
              <div style="border-top:2px dashed #93c5fd;margin:6px 0;"></div>
              <div style="font-size:18px;">✈</div>
              <div style="font-size:11px;color:#94a3b8;margin-top:2px;">${stopsText}</div>
            </td>
            <td style="text-align:center;width:33%;">
              <div style="font-size:32px;font-weight:800;color:#1e3a5f;">${toCode}</div>
              <div style="font-size:12px;color:#64748b;margin-top:3px;">Arrival</div>
              <div style="font-size:11px;color:#94a3b8;">${arrivalDate}</div>
              <div style="font-size:11px;color:#94a3b8;">${arrivalTime}</div>
            </td>
          </tr>
        </table>
      </div>

      <!-- FLIGHT DETAILS -->
      <h3 style="font-size:14px;font-weight:700;color:#1e3a5f;margin:0 0 10px;">✈ Flight Information</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;width:180px;">Airline</td>
          <td style="padding:6px 0;font-size:13px;font-weight:500;">${airline} (${airlineCode})</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;">Flight Number</td>
          <td style="padding:6px 0;font-size:13px;font-weight:500;">${flightNumber}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;">Class</td>
          <td style="padding:6px 0;font-size:13px;font-weight:500;">${flightClass}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;">Baggage</td>
          <td style="padding:6px 0;font-size:13px;font-weight:500;">${baggage}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;">Meal</td>
          <td style="padding:6px 0;font-size:13px;font-weight:500;">${meal}</td>
        </tr>
      </table>
      `
          : ""
      }

      ${
        booking.bookingType === "package" || booking.bookingType === "fixed"
          ? `
      <!-- PACKAGE DETAILS -->
      <h3 style="font-size:14px;font-weight:700;color:#1e3a5f;margin:0 0 10px;">📦 Package Information</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;width:180px;">Package Name</td>
          <td style="padding:6px 0;font-size:13px;font-weight:500;">${packageName}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;">Departure Date</td>
          <td style="padding:6px 0;font-size:13px;font-weight:500;">${departureDate}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;">Duration</td>
          <td style="padding:6px 0;font-size:13px;font-weight:500;">${duration}</td>
        </tr>
      </table>
      `
          : ""
      }

      <!-- PASSENGERS -->
      <h3 style="font-size:14px;font-weight:700;color:#1e3a5f;margin:0 0 10px;">👥 Passengers (${(booking.passengers || []).length})</h3>
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
        ${
          infants > 0
            ? `<tr>
                 <td style="padding:4px 0;font-size:13px;color:#6b7280;">Infants</td>
                 <td style="padding:4px 0;font-size:13px;font-weight:500;">${infants}</td>
               </tr>`
            : ""
        }
      </table>
      <div style="overflow-x:auto;margin-bottom:20px;">
        <table style="width:100%;border-collapse:collapse;font-size:13px;border:1px solid #e5e7eb;">
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
      <h3 style="font-size:14px;font-weight:700;color:#1e3a5f;margin:0 0 10px;">💰 Price Summary</h3>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;overflow:hidden;margin-bottom:20px;">
        <tbody>
          ${pricingRows}
          <tr style="background:#eff6ff;">
            <td style="padding:11px 14px;font-size:14px;font-weight:700;color:#1e40af;">Total Amount</td>
            <td style="padding:11px 14px;text-align:right;font-size:16px;font-weight:800;color:#2563eb;">${fmt(Number(booking.totalAmount || 0))}</td>
          </tr>
        </tbody>
      </table>

      <!-- DISCLAIMER -->
      <div style="background:#fef3c7;border:2px solid #f59e0b;border-radius:8px;padding:14px 16px;margin-bottom:8px;">
        <div style="font-size:13px;font-weight:800;color:#92400e;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">⚠ NOT VALID FOR TRAVEL</div>
        <div style="font-size:12px;color:#78350f;line-height:1.65;">
          This is a computer-generated group booking <strong>request summary</strong> only. 
          It is <strong>not a confirmed booking</strong> and is not valid for travel, check-in, or boarding.
          This booking is pending review by our agency. Our team will contact you to confirm.
        </div>
      </div>
    </div>
  `;
};

export default buildGroupBookingEmail;
