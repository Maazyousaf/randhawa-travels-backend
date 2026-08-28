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
      name: "No Visa",
      description: "I will arrange my own visa",
      pricePerPerson: 0,
      category: "basic",
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
      inclusions: [
        "Express visa processing",
        "Priority document verification",
        "Fast-track embassy submission",
        "Dedicated support",
        "SMS & email updates",
      ],
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
      id: "transport-shared",
      name: "Shared Transport",
      description:
        "Comfortable shared transport for airport transfers and intercity travel between Makkah and Madinah.",
      pricePerPerson: 6000,
      category: "standard",
      duration: "Full trip duration",
      inclusions: [
        "Airport pickup & drop-off",
        "Makkah to Madinah transfer",
        "Madinah to Makkah transfer",
        "Air-conditioned coach",
        "Professional driver",
      ],
      status: "active",
    },
    {
      id: "transport-private-sedan",
      name: "Private Sedan",
      description:
        "Private sedan service for your family with dedicated driver (4-5 persons).",
      pricePerPerson: 0,
      pricePerPackage: 35000,
      category: "premium",
      duration: "Full trip duration",
      inclusions: [
        "Private sedan (4-5 persons)",
        "Airport pickup & drop-off",
        "All intercity transfers",
        "Dedicated professional driver",
        "24/7 availability",
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
