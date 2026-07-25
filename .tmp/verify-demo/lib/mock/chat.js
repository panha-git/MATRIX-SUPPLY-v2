"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMockChatRooms = getMockChatRooms;
exports.getMockMessages = getMockMessages;
function getMockChatRooms() {
    const rooms = [
        {
            id: "chat_001",
            customerId: "cust_001",
            customerName: "Sokha Lim",
            supplierId: "supp_001",
            supplierName: "Chaiyo Grain Export",
            productId: "prod_001",
            productTitle: "Premium Thai Jasmine Rice 50kg",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            id: "chat_002",
            customerId: "cust_002",
            customerName: "Narin Srey",
            supplierId: "supp_002",
            supplierName: "Mekong Roastery",
            productId: "prod_002",
            productTitle: "Industrial Coffee Beans 25kg",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        },
        {
            id: "chat_003",
            customerId: "cust_003",
            customerName: "Bunthan Vuth",
            supplierId: "supp_003",
            supplierName: "BrightWave Electrical",
            productId: "prod_003",
            productTitle: "LED Tube Lighting 18W Bulk Pack",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        },
    ];
    return Array.from({ length: 10 }, (_, index) => {
        const template = rooms[index % rooms.length];
        return {
            ...template,
            id: `chat_${String(index + 1).padStart(3, "0")}`,
            customerId: `cust_${String(index + 1).padStart(3, "0")}`,
            customerName: `${template.customerName} ${index + 1}`,
            supplierId: `supp_${String((index % 6) + 1).padStart(3, "0")}`,
            supplierName: `Supplier ${String((index % 6) + 1).padStart(2, "0")}`,
            productId: `prod_${String((index % 10) + 1).padStart(3, "0")}`,
            productTitle: `${template.productTitle} ${index + 1}`,
            createdAt: new Date(Date.now() - index * 1000 * 60 * 45).toISOString(),
            updatedAt: new Date(Date.now() - index * 1000 * 60 * 20).toISOString(),
        };
    });
}
function getMockMessages() {
    return [
        {
            id: "msg_001",
            chatRoomId: "chat_001",
            senderId: "cust_001",
            senderName: "Sokha Lim",
            senderRole: "customer",
            receiverId: "supp_001",
            message: "We are finalizing a bulk order for our hotel kitchen. Could you confirm the current lot and pallet count?",
            read: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
        },
        {
            id: "msg_002",
            chatRoomId: "chat_001",
            senderId: "supp_001",
            senderName: "Chaiyo Grain Export",
            senderRole: "supplier",
            receiverId: "cust_001",
            message: "Yes, we have 14 pallets available and can arrange dispatch tomorrow afternoon.",
            read: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        },
    ];
}
