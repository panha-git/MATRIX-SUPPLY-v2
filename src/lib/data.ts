export const categories = [
  { name: "Electronics", detail: "Devices & accessories", icon: "sparkles" },
  {
    name: "Food & Beverage",
    detail: "Food, drinks & ingredients",
    icon: "cup",
  },
  { name: "Clothing", detail: "Apparel & textiles", icon: "sun" },
  {
    name: "Construction Materials",
    detail: "Tools & building supplies",
    icon: "box",
  },
  { name: "Office Supplies", detail: "Business essentials", icon: "grid" },
  { name: "Agriculture", detail: "Farm inputs & produce", icon: "leaf" },
  { name: "Health & Beauty", detail: "Personal care products", icon: "heart" },
  { name: "Other", detail: "More local supplies", icon: "package" },
] as const;

export const productUnits = [
  "per item",
  "per kg",
  "per box",
  "per pack",
  "per set",
  "per litre",
] as const;
