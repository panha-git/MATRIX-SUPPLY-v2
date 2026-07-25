"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRODUCT_CATEGORIES = exports.CAMBODIA_PROVINCES = void 0;
exports.normalizeCambodianPhone = normalizeCambodianPhone;
exports.validateCambodianPhone = validateCambodianPhone;
exports.maskNationalId = maskNationalId;
exports.getCambodiaProvinces = getCambodiaProvinces;
exports.CAMBODIA_PROVINCES = [
    "Phnom Penh", "Banteay Meanchey", "Battambang", "Kampong Cham",
    "Kampong Chhnang", "Kampong Speu", "Kampong Thom", "Kampot", "Kandal",
    "Koh Kong", "Kratie", "Mondulkiri", "Oddar Meanchey", "Pailin",
    "Preah Sihanouk", "Preah Vihear", "Pursat", "Ratanakiri", "Siem Reap",
    "Stung Treng", "Svay Rieng", "Takeo", "Tboung Khmum", "Kep",
];
exports.PRODUCT_CATEGORIES = [
    "Food & Beverage", "Agriculture", "Electronics", "Construction Materials",
    "Clothing & Textiles", "Office Supplies", "Home & Living",
    "Beauty & Personal Care", "Auto Parts", "Packaging Supplies",
    "Industrial Supplies", "Other",
];
function normalizeCambodianPhone(phone) {
    const clean = phone.replace(/[\s-]/g, "");
    return clean.startsWith("0") ? `+855${clean.slice(1)}` : clean;
}
function validateCambodianPhone(phone) {
    return /^\+855\d{8,9}$/.test(normalizeCambodianPhone(phone));
}
function maskNationalId(id) {
    const clean = id.trim();
    if (!clean)
        return "";
    const tail = clean.slice(-4);
    return `${"*".repeat(Math.max(5, clean.length - 4))}${tail}`;
}
function getCambodiaProvinces() { return [...exports.CAMBODIA_PROVINCES]; }
