import { Request, Response } from "express";
import GroupTicketBooking from "../models/groupTicketBooking.model.js";
import GroupTicket from "../models/groupTicket.model.js";
import { sendEmail } from "../utils/email.js";
import { buildGroupTicketBookingEmail } from "../utils/buildGroupTicketBookingEmail.js";

type AuthenticatedRequest = Request & { user?: { id?: string; _id?: string } };

export const getGroupTickets = async (_req: Request, res: Response) => {
  try {
    const tickets = await GroupTicket.find({ active: true }).sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ success: true, count: tickets.length, tickets });
  } catch (error) {
    console.error("Error fetching group tickets:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch group tickets" });
  }
};

export const createGroupTicketBooking = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const {
      ticketId,
      customer,
      passengers,
      adults,
      children,
      infants,
      totalAmount,
      currency,
      agentRemarks,
      payment,
    } = req.body;
    
    // Fetch ticket from database
    const ticket = await GroupTicket.findOne({ id: ticketId, active: true });

    if (!ticket)
      return res
        .status(404)
        .json({ success: false, message: "Group ticket not found" });
    if (!Array.isArray(passengers) || !passengers.length) {
      return res
        .status(400)
        .json({ success: false, message: "Passenger information is required" });
    }

    const firstPassenger = passengers[0] as Record<string, unknown>;
    const customerEmail = String(customer?.email || firstPassenger.email || "")
      .trim()
      .toLowerCase();
    const customerPhone = String(
      customer?.phone || firstPassenger.phone || "",
    ).replace(/\D/g, "");

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail) ||
      customerPhone.length < 7
    ) {
      return res.status(400).json({
        success: false,
        message:
          "A valid email and phone number are required for the first passenger",
      });
    }

    const bookingReference = `GT-${Date.now().toString(36).toUpperCase()}`;
    const booking = await GroupTicketBooking.create({
      bookingReference,
      userId: req.user?.id || req.user?._id,
      ticketId,
      ticketSnapshot: ticket.toObject(),
      customer: { ...customer, email: customerEmail, phone: customerPhone },
      passengers,
      adults: Number(adults) || 1,
      children: Number(children) || 0,
      infants: Number(infants) || 0,
      totalAmount: Number(totalAmount) || ticket.fare,
      currency: currency || ticket.currency,
      agentRemarks,
      payment,
      paymentStatus: payment?.method ? "submitted" : "pending",
    });

    const emailAddress = String(booking.customer?.email || customerEmail || "")
      .trim()
      .toLowerCase();
    let emailSent = false;
    if (emailAddress) {
      try {
        await sendEmail(
          emailAddress,
          `Randhawa Air Travels Int'l - Group Ticket Request ${bookingReference}`,
          buildGroupTicketBookingEmail(booking),
        );
        emailSent = true;
        console.log(`✅ Group ticket email sent to ${emailAddress}`);
      } catch (emailError) {
        console.error(
          `❌ Group ticket email failed for ${emailAddress}:`,
          emailError,
        );
      }
    }

    return res.status(201).json({
      success: true,
      bookingReference,
      booking,
      emailSent,
    });
  } catch (error) {
    console.error("Group ticket booking error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create group ticket booking",
    });
  }
};

export const updateGroupTicketPayment = async (req: Request, res: Response) => {
  const booking = await GroupTicketBooking.findOneAndUpdate(
    { bookingReference: req.params.reference },
    { $set: { payment: req.body, paymentStatus: "submitted" } },
    { new: true },
  );
  if (!booking)
    return res
      .status(404)
      .json({ success: false, message: "Booking not found" });
  return res.status(200).json({ success: true, booking });
};

export const getMyGroupTicketBookings = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user?.id || req.user?._id;
  if (!userId) return res.status(200).json({ success: true, bookings: [] });
  const bookings = await GroupTicketBooking.find({ userId }).sort({
    createdAt: -1,
  });
  return res.status(200).json({ success: true, bookings });
};

export const getGroupTicketBookingById = async (
  req: Request,
  res: Response,
) => {
  const booking = await GroupTicketBooking.findById(req.params.id);
  if (!booking)
    return res
      .status(404)
      .json({ success: false, message: "Booking not found" });
  return res.status(200).json({ success: true, booking });
};

export const updateGroupTicketRemarks = async (req: Request, res: Response) => {
  const booking = await GroupTicketBooking.findByIdAndUpdate(
    req.params.id,
    { $set: { agentRemarks: req.body.agentRemarks || req.body.notes || "" } },
    { new: true },
  );
  if (!booking)
    return res
      .status(404)
      .json({ success: false, message: "Booking not found" });
  return res.status(200).json({ success: true, booking });
};
