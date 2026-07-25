import { PRODUCT_CATEGORIES, maskNationalId, normalizeCambodianPhone, validateCambodianPhone } from "./cambodia";
import { makeId, PLATFORM_CHANGED_EVENT, readLocal, resetLocalAppStorage, writeLocal } from "./localAppStorage";
import { getMockProducts } from "./mock/products";
import { getMockSuppliers } from "./mock/suppliers";
import { getMockReviews } from "./mock/reviews";
import { getMockNotifications } from "./mock/notifications";
import { getMockChatRooms, getMockMessages } from "./mock/chat";
import { getMockOrders } from "./mock/orders";
import { mockSearchSuggestions } from "./mock/search";
import { getMockWishlist } from "./mock/wishlist";
import { mockBanners } from "./mock/banners";

export { PLATFORM_CHANGED_EVENT } from "./localAppStorage";

export type UserRole = "customer" | "supplier" | "admin";
export type VerificationStatus = "verified_account" | "incomplete";
export type AccountStatus = "active" | "suspended";

type BaseAccount = {
  id: string;
  gmail: string;
  role: UserRole;
  fullName: string;
  phoneNumber: string;
  phoneOrTelegram?: string;
  normalizedPhoneNumber: string;
  phoneVerified: boolean;
  maskedNationalId: string;
  province: string;
  district?: string;
  commune?: string;
  addressDetails?: string;
  profileImageUrl?: string;
  verificationStatus: VerificationStatus;
  status: AccountStatus;
  trustScore: number;
  createdAt: string;
  updatedAt: string;
  gender?: string;
};

export type CustomerAccount = BaseAccount & { role: "customer" };
export type SupplierAccount = BaseAccount & {
  role: "supplier";
  businessName: string;
  businessCategory: string;
  businessDescription: string;
  businessLogoUrl?: string;
  businessProvince: string;
  businessDistrict?: string;
  businessCommune?: string;
  businessAddressDetails: string;
  location: string;
  description: string;
  phoneOrTelegram: string;
};
export type AdminAccount = BaseAccount & { role: "admin" };
export type LocalAccount = CustomerAccount | SupplierAccount | AdminAccount;
export type RegistrationProfile = Partial<LocalAccount> & { role: "customer" | "supplier"; nationalId?: string };

export type ProductStatus = "active" | "inactive" | "removed";
export type Product = {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierGmail: string;
  supplierPhoneMasked?: string;
  title: string;
  description: string;
  category: string;
  unit: string;
  price: number;
  stockQuantity: number;
  province: string;
  locationDetails: string;
  location: string;
  imageUrl: string;
  status: ProductStatus;
  reportCount: number;
  createdAt: string;
  updatedAt: string;
};
export type ProductInput = Pick<Product, "title" | "description" | "category" | "unit" | "price" | "stockQuantity" | "imageUrl"> & Partial<Pick<Product, "province" | "locationDetails" | "location" | "status">>;
export type CartItem = { productId: string; supplierId: string; supplierName: string; title: string; price: number; unit: string; quantity: number; imageUrl: string };
export type CustomerCart = { customerId: string; items: CartItem[] };
export type OrderStatus = "new" | "accepted" | "rejected" | "completed" | "cancelled";
export type OrderRequest = { id: string; requestType: "order" | "quote"; customerId: string; customerName: string; customerGmail: string; customerPhone: string; phoneOrTelegram: string; supplierId: string; supplierName: string; items: CartItem[]; totalAmount: number; deliveryProvince: string; deliveryAddressDetails: string; deliveryLocation: string; note: string; notes: string; status: OrderStatus; createdAt: string; updatedAt: string };
export type Notification = { id: string; userId: string; title: string; message: string; type: "order" | "chat" | "product" | "system" | "report" | "account"; read: boolean; createdAt: string; link?: string };
export type ChatRoom = { id: string; customerId: string; customerName: string; supplierId: string; supplierName: string; productId?: string; productTitle?: string; orderId?: string; createdAt: string; updatedAt: string };
export type Message = { id: string; chatRoomId: string; senderId: string; senderName: string; senderRole: UserRole; receiverId: string; message: string; read: boolean; createdAt: string };
export type Report = { id: string; reporterId: string; reporterName: string; targetType: "product" | "supplier" | "message" | "user"; targetId: string; reason: string; description?: string; status: "new" | "reviewed" | "resolved"; createdAt: string; updatedAt: string };

