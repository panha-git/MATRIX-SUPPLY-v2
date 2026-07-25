import { getMockProducts } from "./products";

export type MockOrder = {
  id: string;
  requestType: "order" | "quote";
  customerId: string;
  customerName: string;
  customerGmail: string;
  customerPhone: string;
  phoneOrTelegram: string;
  supplierId: string;
  supplierName: string;
  items: { productId: string; supplierId: string; supplierName: string; title: string; price: number; unit: string; quantity: number; imageUrl: string }[];
  totalAmount: number;
  deliveryProvince: string;
  deliveryAddressDetails: string;
  deliveryLocation: string;
  note: string;
  notes: string;
  status: "new" | "accepted" | "rejected" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
};

const customers = ["Sokha Lim", "Narin Srey", "Bunthan Vuth", "Mey Sreypov", "Chan Dara", "Thida Mao", "Rotha San", "Kosal Men"];
const provinces = ["Phnom Penh", "Siem Reap", "Battambang", "Kampot", "Kandal", "Sihanoukville"];
const statuses: MockOrder["status"][] = ["new", "accepted", "completed", "accepted", "new", "completed", "cancelled"];

export function getMockOrders(count = 34): MockOrder[] {
  const products = getMockProducts(80);
  return Array.from({ length: count }, (_, index) => {
    const product = products[index % products.length];
    const quantity = 2 + (index % 9);
    const item = { productId: product.id, supplierId: product.supplierId, supplierName: product.supplierName, title: product.title, price: product.wholesalePrice, unit: product.packagingInformation.split(",")[0], quantity, imageUrl: product.images[0] };
    const note = index % 2 === 0 ? "Confirm dispatch slot and send warehouse contact before loading." : "Quote for recurring monthly replenishment with standard truck delivery.";
    return {
      id: `ord_${String(index + 1).padStart(4, "0")}`,
      requestType: index % 3 === 0 ? "quote" : "order",
      customerId: `cust_${String((index % customers.length) + 1).padStart(3, "0")}`,
      customerName: customers[index % customers.length],
      customerGmail: `${customers[index % customers.length].toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
      customerPhone: `+8551${String(2000000 + index * 9137).slice(0, 7)}`,
      phoneOrTelegram: `@${customers[index % customers.length].toLowerCase().replace(/\s+/g, "")}`,
      supplierId: product.supplierId,
      supplierName: product.supplierName,
      items: [item],
      totalAmount: Number((item.price * item.quantity).toFixed(2)),
      deliveryProvince: provinces[index % provinces.length],
      deliveryAddressDetails: `${provinces[index % provinces.length]} receiving warehouse, gate ${index % 5 + 1}`,
      deliveryLocation: `${provinces[index % provinces.length]} receiving warehouse`,
      note,
      notes: note,
      status: statuses[index % statuses.length],
      createdAt: new Date(Date.now() - (index + 1) * 7200000).toISOString(),
      updatedAt: new Date(Date.now() - index * 3600000).toISOString(),
    };
  });
}
