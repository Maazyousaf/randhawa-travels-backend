export const buildCustomUmrahEmail = (booking: any): string => {
  const currency = booking.currency || "PKR";

  const fmt = (n: number) =>
    Number(n) > 0 ? `${currency} ${Number(n).toLocaleString()}` : "—";

  // =====================================================
  // RESOLVE FLIGHT DATA
  // =====================================================

  const fs = booking.flightSnapshot || {};

  const airline = booking.airline || fs.airline || "—";
  const airlineCode = booking.airlineCode || fs.airlineCode || "";
  const flightNumber =
    booking.flightNumber || fs.flightNumber || `${airlineCode} Umrah` || "—";

  const fromCode = booking.fromCode || fs.from || "—";
  const fromCity = booking.fromCity || fs.fromCity || booking.pakistanAirportCity || "—";

  const toCode = booking.toCode || fs.to || "—";
  const toCity = booking.toCity || fs.toCity || booking.saudiAirportCity || "—";

  const departureDate = booking.departureDate || fs.date || "—";
  const departureTime = booking.departureTime || fs.departureTime || "—";
  const arrivalTime = booking.arrivalTime || fs.arrivalTime || "—";

  const duration = booking.duration || fs.duration || "—";
  const baggage = booking.baggage || fs.baggage || "—";
  const meal =
    booking.meal === true || fs.meal === true ? "Included" : "Not included";

  const flightClass = booking.class || fs.class || "Economy";
  const cabin = booking.cabin || fs.cabin || "Economy";

  const stopsNum = Number(booking.stops ?? fs.stops ?? 0);
  const stopsText =
    stopsNum === 0
      ? "Non-stop"
      : `${stopsNum} stop${stopsNum > 1 ? "s" : ""}${
          booking.stopCities?.length
            ? ` (${booking.stopCities.join(", ")})`
            : ""
        }`;

  // =====================================================
  // HOTEL STAYS
  // =====================================================

  const hotelStays = booking.hotelStays || [];
  const hotelStayRows = hotelStays
    .map((stay: any) => {
      const cityEmoji = stay.city === "makkah" ? "🕋" : "🕌";
      const cityName = stay.city === "makkah" ? "Makkah" : "Madinah";

      return `<tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;">${cityEmoji} ${cityName}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;">${stay.hotelName || "—"}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;">${stay.roomType || "—"}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:center;">${stay.nights || "—"}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:right;font-weight:600;">${fmt(stay.totalPrice || 0)}</td>
      </tr>`;
    })
    .join("");

  // =====================================================
  // SERVICES
  // =====================================================

  const visaInfo = booking.visaSnapshot || {};
  const transportInfo = booking.transportSnapshot || {};

  const visaName = booking.visaName || visaInfo.name || "Not selected";
  const visaPrice = Number(booking.visaPrice || visaInfo.price || 0);

  const transportName = booking.transportName || transportInfo.name || "Not selected";
  const transportPrice = Number(booking.transportPrice || transportInfo.price || 0);

  // =====================================================
  // PRICING — per pax type
  // =====================================================

  const flightSnapshot = booking.flightSnapshot || {};
  const adultPrice = Number(flightSnapshot.adultPrice || 0);
  const childPrice = Number(flightSnapshot.childPrice || 0);
  const infantPrice = Number(flightSnapshot.infantPrice || 0);

  const adults = Number(booking.adults ?? 0);
  const children = Number(booking.children ?? 0);
  const infants = Number(booking.infants ?? 0);

  const adultTotal = adults * adultPrice;
  const childTotal = children * childPrice;
  const infantTotal = infants * infantPrice;

  const hotelTotal = hotelStays.reduce((sum: number, stay: any) => sum + (stay.totalPrice || 0), 0);

  const pricingRows = [
    adults > 0
      ? `<tr>
           <td style="padding:7px 14px;color:#6b7280;font-size:13px;">Flight - Adult × ${adults}</td>
           <td style="padding:7px 14px;text-align:right;font-size:13px;">${adultPrice > 0 ? fmt(adultTotal) : "—"}</td>
         </tr>`
      : "",
    children > 0
      ? `<tr>
           <td style="padding:7px 14px;color:#6b7280;font-size:13px;">Flight - Child × ${children}</td>
           <td style="padding:7px 14px;text-align:right;font-size:13px;">${childPrice > 0 ? fmt(childTotal) : "—"}</td>
         </tr>`
      : "",
    infants > 0
      ? `<tr>
           <td style="padding:7px 14px;color:#6b7280;font-size:13px;">Flight - Infant × ${infants}</td>
           <td style="padding:7px 14px;text-align:right;font-size:13px;">${infantPrice > 0 ? fmt(infantTotal) : "—"}</td>
         </tr>`
      : "",
    hotelTotal > 0
      ? `<tr>
           <td style="padding:7px 14px;color:#6b7280;font-size:13px;">Hotels (${hotelStays.length} stay${hotelStays.length !== 1 ? "s" : ""})</td>
           <td style="padding:7px 14px;text-align:right;font-size:13px;">${fmt(hotelTotal)}</td>
         </tr>`
      : "",
    visaPrice > 0
      ? `<tr>
           <td style="padding:7px 14px;color:#6b7280;font-size:13px;">Visa - ${visaName}</td>
           <td style="padding:7px 14px;text-align:right;font-size:13px;">${fmt(visaPrice)}</td>
         </tr>`
      : "",
    transportPrice > 0
      ? `<tr>
           <td style="padding:7px 14px;color:#6b7280;font-size:13px;">Transport - ${transportName}</td>
           <td style="padding:7px 14px;text-align:right;font-size:13px;">${fmt(transportPrice)}</td>
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
           <td style="padding:7px 14px;color:#16a34a;font-size:13px;">Discount (${booking.coupon || "coupon"})</td>
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
  // MISC
  // =====================================================

  const bookingDate = booking.createdAt
    ? new Date(booking.createdAt).toLocaleDateString("en-PK", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

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
  // HTML
  // =====================================================

  return `
    <div style="padding:18px 20px;">

      <!-- HEADER -->
      <div style="text-align:center;margin-bottom:8px;">
        <div style="display:inline-block;background:#dcfce7;border-radius:50%;width:52px;height:52px;line-height:52px;font-size:26px;margin-bottom:10px;">✔</div>
        <h2 style="margin:0 0 6px;font-size:20px;font-weight:700;color:#15803d;">Custom Umrah Booking Request Submitted Successfully</h2>
        <p style="margin:0;font-size:14px;color:#6b7280;">Your custom Umrah package booking has been received. Our team will review it and contact you shortly for confirmation.</p>
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
          <td style="padding:6px 0;font-size:13px;color:#6b7280;">Booking Type</td>
          <td style="padding:6px 0;font-size:13px;font-weight:600;">Custom Umrah Package</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;">Status</td>
          <td style="padding:6px 0;font-size:13px;font-weight:600;color:#d97706;text-transform:capitalize;">${booking.status || "pending"}</td>
        </tr>
        ${booking.pnr ? `<tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;">PNR</td>
          <td style="padding:6px 0;font-size:13px;font-weight:500;">${booking.pnr}</td>
        </tr>` : ""}
      </table>



      <!-- TRAVELERS -->
      <h3 style="font-size:14px;font-weight:700;color:#1e3a5f;margin:0 0 10px;">Travelers (${(booking.passengers || []).length})</h3>
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

      <!-- ACCOMMODATION -->
      <h3 style="font-size:14px;font-weight:700;color:#1e3a5f;margin:0 0 10px;">🏨 Accommodation (${hotelStays.length} Stay${hotelStays.length !== 1 ? "s" : ""})</h3>
      <div style="overflow-x:auto;margin-bottom:20px;">
        <table style="width:100%;border-collapse:collapse;font-size:13px;border:1px solid #e5e7eb;">
          <thead>
            <tr style="background:#1e3a5f;color:#ffffff;">
              <th style="padding:9px 12px;text-align:left;font-weight:600;white-space:nowrap;">City</th>
              <th style="padding:9px 12px;text-align:left;font-weight:600;white-space:nowrap;">Hotel</th>
              <th style="padding:9px 12px;text-align:left;font-weight:600;white-space:nowrap;">Room Type</th>
              <th style="padding:9px 12px;text-align:center;font-weight:600;white-space:nowrap;">Nights</th>
              <th style="padding:9px 12px;text-align:right;font-weight:600;white-space:nowrap;">Price</th>
            </tr>
          </thead>
          <tbody>${hotelStayRows}</tbody>
        </table>
      </div>

      <!-- SERVICES -->
      <h3 style="font-size:14px;font-weight:700;color:#1e3a5f;margin:0 0 10px;">Services</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;width:180px;">Visa Service</td>
          <td style="padding:6px 0;font-size:13px;font-weight:500;">${visaName}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;">Transport Service</td>
          <td style="padding:6px 0;font-size:13px;font-weight:500;">${transportName}</td>
        </tr>
      </table>

      <!-- PAYMENT -->
      <h3 style="font-size:14px;font-weight:700;color:#1e3a5f;margin:0 0 10px;">Payment Information</h3>
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
          ${pricingRows}
          <tr style="background:#eff6ff;">
            <td style="padding:11px 14px;font-size:14px;font-weight:700;color:#1e40af;">Total Amount</td>
            <td style="padding:11px 14px;text-align:right;font-size:16px;font-weight:800;color:#2563eb;">${currency} ${Number(booking.totalAmount || 0).toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      ${
        booking.notes
          ? `<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 14px;margin-bottom:20px;">
               <div style="font-size:12px;font-weight:700;color:#475569;margin-bottom:4px;">Agent Remarks</div>
               <div style="font-size:13px;color:#475569;line-height:1.5;">${booking.notes}</div>
             </div>`
          : ""
      }

      <!-- DISCLAIMER -->
      <div style="background:#fef3c7;border:2px solid #f59e0b;border-radius:8px;padding:14px 16px;margin-bottom:8px;">
        <div style="font-size:13px;font-weight:800;color:#92400e;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">⚠ NOT VALID FOR TRAVEL</div>
        <div style="font-size:12px;color:#78350f;line-height:1.65;">
          This is a computer-generated custom Umrah booking <strong>request summary</strong> only.
          It is <strong>not a confirmed airline ticket</strong> and is not valid for check-in,
          boarding, airport travel, or airline ticket verification.
          This booking is pending review by our agency. Our team will contact you to confirm.
        </div>
      </div>
    </div>
  `;
};

export default buildCustomUmrahEmail;