const SESSION = "matrix-supply-cambodia:session";
const now = () => new Date().toISOString();
const notifyChange = () => typeof window !== "undefined" && window.dispatchEvent(new Event(PLATFORM_CHANGED_EVENT));

export const AUTH_CHANGED_EVENT = PLATFORM_CHANGED_EVENT;
export const PRODUCTS_CHANGED_EVENT = PLATFORM_CHANGED_EVENT;
export const CARTS_CHANGED_EVENT = PLATFORM_CHANGED_EVENT;
export const ORDERS_CHANGED_EVENT = PLATFORM_CHANGED_EVENT;
export const NOTIFICATIONS_CHANGED_EVENT = PLATFORM_CHANGED_EVENT;
export const DEMO_CHANGED_EVENT = PLATFORM_CHANGED_EVENT;

export const normalizeGmail = (v: string) => v.trim().toLowerCase();
export const isValidGmail = (v: string) => /^[^\s@]+@gmail\.com$/i.test(normalizeGmail(v));

export const getUsers = () => readLocal<LocalAccount[]>("users", []);
export const getSuppliers = () => getUsers().filter((u): u is SupplierAccount => u.role === "supplier");
export const getAccountByGmail = (g: string) => getUsers().find((u) => u.gmail === normalizeGmail(g)) || null;
export const getCurrentUser = () => (typeof window === "undefined" ? null : getUsers().find((u) => u.id === sessionStorage.getItem(SESSION)) || null);

export function saveUser<T extends LocalAccount>(user: T) {
  writeLocal("users", [...getUsers().filter((u) => u.id !== user.id), user]);
  return user;
}

export function loginOrCreateUser(gmail: string, profile?: RegistrationProfile) {
  const email = normalizeGmail(gmail);
  if (!isValidGmail(email)) throw Error("Enter a valid Gmail address.");
  let user = getAccountByGmail(email);
  if (!user && email === "admin@gmail.com") user = adminAccount();
  if (!user && profile) user = createAccount(email, profile);
  if (!user) {
    if (email.endsWith("@gmail.com")) {
      user = createAccount(email, {
        role: "customer",
        fullName: email.split("@")[0],
        phoneNumber: "+85510555666",
        phoneVerified: true,
        nationalId: "199001234567",
        province: "Phnom Penh",
      });
    }
  }
  if (!user) throw Error("No account found. Complete secure registration first.");
  if (user.status === "suspended") throw Error("This account is suspended. Contact marketplace support.");
  sessionStorage.setItem(SESSION, user.id);
  notifyChange();
  return user;
}

function createAccount(gmail: string, p: RegistrationProfile): LocalAccount {
  if (!p.phoneNumber || !validateCambodianPhone(p.phoneNumber) || !p.phoneVerified) throw Error("Complete Cambodian phone verification.");
  if (!p.nationalId) throw Error("National ID information is required.");
  if (!p.fullName || !p.province) throw Error("Complete all required registration fields.");
  const t = now();
  const base = {
    id: makeId("user"),
    gmail,
    fullName: p.fullName,
    phoneNumber: p.phoneNumber,
    normalizedPhoneNumber: normalizeCambodianPhone(p.phoneNumber),
    phoneVerified: true,
    maskedNationalId: maskNationalId(p.nationalId),
    province: p.province,
    verificationStatus: "verified_account" as const,
    status: "active" as const,
    trustScore: 90,
    createdAt: t,
    updatedAt: t,
    gender: p.gender,
    district: p.district,
    commune: p.commune,
    addressDetails: p.addressDetails,
    profileImageUrl: p.profileImageUrl,
  };
  let user: LocalAccount;
  if (p.role === "supplier") {
    if (!p.businessName || !p.businessCategory || !p.businessDescription || !p.businessAddressDetails) throw Error("Complete all required business fields.");
    user = {
      ...base,
      role: "supplier",
      businessName: p.businessName,
      businessCategory: p.businessCategory,
      businessDescription: p.businessDescription,
      businessLogoUrl: p.businessLogoUrl,
      businessProvince: p.province,
      businessDistrict: p.district,
      businessCommune: p.commune,
      businessAddressDetails: p.businessAddressDetails,
      location: p.province,
      description: p.businessDescription,
      phoneOrTelegram: p.phoneNumber,
    };
  } else {
    user = { ...base, role: "customer" };
  }
  saveUser(user);
  addNotification(user.id, "Verified Account ready", "Your secure registration is complete.", "account", "/account");
  return user;
}

