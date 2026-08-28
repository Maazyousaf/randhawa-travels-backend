// =====================================================
// CUSTOM UMRAH TYPES
// TypeScript type definitions for Custom Umrah API
// =====================================================

export interface CustomUmrahTripDetails {
  adults: number;
  children: number;
  infants: number;
  pakistanAirport?: string;
  pakistanAirportCity?: string;
  saudiAirport?: string;
  saudiAirportCity?: string;
  departureDate: string;
  returnDate: string;
}

export interface CustomUmrahHotelSelection {
  makkahHotelId: string;
  makkahRoomType?: string;
  madinahHotelId: string;
  madinahRoomType?: string;
}

export interface CustomUmrahServiceSelection {
  visaServiceId?: string;
  transportServiceId?: string;
  ziyaratServiceId?: string;
}

export interface CustomUmrahPassenger {
  firstName: string;
  lastName: string;
  gender?: "male" | "female" | "other" | "";
  dob?: string;
  dateOfBirth?: string;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
  passportCountry?: string;
  passportUrl?: string;
  type: "adult" | "child" | "infant";
}

export interface CustomUmrahCustomer {
  name: string;
  email: string;
  phone: string;
}

export interface CustomUmrahPriceBreakdown {
  adults: number;
  children: number;
  infants: number;
  totalPassengers: number;
  nights?: number;

  flight?: {
    id: string;
    airline: string;
    flightNumber: string;
    adultPrice: number;
    childPrice: number;
    infantPrice: number;
    totalPrice: number;
  };

  // Support for multiple hotel stays
  hotelStays?: Array<{
    id: string;
    stayNumber: number;
    city: "makkah" | "madinah";
    hotelId: string;
    hotelName: string;
    starRating: number;
    roomType: string;
    checkInDate: string;
    checkOutDate: string;
    nights: number;
    pricePerNight: number;
    pricePerPerson: number;
    totalPrice: number;
  }>;

  // Kept for backward compatibility
  makkahHotel?: {
    id: string;
    name: string;
    starRating: number;
    pricePerPerson: number;
    pricePerNight: number;
    nights: number;
    totalPrice: number;
  };

  madinahHotel?: {
    id: string;
    name: string;
    starRating: number;
    pricePerPerson: number;
    pricePerNight: number;
    nights: number;
    totalPrice: number;
  };

  visa?: {
    id: string;
    name: string;
    pricePerPerson?: number;
    pricePerPackage?: number;
    totalPrice: number;
  };

  transport?: {
    id: string;
    name: string;
    pricePerPerson?: number;
    pricePerPackage?: number;
    totalPrice: number;
  };

  ziyarat?: {
    id: string;
    name: string;
    pricePerPerson?: number;
    pricePerPackage?: number;
    totalPrice: number;
  };

  subtotal: number;
  total: number;
  currency: string;
  pricePerPerson: number;
}

export interface CustomUmrahBookingRequest {
  // Trip details
  adults: number;
  children: number;
  infants: number;
  pakistanAirport?: string;
  pakistanAirportCity?: string;
  saudiAirport?: string;
  saudiAirportCity?: string;
  departureDate: string;
  returnDate: string;

  // Hotel stays - NEW: Support for multiple stays
  hotelStays?: CustomUmrahHotelStayRequest[];

  // Selections - Legacy fallback
  flightId?: string;
  makkahHotelId?: string;
  madinahRoomTypeId?: string;
  madinahHotelId?: string;
  makkahRoomTypeId?: string;
  visaServiceId?: string;
  transportServiceId?: string;

  // PNR
  pnr?: string;

  // Customer
  customerName: string;
  customerEmail: string;
  customerPhone: string;

  // Passengers
  passengers: CustomUmrahPassenger[];

  // Payment
  paymentMethod?: "agency" | "bank";
  payment?: any;

  // Notes
  notes?: string;
}

export interface CustomUmrahBookingResponse {
  success: boolean;
  message: string;
  booking?: any;
  bookingReference?: string;
}

export interface CustomUmrahHotelStayRequest {
  id: string;
  city: "makkah" | "madinah";
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  hotelId?: string;
  roomTypeId?: string;
}

export interface CustomUmrahCalculatePriceRequest {
  adults: number;
  children: number;
  infants: number;
  departureDate: string;
  returnDate: string;
  // Support for multiple hotel stays
  hotelStays?: CustomUmrahHotelStayRequest[];
  // Kept for backward compatibility
  makkahHotelId?: string;
  makkahRoomTypeId?: string;
  madinahHotelId?: string;
  madinahRoomTypeId?: string;
  makkahNights?: number;
  madinahNights?: number;
  flightId?: string;
  visaServiceId?: string;
  transportServiceId?: string;
  ziyaratServiceId?: string;
}

export interface CustomUmrahCalculatePriceResponse {
  success: boolean;
  breakdown: CustomUmrahPriceBreakdown;
  totalAmount: number;
  currency: string;
}
