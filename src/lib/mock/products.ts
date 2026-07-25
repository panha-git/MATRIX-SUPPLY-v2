import { getMockSuppliers } from "./suppliers";

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

const imagePools: Record<string, string[]> = {
  food: [
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80",
  ],
  agri: [
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=900&q=80",
  ],
  electronics: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1563920443079-783e5c786b83?auto=format&fit=crop&w=900&q=80",
  ],
  construction: [
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1594818379496-da1e345b0ded?auto=format&fit=crop&w=900&q=80",
  ],
  office: [
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
  ],
  packaging: [
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=900&q=80",
  ],
};

const productLines = [
  { category: "Food & Beverage", subcategory: "Rice & Grains", base: "Cambodian Fragrant Rice", variants: ["Sen Kra Ob", "Premium Jasmine", "Organic Brown", "Restaurant Grade"], unit: "25kg sack", price: 21, moq: 12, key: "food", specs: ["moisture:13%", "broken grain:<5%", "crop:current season"] },
  { category: "Food & Beverage", subcategory: "Coffee & Tea", base: "Mondulkiri Arabica Coffee Beans", variants: ["Medium Roast", "Dark Roast", "Washed Process", "Cafe Blend"], unit: "20kg carton", price: 74, moq: 4, key: "food", specs: ["roast:weekly", "screen size:16+", "cupping score:82"] },
  { category: "Food & Beverage", subcategory: "Seafood & Cold Chain", base: "Kampot Frozen Black Tiger Prawn", variants: ["IQF 16/20", "IQF 21/25", "Hotel Pack", "Retail Tray"], unit: "10kg case", price: 88, moq: 6, key: "food", specs: ["temperature:-18C", "glaze:10%", "origin:coastal farm"] },
  { category: "Agriculture", subcategory: "Fertilizer & Soil", base: "Balanced NPK Fertilizer", variants: ["15-15-15", "16-20-0", "Fruit Farm", "Rice Field"], unit: "50kg bag", price: 29, moq: 20, key: "agri", specs: ["granule:2-4mm", "release:standard", "storage:dry room"] },
  { category: "Agriculture", subcategory: "Irrigation", base: "Drip Irrigation Starter Kit", variants: ["Vegetable Row", "Mango Orchard", "Greenhouse", "Nursery"], unit: "bundle", price: 135, moq: 3, key: "agri", specs: ["pipe:16mm", "coverage:0.5 hectare", "filter:120 mesh"] },
  { category: "Electronics", subcategory: "Lighting", base: "Commercial LED Tube Light", variants: ["18W Daylight", "22W Warehouse", "Flicker-Free", "Energy Saver"], unit: "box of 25", price: 112, moq: 5, key: "electronics", specs: ["voltage:220V", "lifespan:25000h", "warranty:24 months"] },
  { category: "Electronics", subcategory: "Power & Accessories", base: "Surge Protected Power Strip", variants: ["Hotel Room", "Office Desk", "Workshop", "Retail Pack"], unit: "carton of 40", price: 96, moq: 5, key: "electronics", specs: ["cable:3m", "socket:universal", "load:2500W"] },
  { category: "Construction Materials", subcategory: "Steel & Hardware", base: "Deformed Steel Rebar", variants: ["12mm Grade 40", "16mm Grade 60", "Cut-to-Length", "Project Bundle"], unit: "metric ton", price: 612, moq: 2, key: "construction", specs: ["standard:ASTM A615", "length:12m", "mill cert:included"] },
  { category: "Construction Materials", subcategory: "Site Supplies", base: "Fiber Cement Board", variants: ["Ceiling Grade", "Moisture Resistant", "Exterior Wall", "Smooth Finish"], unit: "pallet", price: 245, moq: 3, key: "construction", specs: ["thickness:6mm", "sheet:1220x2440mm", "edge:square"] },
  { category: "Office Supplies", subcategory: "Furniture", base: "Modular Office Workstation", variants: ["Two-Seat", "Four-Seat", "Call Center", "Manager Set"], unit: "set", price: 178, moq: 8, key: "office", specs: ["surface:melamine", "frame:powder coated", "cable tray:included"] },
  { category: "Office Supplies", subcategory: "Stationery", base: "A4 Copy Paper", variants: ["80gsm Bright White", "75gsm Everyday", "School Supply", "Corporate Pack"], unit: "carton", price: 23, moq: 30, key: "office", specs: ["reams:5", "brightness:102 CIE", "sheets:2500"] },
  { category: "Packaging Supplies", subcategory: "Cartons & Mailers", base: "Double Wall Corrugated Carton", variants: ["E-Commerce Medium", "Export Heavy Duty", "Food Delivery", "Printed Outer"], unit: "bundle of 100", price: 64, moq: 10, key: "packaging", specs: ["flute:BC", "burst:200 psi", "recyclable:yes"] },
  { category: "Packaging Supplies", subcategory: "Food Packaging", base: "Sugarcane Bagasse Food Container", variants: ["Two Compartment", "Lunch Box", "Soup Bowl", "Clamshell"], unit: "case of 500", price: 42, moq: 12, key: "packaging", specs: ["material:bagasse", "compostable:90 days", "temperature:120C"] },
];

