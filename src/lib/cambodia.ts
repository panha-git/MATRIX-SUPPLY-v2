export const CAMBODIA_PROVINCES = [
  "Phnom Penh", "Banteay Meanchey", "Battambang", "Kampong Cham",
  "Kampong Chhnang", "Kampong Speu", "Kampong Thom", "Kampot", "Kandal",
  "Koh Kong", "Kratie", "Mondulkiri", "Oddar Meanchey", "Pailin",
  "Preah Sihanouk", "Preah Vihear", "Pursat", "Ratanakiri", "Siem Reap",
  "Stung Treng", "Svay Rieng", "Takeo", "Tboung Khmum", "Kep",
] as const;

export const PRODUCT_CATEGORIES = [
  "Food & Beverage", "Agriculture", "Electronics", "Construction Materials",
  "Clothing & Textiles", "Office Supplies", "Home & Living",
  "Beauty & Personal Care", "Auto Parts", "Packaging Supplies",
  "Industrial Supplies", "Other",
] as const;

export function normalizeCambodianPhone(phone: string) {
  const clean = phone.replace(/[\s-]/g, "");
  return clean.startsWith("0") ? `+855${clean.slice(1)}` : clean;
}

export function validateCambodianPhone(phone: string) {
  return /^\+855\d{8,9}$/.test(normalizeCambodianPhone(phone));
}

export function maskNationalId(id: string) {
  const clean = id.trim();
  if (!clean) return "";
  const tail = clean.slice(-4);
  return `${"*".repeat(Math.max(5, clean.length - 4))}${tail}`;
}

export function getCambodiaProvinces() { return [...CAMBODIA_PROVINCES]; }
