import Flight from "../models/flight.model.js";

export interface SearchFlightsParams {
  from: string;
  to: string;
  departDate?: string;
  cabin?: string;
  adults?: number;
  children?: number;
  infants?: number;
  tripType?: "oneway" | "roundtrip" | "multicity";
  multiCityLegs?: Array<{ from: string; to: string; departDate: string }>;
}

export const searchFlights = async ({
  from,
  to,
  departDate,
  cabin,
  adults = 1,
  children = 0,
  infants = 0,
  tripType,
  multiCityLegs,
}: SearchFlightsParams) => {
  const baseQuery = { status: "active" };

  const buildQuery = (leg: {
    from: string;
    to: string;
    departDate?: string;
  }) => {
    const query: any = {
      ...baseQuery,
      from: leg.from.trim().toUpperCase(),
      to: leg.to.trim().toUpperCase(),
    };
    if (leg.departDate) query.departureDate = leg.departDate;
    if (cabin) query.cabin = cabin.trim().toLowerCase();
    return query;
  };

  const legs =
    tripType === "multicity" && multiCityLegs?.length
      ? multiCityLegs
      : [{ from, to, departDate }];

  // -----------------------------
  // Departure Date
  // -----------------------------

  const flightSets = await Promise.all(
    legs.map((leg) =>
      Flight.find(buildQuery(leg)).sort({ departureTime: 1 }).lean(),
    ),
  );

  // -----------------------------
  // Passenger counts
  // -----------------------------

  const totalPassengers = adults + children + infants;

  // -----------------------------
  // Format response
  // -----------------------------

  const formatFlight = (flight: any) => {
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
  };

  if (tripType !== "multicity" || legs.length <= 1) {
    return flightSets[0].map(formatFlight);
  }

  const itineraries: any[] = [];
  const buildItineraries = (legIndex: number, selected: any[]) => {
    if (itineraries.length >= 30) return;
    if (legIndex === flightSets.length) {
      const formatted = selected.map(formatFlight);
      const first = formatted[0];
      itineraries.push({
        ...first,
        id: `multi-${selected.map((flight) => flight.id).join("-")}`,
        flightNumber: formatted
          .map((flight) => flight.flightNumber)
          .join(" / "),
        multiCityLegs: formatted,
        adultPrice: formatted.reduce(
          (sum, flight) => sum + flight.adultPrice,
          0,
        ),
        childPrice: formatted.reduce(
          (sum, flight) => sum + flight.childPrice,
          0,
        ),
        infantPrice: formatted.reduce(
          (sum, flight) => sum + flight.infantPrice,
          0,
        ),
        price: formatted.reduce((sum, flight) => sum + flight.price, 0),
        duration: formatted.map((flight) => flight.duration).join(" + "),
      });
      return;
    }
    for (const flight of flightSets[legIndex]) {
      buildItineraries(legIndex + 1, [...selected, flight]);
    }
  };

  buildItineraries(0, []);
  return itineraries;
};