const adjectives = ["Export-ready", "Factory-packed", "High-turnover", "QC-checked", "Hospitality-grade", "Distributor lot", "Regional resale", "Warehouse-ready"];
const provinces = ["Phnom Penh", "Kandal", "Battambang", "Siem Reap", "Kampong Cham", "Kampot", "Sihanoukville", "Takeo", "Banteay Meanchey", "Pursat"];
const warehouses = ["Phnom Penh Dry Port", "Kandal Distribution Park", "Battambang West Hub", "Siem Reap Ring Road Warehouse", "Kampot Cold Chain Depot", "Sihanoukville Port Zone"];

function pick<T>(items: T[], index: number) {
  return items[index % items.length];
}

function makeSpecs(raw: string[], index: number) {
  return Object.fromEntries(raw.map((item) => item.split(":")).concat([["inspection", `${index % 4 === 0 ? "SGS available" : "supplier QC report"}`], ["batch_code", `MS-${2400 + index}-${(index * 73) % 997}`]]));
}

export function getMockProducts(count = 260): MockProduct[] {
  const suppliers = getMockSuppliers();
  return Array.from({ length: count }, (_, index) => {
    const line = pick(productLines, index);
    const supplier = pick(suppliers.filter((s) => s.businessCategory === line.category).length ? suppliers.filter((s) => s.businessCategory === line.category) : suppliers, index * 3);
    const variant = pick(line.variants, Math.floor(index / productLines.length) + index);
    const adjective = pick(adjectives, index);
    const size = index % 5 === 0 ? "Large Lot" : index % 5 === 1 ? "Monthly Contract" : index % 5 === 2 ? "Fast Dispatch" : index % 5 === 3 ? "Retail-Ready" : "Bulk Supply";
    const title = `${adjective} ${variant} ${line.base} - ${size}`;
    const stock = 180 + ((index * 137) % 9800);
    const price = Number((line.price * (0.92 + (index % 9) * 0.035)).toFixed(2));
    const imageSet = imagePools[line.key];
    const daysOld = 6 + ((index * 11) % 760);
    return {
      id: `prod_${String(index + 1).padStart(4, "0")}`,
      title,
      shortDescription: `${variant} supply lot with verified stock, clear MOQ, and buyer-ready packing for ${line.subcategory.toLowerCase()} procurement.`,
      longDescription: `${title} is prepared for wholesale buyers that need dependable replenishment across Cambodia and nearby SE Asia lanes. The lot includes current batch documentation, practical carton or pallet handling notes, and supplier-confirmed dispatch capacity. Buyers use this listing for restaurants, retail shelves, project sites, resellers, and recurring monthly procurement where consistency matters more than one-off spot pricing.`,
      category: line.category,
      subcategory: line.subcategory,
      images: Array.from({ length: 4 + (index % 3) }, (_, imageIndex) => pick(imageSet, index + imageIndex)),
      wholesalePrice: price,
      retailPrice: Number((price * (1.16 + (index % 4) * 0.035)).toFixed(2)),
      MOQ: line.moq + (index % 6) * Math.max(1, Math.round(line.moq / 4)),
      availableStock: stock,
      soldCount: 90 + ((index * 59) % 4200),
      views: 1200 + ((index * 311) % 28000),
      favouriteCount: 24 + ((index * 17) % 900),
      rating: Number((4.45 + (index % 11) * 0.05).toFixed(1)),
      reviewCount: 28 + ((index * 13) % 680),
      supplierId: supplier.id,
      supplierName: supplier.companyName,
      supplierLogo: supplier.logo,
      verifiedSupplier: supplier.verifiedBadge,
      province: pick(provinces, index + supplier.yearsInBusiness),
      estimatedDelivery: `${2 + (index % 4)}-${4 + (index % 5)} days`,
      warehouseLocation: pick(warehouses, index),
      leadTime: `${index % 3 === 0 ? 24 : 48} hours`,
      tags: [line.category.toLowerCase(), line.subcategory.toLowerCase(), variant.toLowerCase(), "wholesale", "cambodia"],
      specifications: makeSpecs(line.specs, index),
      packagingInformation: `${line.unit}, supplier labelled, stretch-wrapped for truck loading, mixed pallet options available on confirmed RFQ.`,
      createdDate: new Date(Date.now() - daysOld * 86400000).toISOString().slice(0, 10),
    };
  });
}

export function getMockProductById(id: string) {
  return getMockProducts().find((product) => product.id === id) || null;
}
