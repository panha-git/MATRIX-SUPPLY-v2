export type MockNotification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "order" | "chat" | "product" | "system" | "report" | "account";
  read: boolean;
  createdAt: string;
  link?: string;
};

export function getMockNotifications(userId: string): MockNotification[] {
  const templates = [
    {
      title: "New RFQ from a hotel buyer",
      message: "A buyer in Phnom Penh requested a quote for 180 units of your premium rice lot.",
      type: "order" as const,
      read: false,
      link: "/orders",
    },
    {
      title: "Supplier profile viewed 24 times today",
      message: "Your warehouse and product page continue to attract steady traffic from regional buyers.",
      type: "product" as const,
      read: false,
      link: "/dashboard",
    },
    {
      title: "Chat response rate remains strong",
      message: "Your average response time is under 45 minutes for the last 24 hours.",
      type: "chat" as const,
      read: true,
      link: "/chat",
    },
    {
      title: "Warehouse stock refreshed",
      message: "Your latest inventory update was synced with the regional hub and added to the buyer feed.",
      type: "system" as const,
      read: false,
      link: "/dashboard",
    },
    {
      title: "Verified buyer request received",
      message: "A high-trust buyer requested a revised quote for a recurring replenishment order.",
      type: "account" as const,
      read: true,
      link: "/account",
    },
  ];

  return Array.from({ length: 20 }, (_, index) => {
    const template = templates[index % templates.length];
    return {
      id: `notif_${String(index + 1).padStart(3, "0")}`,
      userId,
      title: `${template.title} ${index + 1}`,
      message: `${template.message} ${index % 2 === 0 ? "Buyer activity is climbing." : "The marketplace is moving quickly."}`,
      type: template.type,
      read: index % 4 === 0,
      createdAt: new Date(Date.now() - index * 1000 * 60 * 18).toISOString(),
      link: template.link,
    };
  });
}