export function logout() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(SESSION);
    notifyChange();
  }
}

export const getProducts = () => readLocal<Product[]>("products", []);
export const getApprovedProducts = () => getProducts().filter((p) => p.status === "active");
export const getActiveProducts = getApprovedProducts;
export const getProductById = (id: string) => {
  const products = getProducts();
  return products.find((p) => p.id === id) || (id === "product_1" ? products[0] || null : null);
};
export const getProductsBySupplier = (id: string) => getProducts().filter((p) => p.supplierId === id);

export function createProduct(s: SupplierAccount, input: ProductInput) {
  if (s.verificationStatus !== "verified_account") throw Error("Complete verified account setup first.");
  const t = now();
  const p: Product = {
    ...input,
    id: makeId("product"),
    supplierId: s.id,
    supplierName: s.businessName,
    supplierGmail: s.gmail,
    province: input.province || s.businessProvince,
    locationDetails: input.locationDetails || s.businessAddressDetails,
    location: input.province || input.location || s.businessProvince,
    status: input.status || "active",
    reportCount: 0,
    createdAt: t,
    updatedAt: t,
  };
  writeLocal("products", [p, ...getProducts()]);
  return p;
}

export function updateProduct(id: string, supplierId: string, input: ProductInput) {
  const all = getProducts();
  const old = all.find((p) => p.id === id && p.supplierId === supplierId);
  if (!old) return null;
  const p = { ...old, ...input, location: input.province || input.location || old.location, updatedAt: now() };
  writeLocal("products", all.map((x) => (x.id === id ? p : x)));
  return p;
}

export function deleteProduct(id: string, sid: string) {
  const p = getProducts().find((x) => x.id === id && x.supplierId === sid);
  if (!p) return false;
  writeLocal("products", getProducts().filter((x) => x.id !== id));
  return true;
}

export function setProductApproval(id: string, status: ProductStatus) {
  const all = getProducts();
  const p = all.find((x) => x.id === id);
  if (!p) return null;
  const next = { ...p, status, updatedAt: now() };
  writeLocal("products", all.map((x) => (x.id === id ? next : x)));
  if (status === "removed") addNotification(p.supplierId, "Product removed", `${p.title} was removed by marketplace safety.`, "product", "/dashboard");
  return next;
}

export function updateSupplierProfile(id: string, input: Partial<SupplierAccount>) {
  const u = getUsers().find((x) => x.id === id && x.role === "supplier") as SupplierAccount | undefined;
  return u ? saveUser({ ...u, ...input, updatedAt: now() }) : null;
}

export function updateCustomerProfile(id: string, input: Partial<CustomerAccount>) {
  const u = getUsers().find((x) => x.id === id && x.role === "customer") as CustomerAccount | undefined;
  return u ? saveUser({ ...u, ...input, updatedAt: now() }) : null;
}

const getCarts = () => readLocal<CustomerCart[]>("carts", []);
export const getCart = (id: string) => getCarts().find((c) => c.customerId === id) || { customerId: id, items: [] };

function saveCart(c: CustomerCart) {
  writeLocal("carts", [...getCarts().filter((x) => x.customerId !== c.customerId), c]);
}

