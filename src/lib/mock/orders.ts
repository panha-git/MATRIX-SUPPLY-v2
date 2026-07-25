export type MockOrder = {
  id: string;
  customerName: string;
  supplierName: string;
  total: number;
  status: "new" | "accepted" | "completed";
  createdAt: string;
};

export function getMockOrders(): MockOrder[] {
  return [
    { id: "ord_001", customerName: "Sokha Lim", supplierName: "Chaiyo Grain Export", total: 1250, status: "accepted", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
    { id: "ord_002", customerName: "Narin Srey", supplierName: "Mekong Roastery", total: 840, status: "new", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
    { id: "ord_003", customerName: "Bunthan Vuth", supplierName: "BrightWave Electrical", total: 3120, status: "completed", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 42).toISOString() },
  ];
}
