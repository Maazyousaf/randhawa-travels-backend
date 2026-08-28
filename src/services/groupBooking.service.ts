import GroupBooking, {
  IGroupBooking,
  GroupBookingType,
} from "../models/groupBooking.model.js";

// =====================================================
// GET ALL BOOKINGS
// =====================================================

export const getAllGroupBookings = async (
  query: Record<string, unknown> = {},
) => {
  return await GroupBooking.find(query).sort({
    createdAt: -1,
  });
};

// =====================================================
// GET BOOKING BY ID
// =====================================================

export const getGroupBooking = async (id: string) => {
  return await GroupBooking.findOne({
    $or: [{ _id: id }, { bookingReference: id }],
  });
};

// =====================================================
// GET BOOKINGS BY USER
// =====================================================

export const getGroupBookingsByUser = async (userId: string) => {
  return await GroupBooking.find({
    userId,
  }).sort({
    createdAt: -1,
  });
};

// =====================================================
// GET BOOKINGS BY EMAIL
// =====================================================

export const getGroupBookingsByEmail = async (email: string) => {
  return await GroupBooking.find({
    contactEmail: email.trim().toLowerCase(),
  }).sort({
    createdAt: -1,
  });
};

// =====================================================
// GET BOOKINGS BY GROUP
// =====================================================

export const getGroupBookingsByGroup = async (groupId: string) => {
  return await GroupBooking.find({
    groupId,
  }).sort({
    createdAt: -1,
  });
};

// =====================================================
// GET BOOKINGS BY TYPE
// =====================================================

export const getGroupBookingsByType = async (bookingType: GroupBookingType) => {
  return await GroupBooking.find({
    bookingType,
  }).sort({
    createdAt: -1,
  });
};

// =====================================================
// GET BOOKINGS BY STATUS
// =====================================================

export const getGroupBookingsByStatus = async (
  status: IGroupBooking["status"],
) => {
  return await GroupBooking.find({
    status,
  }).sort({
    createdAt: -1,
  });
};

// =====================================================
// UPDATE BOOKING STATUS
// =====================================================

export const updateGroupBookingStatusService = async (
  id: string,
  status: IGroupBooking["status"],
) => {
  return await GroupBooking.findOneAndUpdate(
    {
      $or: [{ _id: id }, { bookingReference: id }],
    },
    {
      $set: {
        status,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );
};

// =====================================================
// UPDATE PAYMENT STATUS
// =====================================================

export const updateGroupBookingPaymentStatus = async (
  id: string,
  paymentStatus: IGroupBooking["paymentStatus"],
) => {
  return await GroupBooking.findOneAndUpdate(
    {
      $or: [{ _id: id }, { bookingReference: id }],
    },
    {
      $set: {
        paymentStatus,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );
};

// =====================================================
// CANCEL BOOKING
// =====================================================

export const cancelGroupBookingService = async (id: string) => {
  return await GroupBooking.findOneAndUpdate(
    {
      $or: [{ _id: id }, { bookingReference: id }],
    },
    {
      $set: {
        status: "cancelled",
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );
};

// =====================================================
// COUNT BOOKINGS
// =====================================================

export const countGroupBookings = async (
  query: Record<string, unknown> = {},
) => {
  return await GroupBooking.countDocuments(query);
};

// =====================================================
// CHECK BOOKING REFERENCE
// =====================================================

export const bookingReferenceExists = async (bookingReference: string) => {
  const booking = await GroupBooking.exists({
    bookingReference,
  });

  return Boolean(booking);
};
