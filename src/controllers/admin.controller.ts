import { Request, Response } from "express";
import {
  adminLogin,
  getAllUsers,
  getAllAdmins,
  getUserById,
  updateUser,
  deleteUser,
  getDashboardStats,
} from "../services/admin.service.js";
import FlightBooking from "../models/flightBooking.model.js";
import GroupBooking from "../models/groupBooking.model.js";
import HotelBooking from "../models/hotelBooking.model.js";
import User from "../models/user.model.js";

// ==============================
// Admin Login
// ==============================
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await adminLogin(email, password);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Dashboard Stats
// ==============================
export const getStats = async (req: Request, res: Response) => {
  try {
    const result = await getDashboardStats();

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get All Users
// ==============================
export const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await getAllUsers();

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get All Admins
// ==============================
export const getAdmins = async (req: Request, res: Response) => {
  try {
    const result = await getAllAdmins();

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get User By ID
// ==============================
export const getUser = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      });
    }

    const result = await getUserById(id);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Update User
// ==============================
export const updateUserById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { name, email, phone, password } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      });
    }

    const result = await updateUser(id, { name, email, phone, password });

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Delete User
// ==============================
export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      });
    }

    const result = await deleteUser(id);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get All Flight Bookings
// ==============================
export const getFlightBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await FlightBooking.find()
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Flight Booking By ID
// ==============================
export const getFlightBooking = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Flight booking id is required",
      });
    }

    const booking = await FlightBooking.findById(id).populate(
      "userId",
      "name email phone",
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Flight booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Update Flight Booking
// ==============================
export const updateFlightBooking = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updates = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Flight booking id is required",
      });
    }

    // Get the current booking before update to check what changed
    const oldBooking = await FlightBooking.findById(id);
    
    const booking = await FlightBooking.findByIdAndUpdate(
      id,
      { ...updates },
      { new: true, runValidators: false },
    ).populate("userId", "name email phone");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Flight booking not found",
      });
    }

    // Send email & SMS if status or payment status changed
    if (oldBooking && (oldBooking.status !== booking.status || oldBooking.paymentStatus !== booking.paymentStatus)) {
      const customerEmail = booking.customerEmail;
      const customerName = booking.customerName || booking.passengers?.[0]?.firstName || "Valued Customer";
      const bookingRef = booking.bookingReference || booking.requestId;
      
      // Generate email from template
      const { generateFlightBookingEmail } = await import("../utils/emailTemplates.js");
      const emailTemplate = generateFlightBookingEmail(
        customerName,
        bookingRef,
        booking.status,
        booking.paymentStatus,
        booking.airline,
        booking.flightNumber,
        booking.from,
        booking.fromCode,
        booking.to,
        booking.toCode,
        booking.departureDate,
        booking.departureTime,
        (booking.totalAmount as any) || 0,
        oldBooking.status !== booking.status,
        oldBooking.paymentStatus !== booking.paymentStatus
      );

      // Send email notification
      if (customerEmail) {
        try {
          const { sendEmail } = await import("../utils/email.js");
          await sendEmail(
            customerEmail,
            emailTemplate.subject,
            emailTemplate.body
          );
          console.log(`✅ Flight booking email sent to ${customerEmail}`);
        } catch (emailError) {
          console.error("❌ Failed to send booking email:", emailError);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Flight booking updated successfully",
      booking,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Delete Flight Booking
// ==============================
export const deleteFlightBooking = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Flight booking id is required",
      });
    }

    const booking = await FlightBooking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Flight booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Flight booking deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get All Group Bookings
// ==============================
export const getGroupBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await GroupBooking.find()
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Group Booking By ID
// ==============================
export const getGroupBooking = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Group booking id is required",
      });
    }

    const booking = await GroupBooking.findById(id).populate(
      "userId",
      "name email phone",
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Group booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Update Group Booking
// ==============================
// ==============================
export const updateGroupBooking = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updates = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Group booking id is required",
      });
    }

    // Get the current booking before update to check what changed
    const oldBooking = await GroupBooking.findById(id);

    const booking = await GroupBooking.findByIdAndUpdate(
      id,
      { ...updates },
      { new: true, runValidators: false },
    ).populate("userId", "name email phone");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Group booking not found",
      });
    }

    // Send email & SMS if status or payment status changed
    if (oldBooking && (oldBooking.status !== booking.status || oldBooking.paymentStatus !== booking.paymentStatus)) {
      const customerEmail = booking.customerEmail;
      const customerName = booking.customerName || booking.groupName || "Valued Customer";
      const bookingRef = booking.bookingReference;
      const passengerCount = (booking.passengers as any)?.length || 0;
      
      // Generate email from template
      const { generateGroupBookingEmail } = await import("../utils/emailTemplates.js");
      const emailTemplate = generateGroupBookingEmail(
        customerName,
        bookingRef,
        booking.status,
        booking.paymentStatus,
        booking.groupName,
        passengerCount,
        (booking.totalAmount as any) || 0,
        oldBooking.status !== booking.status,
        oldBooking.paymentStatus !== booking.paymentStatus
      );

      // Send email notification
      if (customerEmail) {
        try {
          const { sendEmail } = await import("../utils/email.js");
          await sendEmail(
            customerEmail,
            emailTemplate.subject,
            emailTemplate.body
          );
          console.log(`✅ Group booking email sent to ${customerEmail}`);
        } catch (emailError) {
          console.error("❌ Failed to send booking email:", emailError);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Group booking updated successfully",
      booking,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Delete Group Booking
// ==============================
export const deleteGroupBooking = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Group booking id is required",
      });
    }

    const booking = await GroupBooking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Group booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Group booking deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get All Hotel Bookings