export function addToCart(id: string, p: Product) {
  const c = getCart(id);
  const old = c.items.find((x) => x.productId === p.id);
  saveCart({
    ...c,
    items: old
      ? c.items.map((x) => (x.productId === p.id ? { ...x, quantity: Math.min(p.stockQuantity, x.quantity + 1) } : x))
      : [...c.items, { productId: p.id, supplierId: p.supplierId, supplierName: p.supplierName, title: p.title, price: p.price, unit: p.unit, quantity: 1, imageUrl: p.imageUrl }],
  });
}

export function setCartItemQuantity(id: string, pid: string, q: number) {
  const c = getCart(id);
  saveCart({ ...c, items: q < 1 ? c.items.filter((x) => x.productId !== pid) : c.items.map((x) => (x.productId === pid ? { ...x, quantity: q } : x)) });
}

export function removeCartItem(id: string, pid: string) {
  setCartItemQuantity(id, pid, 0);
}

export function clearCart(id: string) {
  saveCart({ customerId: id, items: [] });
}

export function getCartSummary() {
  return { customerCarts: getCarts().length, itemQuantity: getCarts().reduce((n, c) => n + c.items.reduce((s, i) => s + i.quantity, 0), 0) };
}

export const getOrderRequests = () => readLocal<OrderRequest[]>("orders", []);

export function createOrderRequest(input: { customer: CustomerAccount; deliveryLocation?: string; deliveryProvince?: string; deliveryAddressDetails?: string; notes?: string; note?: string; items: CartItem[]; requestType: "order" | "quote" }) {
  if (!input.items.length) throw Error("Add at least one product.");
  const province = input.deliveryProvince || input.deliveryLocation || "";
  const address = input.deliveryAddressDetails || input.deliveryLocation || "";
  if (!province || !address) throw Error("Enter delivery province and address details.");
  const created: OrderRequest[] = [];
  const supplierGroups = new Map<string, CartItem[]>();
  input.items.forEach((item) => {
    const existing = supplierGroups.get(item.supplierId) || [];
    existing.push(item);
    supplierGroups.set(item.supplierId, existing);
  });
  supplierGroups.forEach((group) => {
    const t = now();
    const o: OrderRequest = {
      id: makeId("order"),
      requestType: input.requestType,
      customerId: input.customer.id,
      customerName: input.customer.fullName,
      customerGmail: input.customer.gmail,
      customerPhone: input.customer.phoneNumber,
      phoneOrTelegram: input.customer.phoneNumber,
      supplierId: group[0].supplierId,
      supplierName: group[0].supplierName,
      items: group,
      totalAmount: group.reduce((s, i) => s + i.price * i.quantity, 0),
      deliveryProvince: province,
      deliveryAddressDetails: address,
      deliveryLocation: address,
      note: input.note || input.notes || "",
      notes: input.note || input.notes || "",
      status: "new",
      createdAt: t,
      updatedAt: t,
    };
    created.push(o);
    addNotification(o.supplierId, "New order request", `${o.customerName} submitted an order request.`, "order", "/orders");
  });
  writeLocal("orders", [...created, ...getOrderRequests()]);
  if (input.requestType === "order") clearCart(input.customer.id);
  return created[0];
}

export function setOrderStatus(id: string, status: OrderStatus) {
  const all = getOrderRequests();
  const o = all.find((x) => x.id === id);
  if (!o) return null;
  const n = { ...o, status, updatedAt: now() };
  writeLocal("orders", all.map((x) => (x.id === id ? n : x)));
  addNotification(o.customerId, `Order ${status}`, `${o.supplierName} marked your order request as ${status}.`, "order", "/orders");
  return n;
}

export const getNotifications = (uid?: string) => readLocal<Notification[]>("notifications", []).filter((n) => !uid || n.userId === uid);

export function addNotification(userId: string, title: string, message: string, type: Notification["type"], link?: string) {
  const n = { id: makeId("notification"), userId, title, message, type, read: false, createdAt: now(), link };
  writeLocal("notifications", [n, ...readLocal<Notification[]>("notifications", [])]);
  return n;
}

export function markNotificationRead(id: string) {
  writeLocal("notifications", readLocal<Notification[]>("notifications", []).map((n) => (n.id === id ? { ...n, read: true } : n)));
}

export const getChatRooms = () => readLocal<ChatRoom[]>("chats", []);
export const getMessages = () => readLocal<Message[]>("messages", []);

