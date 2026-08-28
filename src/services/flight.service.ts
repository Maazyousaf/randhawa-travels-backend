import Flight from "../models/flight.model.js";

export interface SearchFlightsParams {
  from: string;
  to: string;
  departDate?: string;
  cabin?: string;
  adults?: number;
  children?: number;
  infants?: number;
}

export const searchFlights = async ({
  from,
  to,
  departDate,
  cabin,
  adults = 1,
  children = 0,
  infants = 0,
}: SearchFlightsParams) => {
  const query: any = {
    from: from.trim().toUpperCase(),
    to: to.trim().toUpperCase(),
    status: "active",
  };

  // -----------------------------
  // Departure Date
  // -----------------------------

  if (departDate) {
    query.departureDate = departDate;
  }

  // -----------------------------
  // Cabin
  // -----------------------------

  if (cabin) {
    query.cabin = cabin.trim().toLowerCase();
  }

  const flights = await Flight.find(query)
    .sort({
      departureTime: 1,
    })
    .lean();

  // -----------------------------
  // Passenger counts
  // -----------------------------

  const totalPassengers = adults + children + infants;

  // -----------------------------
  // Format response
  // -----------------------------

  return flights.map((flight) => {
    const adultPrice = Number(flight.price) || 0;

    const childPrice = Number(flight.childPrice) || 0;

    const infantPrice = Number(flight.infantPrice) || 0;

    const totalPrice =
      adultPrice * adults + childPrice * children + infantPrice * infants;

    return {
      id: flight.id || flight._id.toString(),

      airline: flight.airline,
      airlineCode: flight.airlineCode,
      airlineLogo: flight.airlineLogo,

      flightNumber: flight.flightNumber,

      from: flight.fromCity,
      fromCode: flight.from,

      to: flight.toCity,
      toCode: flight.to,

      departureDate: flight.departureDate,

      departureTime: flight.departureTime,

      arrivalDate: flight.arrivalDate,

      arrivalTime: flight.arrivalTime,

      duration: flight.duration,

      baggage: flight.baggage,

      stops: flight.stops,

      stopCities: flight.stopCity ? [flight.stopCity] : [],

      class: flight.class,

      cabin: flight.cabin,

      seatsLeft: flight.seatsLeft,

      meal: flight.meal,

      // -------------------------
      // Pricing
      // -------------------------

      price: totalPrice,

      pricePerPassenger:
        totalPassengers > 0
          ? Math.round(totalPrice / totalPassengers)
          : adultPrice,

      adultPrice,

      childPrice,

      infantPrice,

      currency: flight.currency,
    };
  });
};
