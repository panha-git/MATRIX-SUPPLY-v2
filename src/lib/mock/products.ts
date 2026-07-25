export type MockProduct = {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  subcategory: string;
  images: string[];
  wholesalePrice: number;
  retailPrice: number;
  MOQ: number;
  availableStock: number;
  soldCount: number;
  views: number;
  favouriteCount: number;
  rating: number;
  reviewCount: number;
  supplierId: string;
  supplierName: string;
  supplierLogo: string;
  verifiedSupplier: boolean;
  province: string;
  estimatedDelivery: string;
  warehouseLocation: string;
  leadTime: string;
  tags: string[];
  specifications: Record<string, string>;
  packagingInformation: string;
  createdDate: string;
};

const productSeed: MockProduct[] = [
  {
    id: "prod_001",
    title: "Premium Thai Jasmine Rice 50kg",
    shortDescription: "Aromatic AAA-grade jasmine rice tailored for restaurants and wholesalers.",
    longDescription:
      "Sourced from certified growers in Ubon Ratchathani, this AAA jasmine rice is known for its fragrance, fluffy texture, and consistent grain length. Each 50kg woven bag is triple-sealed, palletized, and ready for high-volume food service orders.",
    category: "Food & Beverage",
    subcategory: "Grains",
    images: [
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
    ],
    wholesalePrice: 32.5,
    retailPrice: 38,
    MOQ: 10,
    availableStock: 1200,
    soldCount: 764,
    views: 9800,
    favouriteCount: 205,
    rating: 4.9,
    reviewCount: 152,
    supplierId: "supp_001",
    supplierName: "Chaiyo Grain Export",
    supplierLogo: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=200&q=80",
    verifiedSupplier: true,
    province: "Ubon Ratchathani",
    estimatedDelivery: "4-6 days",
    warehouseLocation: "Bangkok",
    leadTime: "2 days",
    tags: ["rice", "jasmine", "bulk", "export", "thai"],
    specifications: { grain_length: "7mm", moisture: "13%", packaging: "polywoven bag" },
    packagingInformation: "50kg woven bag, triple-sealed, pallet ready",
    createdDate: "2024-02-14",
  },
  {
    id: "prod_002",
    title: "Industrial Coffee Beans 25kg",
    shortDescription: "Medium-roast arabica for cafés, hotels, and bakery chains.",
    longDescription:
      "Roasted in small batches and packed in oxygen-absorbing foil liners, this coffee is designed for consistent flavour and smooth extraction. It performs well in espresso bars and ready-to-brew service formats.",
    category: "Food & Beverage",
    subcategory: "Coffee",
    images: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
    ],
    wholesalePrice: 68,
    retailPrice: 82,
    MOQ: 5,
    availableStock: 480,
    soldCount: 312,
    views: 7600,
    favouriteCount: 118,
    rating: 4.7,
    reviewCount: 91,
    supplierId: "supp_002",
    supplierName: "Mekong Roastery",
    supplierLogo: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=200&q=80",
    verifiedSupplier: true,
    province: "Kampong Cham",
    estimatedDelivery: "3-5 days",
    warehouseLocation: "Phnom Penh",
    leadTime: "1 day",
    tags: ["coffee", "arabica", "roasted", "bulk"],
    specifications: { roast_level: "medium", origin: "Laos", moisture: "11%" },
    packagingInformation: "25kg corrugated carton with inner foil liner",
    createdDate: "2024-03-02",
  },
  {
    id: "prod_003",
    title: "LED Tube Lighting 18W Bulk Pack",
    shortDescription: "Energy-efficient commercial lighting for retail and warehouses.",
    longDescription:
      "These 18W LED tubes are built for high-use commercial spaces with long lifecycle components and low heat output. Available in neutral white and daylight variants for showroom and logistics environments.",
    category: "Electronics",
    subcategory: "Lighting",
    images: [
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80",
    ],
    wholesalePrice: 9.4,
    retailPrice: 12.8,
    MOQ: 50,
    availableStock: 9000,
    soldCount: 1380,
    views: 12400,
    favouriteCount: 289,
    rating: 4.8,
    reviewCount: 214,
    supplierId: "supp_003",
    supplierName: "BrightWave Electrical",
    supplierLogo: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=200&q=80",
    verifiedSupplier: true,
    province: "Phnom Penh",
    estimatedDelivery: "2-4 days",
    warehouseLocation: "Phnom Penh",
    leadTime: "1 day",
    tags: ["led", "lighting", "commercial", "bulk"],
    specifications: { wattage: "18W", color_temp: "4000K", lifespan: "25000h" },
    packagingInformation: "Retail box of 10 units, master carton of 100",
    createdDate: "2024-01-27",
  },
];

const extraProducts: MockProduct[] = Array.from({ length: 137 }, (_, index) => {
  const base = productSeed[index % productSeed.length];
  const suffix = index + 1;
  return {
    ...base,
    id: `prod_${String(suffix).padStart(3, "0")}`,
    title: `${base.title.replace(/\d+kg/gi, `${(index % 5 + 2) * 10}kg`).replace(/Bulk Pack/gi, `${index % 3 === 0 ? "Case" : "Pack"}`)} ${suffix}`,
    shortDescription: `${base.shortDescription} ${["for high-volume buyers", "for project procurement", "for regional resale"][index % 3]}.`,
    longDescription: `${base.longDescription} This lot is currently held in ${base.warehouseLocation} and is frequently replenished for repeat buyers.`,
    wholesalePrice: Number((base.wholesalePrice + (index % 7) * 1.3).toFixed(2)),
    retailPrice: Number((base.retailPrice + (index % 5) * 1.8).toFixed(2)),
    MOQ: base.MOQ + (index % 4) * 2,
    availableStock: base.availableStock + index * 30,
    soldCount: base.soldCount + index * 14,
    views: base.views + index * 180,
    favouriteCount: base.favouriteCount + index * 8,
    rating: Number((Math.min(5, base.rating + (index % 3) * 0.1)).toFixed(1)),
    reviewCount: base.reviewCount + index * 6,
    supplierId: `supp_${String((index % 6) + 1).padStart(3, "0")}`,
    supplierName: ["Chaiyo Grain Export", "Mekong Roastery", "BrightWave Electrical", "Kampot Seafood Trading", "Siem Reap Building Hub", "Phnom Penh Office Supply"][index % 6],
    province: ["Ubon Ratchathani", "Kampong Cham", "Phnom Penh", "Kampot", "Siem Reap", "Battambang"][index % 6],
    createdDate: new Date(Date.now() - index * 1000 * 60 * 60 * 24 * 5).toISOString().slice(0, 10),
  };
});

export function getMockProducts(): MockProduct[] {
  return [...productSeed, ...extraProducts];
}