export function startChat(customer: CustomerAccount, p: Product) {
  let room = getChatRooms().find((r) => r.customerId === customer.id && r.supplierId === p.supplierId && r.productId === p.id);
  if (room) return room;
  const t = now();
  room = { id: makeId("chat"), customerId: customer.id, customerName: customer.fullName, supplierId: p.supplierId, supplierName: p.supplierName, productId: p.id, productTitle: p.title, createdAt: t, updatedAt: t };
  writeLocal("chats", [room, ...getChatRooms()]);
  return room;
}

export function sendMessage(room: ChatRoom, sender: LocalAccount, message: string) {
  const text = message.trim();
  if (!text) throw Error("Enter a message.");
  const receiverId = sender.id === room.customerId ? room.supplierId : room.customerId;
  const m: Message = { id: makeId("message"), chatRoomId: room.id, senderId: sender.id, senderName: sender.role === "supplier" ? sender.businessName : sender.fullName, senderRole: sender.role, receiverId, message: text, read: false, createdAt: now() };
  writeLocal("messages", [...getMessages(), m]);
  addNotification(receiverId, "New chat message", `${m.senderName}: ${text.slice(0, 60)}`, "chat", `/chat?room=${room.id}`);
  return m;
}

export const getReports = () => readLocal<Report[]>("reports", []);

export function createReport(input: Omit<Report, "id" | "status" | "createdAt" | "updatedAt">) {
  const t = now();
  const r: Report = { ...input, id: makeId("report"), status: "new", createdAt: t, updatedAt: t };
  writeLocal("reports", [r, ...getReports()]);
  if (input.targetType === "product") writeLocal("products", getProducts().map((p) => (p.id === input.targetId ? { ...p, reportCount: p.reportCount + 1 } : p)));
  const admin = getUsers().find((u) => u.role === "admin");
  if (admin) addNotification(admin.id, "New safety report", `${input.reporterName} reported a ${input.targetType}.`, "report", "/admin");
  return r;
}

export function setReportStatus(id: string, status: Report["status"]) {
  writeLocal("reports", getReports().map((r) => (r.id === id ? { ...r, status, updatedAt: now() } : r)));
}

export function setUserStatus(id: string, status: AccountStatus) {
  const u = getUsers().find((x) => x.id === id);
  if (!u) return null;
  const n = saveUser({ ...u, status, updatedAt: now() } as LocalAccount);
  addNotification(id, status === "suspended" ? "Account suspended" : "Account restored", status === "suspended" ? "Marketplace access has been suspended for safety review." : "Your marketplace access has been restored.", "account", "/account");
  return n;
}

function adminAccount(): AdminAccount {
  const t = now();
  return saveUser({
    id: "admin",
    role: "admin",
    fullName: "MATRIX SUPPLY Cambodia Admin",
    gmail: "admin@gmail.com",
    phoneNumber: "",
    normalizedPhoneNumber: "",
    phoneVerified: true,
    maskedNationalId: "",
    province: "Phnom Penh",
    verificationStatus: "verified_account",
    status: "active",
    trustScore: 100,
    createdAt: t,
    updatedAt: t,
  });
}

