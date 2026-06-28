export const imageUrl = (prompt: string, ratio = "4:3") =>
  `https://app.banani.co/api/flow-image/${encodeURIComponent(`${ratio}\n${prompt}`)}`;

export type Product = {
  id: number;
  name: string;
  supplier: string;
  pack: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  discount?: string;
  category: string;
  stock?: "In stock" | "Low stock";
  image: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Organic Cherry Tomatoes",
    supplier: "GreenFarm KH",
    pack: "500g pack",
    price: 2.5,
    oldPrice: 2.94,
    badge: "Organic",
    discount: "-15%",
    category: "Fresh Produce",
    image: imageUrl("fresh organic cherry tomatoes bright red close-up"),
  },
  {
    id: 2,
    name: "Wild-Caught River Prawns",
    supplier: "Mekong Fresh",
    pack: "1kg",
    price: 8.9,
    badge: "New",
    category: "Meat & Seafood",
    stock: "Low stock",
    image: imageUrl("fresh raw river prawns on ice seafood market"),
  },
  {
    id: 3,
    name: "Kampong Chhnang Jasmine Rice",
    supplier: "Rice Kingdom",
    pack: "5kg bag",
    price: 6.2,
    oldPrice: 6.89,
    badge: "Organic",
    discount: "-10%",
    category: "Dry Goods",
    image: imageUrl("premium white jasmine rice grains close-up"),
  },
  {
    id: 4,
    name: "Single-Origin Robusta Beans",
    supplier: "Cambodian Brew Co.",
    pack: "250g",
    price: 7.5,
    badge: "New",
    category: "Beverages",
    image: imageUrl("roasted coffee beans close-up dark brown aromatic"),
  },
  {
    id: 5,
    name: "Free-Range Eggs",
    supplier: "Happy Hen Farm",
    pack: "10 pieces",
    price: 3.2,
    badge: "Free-range",
    category: "Dairy & Eggs",
    image: imageUrl("fresh farm eggs in a rustic basket light brown"),
  },
  {
    id: 6,
    name: "Pad Thai Noodles Set",
    supplier: "AsiaKitchen",
    pack: "400g pack",
    price: 4.1,
    oldPrice: 5.12,
    badge: "Halal",
    discount: "-20%",
    category: "Dry Goods",
    image: imageUrl("dried rice noodles pad thai ingredients flat lay"),
  },
  {
    id: 7,
    name: "Fresh Baby Spinach",
    supplier: "GreenFarm KH",
    pack: "200g bag",
    price: 1.8,
    badge: "Organic",
    category: "Fresh Produce",
    image: imageUrl("fresh baby spinach leaves green vibrant organic"),
  },
  {
    id: 8,
    name: "Fish Sauce Premium",
    supplier: "Kampot Gold",
    pack: "700ml bottle",
    price: 3.6,
    oldPrice: 3.79,
    discount: "-5%",
    category: "Condiments",
    image: imageUrl("premium fish sauce bottle amber golden liquid"),
  },
  {
    id: 9,
    name: "Fresh Dragon Fruit",
    supplier: "Mekong Farms",
    pack: "1kg",
    price: 3.9,
    badge: "Organic",
    category: "Fresh Produce",
    image: imageUrl("fresh dragon fruit sliced vibrant tropical fruit"),
  },
  {
    id: 10,
    name: "Whole Milk UHT",
    supplier: "Angkor Dairy",
    pack: "1L carton",
    price: 2.2,
    badge: "Halal",
    category: "Dairy & Eggs",
    image: imageUrl("minimal white whole milk carton on white background"),
  },
  {
    id: 11,
    name: "Frozen Chicken Breast",
    supplier: "Mekong Fresh",
    pack: "1kg",
    price: 5.5,
    oldPrice: 6.25,
    discount: "-12%",
    badge: "Halal",
    category: "Frozen Foods",
    image: imageUrl("frozen chicken breast vacuum sealed package"),
  },
  {
    id: 12,
    name: "Kampot Black Pepper",
    supplier: "Kampot Gold",
    pack: "100g",
    price: 4.8,
    badge: "Organic",
    category: "Condiments",
    stock: "Low stock",
    image: imageUrl("Kampot black peppercorns in wooden spoon rustic"),
  },
];

export const categories = [
  { name: "Fresh Produce", detail: "Vegetables & fruits", icon: "leaf" },
  { name: "Meat & Seafood", detail: "Fresh & frozen", icon: "package" },
  { name: "Dairy & Eggs", detail: "Milk, cheese & eggs", icon: "sun" },
  { name: "Beverages", detail: "Coffee, tea & juices", icon: "cup" },
  { name: "Dry Goods", detail: "Rice, flour & pasta", icon: "grid" },
  { name: "Condiments", detail: "Sauces & spices", icon: "sparkles" },
  { name: "Frozen Foods", detail: "Ready meals", icon: "snowflake" },
  { name: "Packaging", detail: "Supplies & bags", icon: "box" },
] as const;

export const suppliers = [
  { name: "GreenFarm Cambodia", type: "Local Farm", location: "Siem Reap", rating: 4.8, reviews: 234, tags: ["Fresh Produce", "Organic"] },
  { name: "Mekong Fresh Co.", type: "Wholesale Importer", location: "Phnom Penh", rating: 4.6, reviews: 178, tags: ["Meat & Seafood", "Frozen"] },
  { name: "Cambodian Brew Co.", type: "Beverage Supplier", location: "Battambang", rating: 4.9, reviews: 312, tags: ["Coffee", "Tea", "Beverages"] },
  { name: "Rice Kingdom KH", type: "Local Farm", location: "Kampong Chhnang", rating: 4.7, reviews: 145, tags: ["Dry Goods", "Rice", "Organic"] },
  { name: "Kampot Gold Spices", type: "Local Farm", location: "Kampot", rating: 4.9, reviews: 289, tags: ["Condiments", "Spices"] },
  { name: "AsiaKitchen Imports", type: "Wholesale Importer", location: "Phnom Penh", rating: 4.4, reviews: 97, tags: ["Noodles", "Halal"] },
  { name: "Happy Hen Farm", type: "Local Farm", location: "Kandal", rating: 4.7, reviews: 203, tags: ["Dairy & Eggs", "Free-range"] },
  { name: "Angkor Dairy Co.", type: "Beverage Supplier", location: "Phnom Penh", rating: 4.5, reviews: 118, tags: ["Dairy", "Beverages"] },
  { name: "Mekong Farms", type: "Local Farm", location: "Prey Veng", rating: 4.6, reviews: 156, tags: ["Fresh Produce", "Tropical Fruits"] },
];

export const orders = [
  { id: "ORD-20250601-0041", items: 6, date: "Jun 1, 2025", status: "Delivered", total: 34.2, delivery: "Jun 3, 2025" },
  { id: "ORD-20250528-0038", items: 3, date: "May 28, 2025", status: "Shipped", total: 18.5, delivery: "May 30, 2025" },
  { id: "ORD-20250522-0031", items: 8, date: "May 22, 2025", status: "Delivered", total: 52.8, delivery: "May 24, 2025" },
  { id: "ORD-20250515-0027", items: 4, date: "May 15, 2025", status: "Delivered", total: 21.4, delivery: "May 17, 2025" },
  { id: "ORD-20250610-0045", items: 5, date: "Jun 10, 2025", status: "Confirmed", total: 29.7, delivery: "Jun 12, 2025" },
  { id: "ORD-20250612-0047", items: 2, date: "Jun 12, 2025", status: "Pending", total: 11.6, delivery: "Jun 14, 2025" },
];
