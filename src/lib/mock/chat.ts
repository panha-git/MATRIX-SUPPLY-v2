import { getMockProducts } from "./products";

export type MockChatRoom = {
  id: string;
  customerId: string;
  customerName: string;
  supplierId: string;
  supplierName: string;
  productId?: string;
  productTitle?: string;
  createdAt: string;
  updatedAt: string;
};

export type MockMessage = {
  id: string;
  chatRoomId: string;
  senderId: string;
  senderName: string;
  senderRole: "customer" | "supplier";
  receiverId: string;
  message: string;
  read: boolean;
  createdAt: string;
};

const customers = ["Sokha Lim", "Narin Srey", "Bunthan Vuth", "Mey Sreypov", "Chan Dara", "Thida Mao", "Rotha San", "Kosal Men", "Pisey Long", "Vicheka Orn"];

export function getMockChatRooms(): MockChatRoom[] {
  const products = getMockProducts(40);
  return products.slice(0, 14).map((product, index) => ({
    id: `chat_${String(index + 1).padStart(3, "0")}`,
    customerId: `cust_${String(index + 1).padStart(3, "0")}`,
    customerName: customers[index % customers.length],
    supplierId: product.supplierId,
    supplierName: product.supplierName,
    productId: product.id,
    productTitle: product.title,
    createdAt: new Date(Date.now() - (index + 2) * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - (index + 1) * 1200000).toISOString(),
  }));
}

export function getMockMessages(): MockMessage[] {
  return getMockChatRooms().flatMap((room, index) => [
    {
      id: `msg_${room.id}_001`,
      chatRoomId: room.id,
      senderId: room.customerId,
      senderName: room.customerName,
      senderRole: "customer" as const,
      receiverId: room.supplierId,
      message: `We are comparing suppliers for ${room.productTitle}. Confirm MOQ, current stock, and whether delivery can reach our receiving team this week.`,
      read: true,
      createdAt: new Date(Date.now() - (index + 3) * 3600000).toISOString(),
    },
    {
      id: `msg_${room.id}_002`,
      chatRoomId: room.id,
      senderId: room.supplierId,
      senderName: room.supplierName,
      senderRole: "supplier" as const,
      receiverId: room.customerId,
      message: "Stock is available now. We can reserve the lot for 24 hours and send carton photos, packing details, and a stamped quotation before dispatch.",
      read: true,
      createdAt: new Date(Date.now() - (index + 2) * 2700000).toISOString(),
    },
    {
      id: `msg_${room.id}_003`,
      chatRoomId: room.id,
      senderId: room.customerId,
      senderName: room.customerName,
      senderRole: "customer" as const,
      receiverId: room.supplierId,
      message: "Please include the lead time, unloading contact, and any discount for a recurring monthly order.",
      read: index % 3 !== 0,
      createdAt: new Date(Date.now() - (index + 1) * 1800000).toISOString(),
    },
  ]);
}
