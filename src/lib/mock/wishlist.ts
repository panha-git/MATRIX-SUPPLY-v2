export type MockWishlistEntry = {
  id: string;
  productId: string;
  title: string;
  supplierName: string;
  price: number;
  createdAt: string;
};

export function getMockWishlist(): MockWishlistEntry[] {
  return [
    { id: "wish_001", productId: "prod_001", title: "Premium Thai Jasmine Rice 50kg", supplierName: "Chaiyo Grain Export", price: 32.5, createdAt: new Date().toISOString() },
    { id: "wish_002", productId: "prod_002", title: "Industrial Coffee Beans 25kg", supplierName: "Mekong Roastery", price: 68, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  ];
}
