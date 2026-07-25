export type MockSupplier = {
  id: string;
  companyName: string;
  logo: string;
  banner: string;
  province: string;
  country: string;
  businessCategory: string;
  businessDescription: string;
  yearsInBusiness: number;
  responseRate: number;
  averageResponseTime: string;
  followers: number;
  productsCount: number;
  businessLicenceNumber: string;
  verifiedBadge: boolean;
  factoryImages: string[];
  warehouseImages: string[];
  officeImages: string[];
  certificates: string[];
  rating: number;
  reviews: number;
  companyStory: string;
};

const categories = ["Food & Beverage", "Agriculture", "Electronics", "Construction Materials", "Office Supplies", "Packaging Supplies"];
const provinces = ["Phnom Penh", "Kandal", "Battambang", "Siem Reap", "Kampong Cham", "Kampot", "Sihanoukville", "Takeo", "Banteay Meanchey", "Pursat"];
const prefixes = ["Mekong", "Angkor", "Tonle", "Sovann", "Bayon", "Kiri", "Bassac", "Apsara", "Chaktomuk", "Kampuchea"];
const sectors = {
  "Food & Beverage": ["Harvest Foods", "Cold Chain Trading", "Rice Export", "Cafe Supply", "Hospitality Ingredients"],
  Agriculture: ["Agri Inputs", "Irrigation Works", "Farm Supply", "Seed Cooperative", "Soil Science"],
  Electronics: ["Electrical Depot", "Lighting Systems", "Power Components", "Smart Fixtures", "Trade Electronics"],
  "Construction Materials": ["Building Hub", "Steel Supply", "Site Materials", "Concrete Works", "Hardware Depot"],
  "Office Supplies": ["Workspace Supply", "Office Systems", "Furniture Contract", "Stationery House", "Corporate Interiors"],
  "Packaging Supplies": ["Packaging House", "Carton Works", "Food Pack Supply", "Label & Wrap", "Logistics Packaging"],
};
const images = {
  logo: [
    "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=200&q=80",
  ],
  banner: [
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1538592116845-119a3974c958?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
  ],
  factory: ["https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=900&q=80"],
  warehouse: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=900&q=80"],
  office: ["https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=900&q=80"],
};

function pick<T>(items: T[], index: number) {
  return items[index % items.length];
}

export function getMockSuppliers(count = 60): MockSupplier[] {
  return Array.from({ length: count }, (_, index) => {
    const businessCategory = pick(categories, index);
    const companyName = `${pick(prefixes, index)} ${pick(sectors[businessCategory as keyof typeof sectors], Math.floor(index / categories.length) + index)}`;
    const province = pick(provinces, index * 2);
    const years = 6 + ((index * 7) % 24);
    return {
      id: `supp_${String(index + 1).padStart(4, "0")}`,
      companyName,
      logo: pick(images.logo, index),
      banner: pick(images.banner, index),
      province,
      country: "Cambodia",
      businessCategory,
      businessDescription: `${companyName} supplies ${businessCategory.toLowerCase()} buyers with verified inventory, documented dispatch windows, and repeat-order support from its ${province} operation.`,
      yearsInBusiness: years,
      responseRate: 91 + (index % 9),
      averageResponseTime: `${20 + (index % 6) * 15}m`,
      followers: 740 + index * 87,
      productsCount: 18 + ((index * 5) % 92),
      businessLicenceNumber: `KH-${province.slice(0, 2).toUpperCase()}-${920000 + index * 137}`,
      verifiedBadge: index % 13 !== 0,
      factoryImages: [pick(images.factory, index), pick(images.factory, index + 1)],
      warehouseImages: [pick(images.warehouse, index), pick(images.warehouse, index + 1)],
      officeImages: [pick(images.office, index)],
      certificates: [index % 2 ? "ISO 9001" : "HACCP", index % 3 ? "Tax Registered" : "Export Documentation Ready", "Matrix Verified"],
      rating: Number((4.45 + (index % 10) * 0.05).toFixed(1)),
      reviews: 120 + ((index * 31) % 1800),
      companyStory: `Founded ${years} years ago, ${companyName} grew from direct trade relationships into a dependable supplier for retailers, restaurants, project buyers, and regional distributors.`,
    };
  });
}