export function seedDemoData() {
  resetLocalAppStorage();
  const t = now();
  const admin = adminAccount();

  const suppliers = getMockSuppliers().map((supplier, index) =>
    saveUser({
      id: supplier.id,
      role: "supplier",
      fullName: supplier.companyName,
      gmail: `${supplier.companyName.toLowerCase().replace(/[^a-z0-9]+/g, "")}${index + 1}@gmail.com`,
      phoneNumber: `+855${(index + 10).toString().padStart(9, "0")}`,
      normalizedPhoneNumber: normalizeCambodianPhone(`+855${(index + 10).toString().padStart(9, "0")}`),
      phoneVerified: true,
      maskedNationalId: maskNationalId(`${199000000000 + index}`),
      province: supplier.province,
      verificationStatus: "verified_account",
      status: "active",
      trustScore: Math.round(supplier.rating * 20),
      createdAt: t,
      updatedAt: t,
      businessName: supplier.companyName,
      businessCategory: supplier.businessCategory || PRODUCT_CATEGORIES[index % PRODUCT_CATEGORIES.length],
      businessDescription: supplier.businessDescription,
      businessLogoUrl: supplier.logo,
      businessProvince: supplier.province,
      businessAddressDetails: `${supplier.province} logistics hub`,
      location: supplier.province,
      description: supplier.companyStory,
      phoneOrTelegram: `+855${(index + 10).toString().padStart(9, "0")}`,
      profileImageUrl: supplier.logo,
    } as SupplierAccount),
  );

  const customers = [
    { fullName: "Mey Sreypov", gmail: "mey.sreypov@gmail.com", phoneNumber: "+85510555666", nationalId: "199001234567", province: "Phnom Penh", phoneOrTelegram: "@sreypov" },
    { fullName: "Heng Rith", gmail: "heng.rith@gmail.com", phoneNumber: "+855887778888", nationalId: "199101234567", province: "Siem Reap", phoneOrTelegram: "@heng" },
    { fullName: "Bunthan Vuth", gmail: "purchasing@gmail.com", phoneNumber: "+85516789012", nationalId: "199201234567", province: "Battambang", phoneOrTelegram: "@bunthan" },
  ];

  customers.forEach((customer) =>
    saveUser({
      id: makeId("user"),
      role: "customer",
      fullName: customer.fullName,
      gmail: customer.gmail,
      phoneNumber: customer.phoneNumber,
      phoneOrTelegram: customer.phoneOrTelegram,
      normalizedPhoneNumber: normalizeCambodianPhone(customer.phoneNumber),
      phoneVerified: true,
      maskedNationalId: maskNationalId(customer.nationalId),
      province: customer.province,
      verificationStatus: "verified_account",
      status: "active",
      trustScore: 92,
      createdAt: t,
      updatedAt: t,
    } as CustomerAccount),
  );

  const mockProducts = getMockProducts().map((product, index) => {
    const supplier = suppliers.find((item) => item.id === product.supplierId) || (suppliers[index % suppliers.length] as SupplierAccount);
    const unit = product.packagingInformation.split(",")[0] || (index % 3 === 0 ? "per kg" : index % 3 === 1 ? "per box" : "per pack");
    return {
      id: product.id,
      supplierId: supplier.id,
      supplierName: supplier.businessName,
      supplierGmail: supplier.gmail,
      supplierPhoneMasked: supplier.phoneNumber.slice(0, 4) + "***",
      title: product.title,
      description: product.longDescription,
      category: product.category,
      unit,
      price: product.wholesalePrice,
      stockQuantity: Math.max(10, product.availableStock),
      province: product.province,
      locationDetails: product.warehouseLocation,
      location: product.province,
      imageUrl: product.images[0],
      status: "active" as ProductStatus,
      reportCount: 0,
      createdAt: new Date(product.createdDate).toISOString(),
      updatedAt: new Date(product.createdDate).toISOString(),
    } satisfies Product;
  });

  writeLocal("products", mockProducts);
  writeLocal("reviews", getMockReviews());
  writeLocal("banners", mockBanners);
  writeLocal("searchSuggestions", mockSearchSuggestions);
  writeLocal("wishlist", getMockWishlist());
  writeLocal("orders", getMockOrders());
  writeLocal("notifications", [
    ...getMockNotifications(admin.id),
    ...getMockNotifications(suppliers[0].id),
  ]);
  writeLocal("chats", getMockChatRooms());
  writeLocal("messages", getMockMessages());
  writeLocal("marketplaceMeta", {
    productsCount: mockProducts.length,
    suppliersCount: suppliers.length,
    reviewsCount: getMockReviews().length,
    generatedAt: now(),
  });

  notifyChange();
}

export const resetDemoData = resetLocalAppStorage;

export function ensureDemoData() {
  if (typeof window === "undefined") return;
  const meta = readLocal<{ productsCount?: number } | null>("marketplaceMeta", null);
  if (!meta?.productsCount || getProducts().length < 100 || getSuppliers().length < 50) seedDemoData();
}
