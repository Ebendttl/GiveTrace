import { Cause } from './types';

// Valid default Solana devnet demo recipient key (fallback treasury)
export const DEFAULT_DEMO_TREASURY = "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU";

export const MOCK_CAUSES: Cause[] = [
  {
    id: "cause-1",
    name: "Solar Powered Literacy Kits for Rural Kenya",
    category: "education",
    location: "Garissa, Kenya",
    description: "Providing solar-powered digital tablet libraries and off-grid electricity to rural primary schools, empowering young girls with accessible STEM learning materials.",
    fundingGoalSol: 15.0,
    fundedSol: 9.4,
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop",
    treasuryAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  },
  {
    id: "cause-2",
    name: "Mangrove Reforestation & Coastal Defense",
    category: "climate",
    location: "Demak, Indonesia",
    description: "Restoring critical mangrove ecosystems to prevent severe coastal erosion, buffer storm surges, and protect fishing communities across coastal Java.",
    fundingGoalSol: 25.0,
    fundedSol: 18.2,
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop",
    treasuryAddress: "29v4L9d1S5G34H1fR5Qx4aN55P3qQ2Z1W0E9r8T7Y6U5",
  },
  {
    id: "cause-3",
    name: "Adaptive Mobility & Assistive Tech Outreach",
    category: "disability-support",
    location: "Guatemala City, Guatemala",
    description: "Custom fitting terrain-resilient wheelchairs and custom 3D-printed assistive devices for low-vision and mobility-impaired youth in high-altitude regions.",
    fundingGoalSol: 10.0,
    fundedSol: 6.8,
    imageUrl: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=1000&auto=format&fit=crop",
    treasuryAddress: "9A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8S9t0U1",
  },
  {
    id: "cause-4",
    name: "Mobile Maternal Health Clinics",
    category: "health",
    location: "Chocó, Colombia",
    description: "Deploying solar-equipped river boat clinics with portable ultrasound equipment to deliver prenatal care and essential medical support to isolated rainforest communities.",
    fundingGoalSol: 30.0,
    fundedSol: 21.5,
    imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1000&auto=format&fit=crop",
    treasuryAddress: "4D5e6F7g8H9i0J1k2L3m4N5o6P7q8R9s0T1u2V3w4X5",
  },
  {
    id: "cause-5",
    name: "Urban Micro-Farming & Nutrition Security",
    category: "poverty",
    location: "Detroit, Michigan, USA",
    description: "Transforming vacant urban lots into high-yield, community-owned hydroponic farms providing fresh organic produce to food desert neighborhoods.",
    fundingGoalSol: 12.5,
    fundedSol: 8.9,
    imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb247a5?q=80&w=1000&auto=format&fit=crop",
    treasuryAddress: "6E7f8G9h0I1j2K3l4M5n6O7p8Q9r0S1t2U3v4W5x6Y7",
  },
  {
    id: "cause-6",
    name: "Clean Water Well Infrastructure",
    category: "poverty",
    location: "Rajasthan, India",
    description: "Constructing deep solar-pump boreholes and bio-sand filtration systems to ensure year-round clean drinking water for desert farming villages.",
    fundingGoalSol: 20.0,
    fundedSol: 14.1,
    imageUrl: "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?q=80&w=1000&auto=format&fit=crop",
    treasuryAddress: "8F9g0H1i2J3k4L5m6N7o8P9q0R1s2T3u4V5w6X7y8Z9",
  }
];

export function getCauseById(id: string): Cause | undefined {
  return MOCK_CAUSES.find(cause => cause.id === id);
}
