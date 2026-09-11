// =====================================================
// CUSTOM UMRAH SERVICES CONFIGURATION
// Static configuration for Visa, Transport, and Ziyarat
// =====================================================

export interface CustomUmrahService {
  id: string;
  name: string;
  description: string;
  pricePerPerson: number;
  pricePerPackage?: number;
  category: "basic" | "standard" | "premium";
  duration?: string;
  inclusions?: string[];
  status: "active" | "inactive";
  // For transport filtering
  minPassengers?: number;
  maxPassengers?: number;
  applicableCities?: ("jeddah" | "madinah")[];
}

export interface CustomUmrahServicesConfig {
  visa: CustomUmrahService[];
  transport: CustomUmrahService[];
  ziyarat: CustomUmrahService[];
}

export const CUSTOM_UMRAH_SERVICES: CustomUmrahServicesConfig = {
  // =====================================================
  // VISA SERVICES
  // =====================================================
  visa: [
    {
      id: "visa-none",
      name: "I will Arrange My Own",
      description: "I will arrange my own visa",
      pricePerPerson: 0,
      category: "basic",
      status: "active",
    },
    {
      id: "visa-normal",
      name: "Normal Visa Processing",
      description:
        "Standard Umrah visa processing. Processing time: 4-5 working days.",
      pricePerPerson: 8500,
      category: "standard",
      duration: "4-5 working days",
      status: "active",
    },
    {
      id: "visa-express",
      name: "Express Umrah Visa",
      description:
        "Fast-track Umrah visa processing with priority handling. Processing time: 3-5 working days.",
      pricePerPerson: 12000,
      category: "premium",
      duration: "3-5 working days",
      status: "active",
    },
  ],

  // =====================================================
  // TRANSPORT SERVICES
  // =====================================================
  transport: [
    {
      id: "transport-none",
      name: "No Transport",
      description: "I will arrange my own transportation",
      pricePerPerson: 0,
      category: "basic",
      status: "active",
    },
    {
      id: "transport-car-2pax",
      name: "Private Car (1-2 persons)",
      description: "Comfortable private car for one or two passengers",
      pricePerPerson: 0,
      pricePerPackage: 15000,
      category: "standard",
      minPassengers: 1,
      maxPassengers: 2,
      applicableCities: ["jeddah", "madinah"],
      inclusions: [
        "Private car pickup",
        "Air-conditioned vehicle",
        "Professional driver",
      ],
      status: "active",
    },
    {
      id: "transport-van-2to4pax",
      name: "Private Van (1-4 persons)",
      description: "Spacious private van with extra luggage space",
      pricePerPerson: 0,
      pricePerPackage: 30000,
      category: "standard",
      minPassengers: 1,
      maxPassengers: 4,
      applicableCities: ["jeddah", "madinah"],
      inclusions: [
        "Private van pickup",
        "Air-conditioned vehicle",
        "Extra luggage space",
        "Professional driver",
      ],
      status: "active",
    },
    {
      id: "transport-staria-3to5pax",
      name: "Staria/Starex Taxi (3-5 Person)",
      description:
        "Comfortable taxi van for 3-5 passengers - 5,500 SAR per person",
      pricePerPerson: 5500,
      category: "standard",
      minPassengers: 3,
      maxPassengers: 5,
      applicableCities: ["jeddah", "madinah"],
      inclusions: [
        "Staria/Starex vehicle",
        "Air-conditioned",
        "Professional driver",
      ],
      status: "active",
    },
    {
      id: "transport-starex-5to10pax",
      name: "Starex (5-10 Person)",
      description: "Large minibus for 5-10 passengers - 4,800 SAR per person",
      pricePerPerson: 4800,
      category: "standard",
      minPassengers: 5,
      maxPassengers: 10,
      applicableCities: ["jeddah", "madinah"],
      inclusions: ["Starex minibus", "Air-conditioned", "Professional driver"],
      status: "active",
    },
    {
      id: "transport-bus-5to10pax",
      name: "Bus (5-10 Person)",
      description: "Charter bus for 5-10 passengers - 3,500 SAR per person",
      pricePerPerson: 3500,
      category: "standard",
      minPassengers: 5,
      maxPassengers: 10,
      applicableCities: ["jeddah", "madinah"],
      inclusions: ["Charter bus", "Air-conditioned", "Professional driver"],
      status: "active",
    },
    {
      id: "transport-large-bus-11to20pax",
      name: "Large Bus (11-20 Person)",
      description:
        "Large charter bus for 11-20 passengers - 3,000 SAR per person",
      pricePerPerson: 3000,
      category: "standard",
      minPassengers: 11,
      maxPassengers: 20,
      applicableCities: ["jeddah", "madinah"],
      inclusions: [
        "Large charter bus",
        "Air-conditioned",
        "Professional driver",
        "Comfortable seating",
      ],
      status: "active",
    },
  ],

  // Ziyarat feature removed - not needed
  ziyarat: [],
};

// =====================================================
// HELPER FUNCTIONS
// =====================================================

export const getServiceById = (
  type: "visa" | "transport" | "ziyarat",
  id: string,
): CustomUmrahService | null => {
  const services = CUSTOM_UMRAH_SERVICES[type];
  return services.find((s) => s.id === id && s.status === "active") || null;
};

export const getActiveServices = () => {
  return {
    visa: CUSTOM_UMRAH_SERVICES.visa.filter((s) => s.status === "active"),
    transport: CUSTOM_UMRAH_SERVICES.transport.filter(
      (s) => s.status === "active",
    ),
    ziyarat: CUSTOM_UMRAH_SERVICES.ziyarat.filter((s) => s.status === "active"),
  };
};
