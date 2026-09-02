// =====================================================
// EMAIL TEMPLATES
// =====================================================
// Reusable email template generators for booking notifications

export interface EmailTemplate {
  subject: string;
  body: string;
}

// =====================================================
// FLIGHT BOOKING EMAIL TEMPLATES
// =====================================================

export const generateFlightBookingEmail = (
  customerName: string,
  bookingReference: string,
  status: string,
  paymentStatus: string,
  airline: string,
  flightNumber: string,
  from: string,
  fromCode: string,
  to: string,
  toCode: string,
  departureDate: string,
  departureTime: string,
  totalAmount: number,
  statusChanged: boolean,
  paymentStatusChanged: boolean
): EmailTemplate => {
  let statusMessage = "";
  let subject = "";

  if (statusChanged) {
    subject = `Your Flight Booking Status Updated - ${bookingReference}`;
    const statusMap: { [key: string]: string } = {
      pending: "awaiting confirmation",
      confirmed: "CONFIRMED! Your booking is confirmed.",
      cancelled: "has been CANCELLED.",
      rejected: "has been REJECTED.",
    };
    statusMessage = `Your flight booking ${bookingReference} ${
      statusMap[status] || status
    }.`;
  }

  if (paymentStatusChanged) {
    subject = `Payment Status Update - ${bookingReference}`;
    const paymentMap: { [key: string]: string } = {
      pending: "is pending",
      submitted: "has been received and is being verified",
      verified: "has been VERIFIED and confirmed",
      rejected: "has been REJECTED",
    };
    statusMessage = `Your payment for booking ${bookingReference} ${
      paymentMap[paymentStatus] || paymentStatus
    }.`;
  }

  const body = `
    <h2>Hello ${customerName},</h2>
    
    <p>${statusMessage}</p>
    
    <h3>Booking Details:</h3>
    <ul>
      <li><strong>Booking Reference:</strong> ${bookingReference}</li>
      <li><strong>Status:</strong> ${status}</li>
      <li><strong>Payment Status:</strong> ${paymentStatus}</li>
      <li><strong>Flight:</strong> ${airline} ${flightNumber}</li>
      <li><strong>From:</strong> ${from} (${fromCode})</li>
      <li><strong>To:</strong> ${to} (${toCode})</li>
      <li><strong>Date:</strong> ${departureDate} at ${departureTime}</li>
      <li><strong>Total Amount:</strong> PKR ${totalAmount?.toLocaleString()}</li>
    </ul>
    
    <p>If you have any questions, please don't hesitate to contact us.</p>
    
    <p>Best regards,<br/>Randhawa Air Travels Int'l</p>
  `;

  return { subject, body };
};

// =====================================================
// GROUP BOOKING EMAIL TEMPLATES
// =====================================================

export const generateGroupBookingEmail = (
  customerName: string,
  bookingReference: string,
  status: string,
  paymentStatus: string,
  groupName: string,
  passengerCount: number,
  totalAmount: number,
  statusChanged: boolean,
  paymentStatusChanged: boolean
): EmailTemplate => {
  let statusMessage = "";
  let subject = "";

  if (statusChanged) {
    subject = `Your Group Booking Status Updated - ${bookingReference}`;
    const statusMap: { [key: string]: string } = {
      pending: "awaiting confirmation",
      confirmed: "CONFIRMED! Your group booking is confirmed.",
      cancelled: "has been CANCELLED.",
      completed: "has been COMPLETED.",
    };
    statusMessage = `Your group booking ${bookingReference} ${
      statusMap[status] || status
    }.`;
  }

  if (paymentStatusChanged) {
    subject = `Payment Status Update - ${bookingReference}`;
    const paymentMap: { [key: string]: string } = {
      pending: "is pending",
      paid: "has been VERIFIED and confirmed",
      failed: "has FAILED",
      refunded: "has been REFUNDED",
    };
    statusMessage = `Your payment for group booking ${bookingReference} ${
      paymentMap[paymentStatus] || paymentStatus
    }.`;
  }

  const body = `
    <h2>Hello ${customerName},</h2>
    
    <p>${statusMessage}</p>
    
    <h3>Booking Details:</h3>
    <ul>
      <li><strong>Booking Reference:</strong> ${bookingReference}</li>
      <li><strong>Status:</strong> ${status}</li>
      <li><strong>Payment Status:</strong> ${paymentStatus}</li>
      <li><strong>Group Name:</strong> ${groupName}</li>
      <li><strong>Passengers:</strong> ${passengerCount}</li>
      <li><strong>Total Amount:</strong> PKR ${totalAmount?.toLocaleString()}</li>
    </ul>
    
    <p>If you have any questions, please don't hesitate to contact us.</p>
    
    <p>Best regards,<br/>Randhawa Air Travels Int'l</p>
  `;

  return { subject, body };
};

// =====================================================
// HOTEL BOOKING EMAIL TEMPLATES
// =====================================================

export const generateHotelBookingEmail = (
  customerName: string,
  bookingReference: string,
  status: string,
  paymentStatus: string,
  hotelName: string,
  checkIn: string,
  checkOut: string,
  rooms: number,
  nights: number,
  totalAmount: number,
  statusChanged: boolean,
  paymentStatusChanged: boolean
): EmailTemplate => {
  let statusMessage = "";
  let subject = "";

  if (statusChanged) {
    subject = `Your Hotel Booking Status Updated - ${bookingReference}`;
    const statusMap: { [key: string]: string } = {
      pending: "awaiting confirmation",
      confirmed: "CONFIRMED! Your hotel booking is confirmed.",
      cancelled: "has been CANCELLED.",
      rejected: "has been REJECTED.",
    };
    statusMessage = `Your hotel booking ${bookingReference} ${
      statusMap[status] || status
    }.`;
  }

  if (paymentStatusChanged) {
    subject = `Payment Status Update - ${bookingReference}`;
    const paymentMap: { [key: string]: string } = {
      pending: "is pending",
      submitted: "has been received and is being verified",
      verified: "has been VERIFIED and confirmed",
      rejected: "has been REJECTED",
    };
    statusMessage = `Your payment for hotel booking ${bookingReference} ${
      paymentMap[paymentStatus] || paymentStatus
    }.`;
  }

  const body = `
    <h2>Hello ${customerName},</h2>
    
    <p>${statusMessage}</p>
    
    <h3>Booking Details:</h3>
    <ul>
      <li><strong>Booking Reference:</strong> ${bookingReference}</li>
      <li><strong>Status:</strong> ${status}</li>
      <li><strong>Payment Status:</strong> ${paymentStatus}</li>
      <li><strong>Hotel:</strong> ${hotelName}</li>
      <li><strong>Check-in:</strong> ${checkIn}</li>
      <li><strong>Check-out:</strong> ${checkOut}</li>
      <li><strong>Rooms:</strong> ${rooms} for ${nights} nights</li>
      <li><strong>Total Amount:</strong> PKR ${totalAmount?.toLocaleString()}</li>
    </ul>
    
    <p>If you have any questions, please don't hesitate to contact us.</p>
    
    <p>Best regards,<br/>Randhawa Air Travels Int'l</p>
  `;

  return { subject, body };
};