// ==============================
export const getHotelBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await HotelBooking.find()
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Hotel Booking By ID
// ==============================
export const getHotelBooking = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Hotel booking id is required",
      });
    }

    const booking = await HotelBooking.findById(id).populate(
      "userId",
      "name email phone",
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Hotel booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Update Hotel Booking
// ==============================
// ==============================
export const updateHotelBooking = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updates = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Hotel booking id is required",
      });
    }

    // Get the current booking before update to check what changed
    const oldBooking = await HotelBooking.findById(id);

    const booking = await HotelBooking.findByIdAndUpdate(
      id,
      { ...updates },
      { new: true, runValidators: false },
    ).populate("userId", "name email phone");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Hotel booking not found",
      });
    }

    // Send email & SMS if status or payment status changed
    if (oldBooking && (oldBooking.status !== booking.status || oldBooking.paymentStatus !== booking.paymentStatus)) {
      const customerEmail = booking.customerEmail;
      const customerName = booking.customerName || booking.hotelName || "Valued Customer";
      const bookingRef = booking.bookingReference;
      
      // Generate email from template
      const { generateHotelBookingEmail } = await import("../utils/emailTemplates.js");
      const emailTemplate = generateHotelBookingEmail(
        customerName,
        bookingRef,
        booking.status,
        booking.paymentStatus,
        booking.hotelName,
        booking.checkIn,
        booking.checkOut,
        booking.rooms || 0,
        booking.nights || 0,
        (booking.totalAmount as any) || 0,
        oldBooking.status !== booking.status,
        oldBooking.paymentStatus !== booking.paymentStatus
      );

      // Send email notification
      if (customerEmail) {
        try {
          const { sendEmail } = await import("../utils/email.js");
          await sendEmail(
            customerEmail,
            emailTemplate.subject,
            emailTemplate.body
          );
          console.log(`✅ Hotel booking email sent to ${customerEmail}`);
        } catch (emailError) {
          console.error("❌ Failed to send booking email:", emailError);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Hotel booking updated successfully",
      booking,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Delete Hotel Booking
// ==============================
export const deleteHotelBooking = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Hotel booking id is required",
      });
    }

    const booking = await HotelBooking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Hotel booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Hotel booking deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// SEND ADMIN REPLY TO GROUP BOOKING
// POST /admin/group-bookings/:id/admin-reply
// PROTECTED - Admin only
// =====================================================
export const sendAdminReplyToGroupBooking = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const authReq = req as any; // AuthenticatedRequest
    const id = String(req.params.id);
    const { message, resolved } = req.body as {
      message?: string;
      resolved?: boolean;
    };

    if (!message || !String(message).trim()) {
      res
        .status(400)
        .json({ success: false, message: "Reply message is required" });
      return;
    }

    // Get admin ID from auth middleware
    const adminId = authReq.user?.id;

    if (!adminId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    // Fetch admin user from database to get latest info
    const adminUser = await User.findById(adminId).select("+name +email"); // Explicitly select fields

    if (!adminUser) {
      console.log(`❌ Admin user not found with ID: ${adminId}`);
      res.status(404).json({
        success: false,
        message: "Admin user not found",
      });
      return;
    }

    // Use admin's actual name and email from database
    const adminName = adminUser.name ? String(adminUser.name).trim() : "Admin";
    const adminEmail = adminUser.email ? String(adminUser.email).trim() : "";

    console.log(`✅ Admin replying - ID: ${adminId}`);
    console.log(`✅ Full User Object:`, JSON.stringify(adminUser));
    console.log(`✅ Admin Name: "${adminName}"`);
    console.log(`✅ Admin Email: "${adminEmail}"`);

    const booking = await GroupBooking.findById(id);

    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found" });
      return;
    }

    const replyId = `reply-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const newReply = {
      id: replyId,
      message: String(message).trim(),
      adminId: adminId,
      adminName,
      adminEmail,
      createdAt: new Date(),
      resolved: Boolean(resolved) || false,
    };

    if (!booking.adminReplies) {
      booking.adminReplies = [];
    }

    booking.adminReplies.push(newReply as any);
    await booking.save();

    res.status(201).json({
      success: true,
      message: "Admin reply sent successfully",
      reply: newReply,
      booking,
    });
  } catch (error: any) {
    console.error("❌ Send Admin Reply Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send admin reply",
    });
  }
};
