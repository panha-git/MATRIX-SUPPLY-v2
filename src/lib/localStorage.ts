export type UserRole = "customer" | "supplier" | "admin";

type BaseAccount = {
  id: string;
  gmail: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export type SupplierAccount = BaseAccount & {
  role: "supplier";
  businessName: string;
  phoneOrTelegram: string;
  location: string;
  description: string;
};

export type CustomerAccount = BaseAccount & {
  role: "customer";
  fullName: string;
  phoneOrTelegram: string;
};

export type AdminAccount = BaseAccount & {
  role: "admin";
  fullName: string;
};

export type LocalAccount = SupplierAccount | CustomerAccount | AdminAccount;

export type RegistrationProfile =
  | Pick<
      SupplierAccount,
      "role" | "businessName" | "phoneOrTelegram" | "location" | "description"
    >
  | Pick<CustomerAccount, "role" | "fullName" | "phoneOrTelegram">;

export type ProductStatus = "pending" | "approved" | "rejected";

export type Product = {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierGmail: string;
  title: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  stockQuantity: number;
  imageUrl: string;
  location: string;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
};

export type ProductInput = Pick<
  Product,
  | "title"
  | "description"
  | "category"
  | "price"
  | "unit"
  | "stockQuantity"
  | "imageUrl"
  | "location"
>;

export type CartItem = {
  productId: string;
  title: string;
  price: number;
  unit: string;
  supplierId: string;
  supplierName: string;
  quantity: number;
  imageUrl: string;
};

export type CustomerCart = {
  customerId: string;
  items: CartItem[];
};

export type OrderStatus = "new" | "reviewed" | "approved" | "rejected";

export type OrderRequest = {
  id: string;
  requestType: "order" | "quote";
  customerId: string;
  customerName: string;
  customerGmail: string;
  phoneOrTelegram: string;
  deliveryLocation: string;
  notes: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
};

const ACCOUNTS_KEY = "matrix-supply-v2:accounts";
const LEGACY_SESSION_KEY = "matrix-supply-v2:session";
const SESSION_KEY = "matrix-supply-v2:tab-session";
const PRODUCTS_KEY = "matrix-supply-v2:products";
const CARTS_KEY = "matrix-supply-v2:carts";
const ORDERS_KEY = "matrix-supply-v2:order-requests";

export const AUTH_CHANGED_EVENT = "matrix-supply-v2:auth-changed";
export const PRODUCTS_CHANGED_EVENT = "matrix-supply-v2:products-changed";
export const CARTS_CHANGED_EVENT = "matrix-supply-v2:carts-changed";
export const ORDERS_CHANGED_EVENT = "matrix-supply-v2:orders-changed";
export const DEMO_CHANGED_EVENT = "matrix-supply-v2:demo-changed";

const hasStorage = () => typeof window !== "undefined";

function readArray(key: string): unknown[] {
  if (!hasStorage()) return [];
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function writeArray<T>(key: string, value: T[]) {
  if (hasStorage()) window.localStorage.setItem(key, JSON.stringify(value));
}

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function number(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function makeId(prefix: string, existingIds: string[] = []) {
  let id = "";
  do {
    const random =
      globalThis.crypto?.randomUUID?.() ??
      `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    id = `${prefix}_${random}`;
  } while (existingIds.includes(id));
  return id;
}

function emit(name: string) {
  if (hasStorage()) window.dispatchEvent(new Event(name));
}

function emitAll() {
  [
    AUTH_CHANGED_EVENT,
    PRODUCTS_CHANGED_EVENT,
    CARTS_CHANGED_EVENT,
    ORDERS_CHANGED_EVENT,
    DEMO_CHANGED_EVENT,
  ].forEach(emit);
}

export function normalizeGmail(gmail: string) {
  return gmail.trim().toLowerCase();
}

export function isValidGmail(gmail: string) {
  return /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@gmail\.com$/i.test(
    normalizeGmail(gmail),
  );
}

function normalizeAccount(value: unknown): LocalAccount | null {
  const item = record(value);
  if (!item) return null;
  const id = text(item.id);
  const gmail = normalizeGmail(text(item.gmail));
  const createdAt = text(item.createdAt, new Date().toISOString());
  const updatedAt = text(item.updatedAt, createdAt);
  if (!id || !isValidGmail(gmail)) return null;

  if (item.role === "supplier" || item.role === "seller") {
    return {
      id,
      gmail,
      role: "supplier",
      businessName: text(item.businessName, gmail.split("@")[0]),
      phoneOrTelegram: text(item.phoneOrTelegram, text(item.phoneNumber)),
      location: text(item.location),
      description: text(item.description),
      createdAt,
      updatedAt,
    };
  }

  if (item.role === "customer") {
    return {
      id,
      gmail,
      role: "customer",
      fullName: text(item.fullName, gmail.split("@")[0]),
      phoneOrTelegram: text(item.phoneOrTelegram, text(item.phoneNumber)),
      createdAt,
      updatedAt,
    };
  }

  if (item.role === "admin") {
    return {
      id,
      gmail,
      role: "admin",
      fullName: text(item.fullName, "MATRIX SUPPLY Admin"),
      createdAt,
      updatedAt,
    };
  }

  return null;
}

export function getUsers() {
  return readArray(ACCOUNTS_KEY)
    .map(normalizeAccount)
    .filter((user): user is LocalAccount => Boolean(user));
}

export function getSuppliers() {
  return getUsers().filter(
    (user): user is SupplierAccount => user.role === "supplier",
  );
}

export function getAccountByGmail(gmail: string) {
  const normalized = normalizeGmail(gmail);
  return getUsers().find((account) => account.gmail === normalized) ?? null;
}

export function getCurrentUser(): LocalAccount | null {
  if (!hasStorage()) return null;
  let userId = window.sessionStorage.getItem(SESSION_KEY);
  const legacyId = window.localStorage.getItem(LEGACY_SESSION_KEY);
  if (!userId && legacyId) {
    userId = legacyId;
    window.sessionStorage.setItem(SESSION_KEY, legacyId);
    window.localStorage.removeItem(LEGACY_SESSION_KEY);
  }
  return userId
    ? (getUsers().find((account) => account.id === userId) ?? null)
    : null;
}

export function saveUser<T extends LocalAccount>(user: T): T {
  const users = getUsers();
  const next = users.some((item) => item.id === user.id)
    ? users.map((item) => (item.id === user.id ? user : item))
    : [...users, user];
  writeArray(ACCOUNTS_KEY, next);
  emit(AUTH_CHANGED_EVENT);
  return user;
}

function validateRegistration(profile: RegistrationProfile) {
  if (profile.role === "supplier") {
    if (!profile.businessName.trim()) {
      throw new Error("Business name is required.");
    }
    if (!profile.phoneOrTelegram.trim()) {
      throw new Error("Phone or Telegram is required.");
    }
    if (!profile.location.trim()) throw new Error("Location is required.");
    return;
  }
  if (!profile.fullName.trim()) throw new Error("Full name is required.");
  if (!profile.phoneOrTelegram.trim()) {
    throw new Error("Phone or Telegram is required.");
  }
}

function ensureAdminAccount() {
  const existing = getAccountByGmail("admin@gmail.com");
  if (existing?.role === "admin") return existing;
  const now = new Date().toISOString();
  return saveUser<AdminAccount>({
    id: existing?.id ?? "user_demo_admin",
    role: "admin",
    gmail: "admin@gmail.com",
    fullName: "MATRIX SUPPLY Admin",
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  });
}

export function loginOrCreateUser(
  gmail: string,
  profile?: RegistrationProfile,
) {
  const normalized = normalizeGmail(gmail);
  if (!isValidGmail(normalized)) {
    throw new Error("Enter a valid email ending with @gmail.com.");
  }

  if (normalized === "admin@gmail.com") {
    const admin = ensureAdminAccount();
    window.sessionStorage.setItem(SESSION_KEY, admin.id);
    emit(AUTH_CHANGED_EVENT);
    return admin;
  }

  const users = getUsers();
  let account = users.find((item) => item.gmail === normalized);
  const now = new Date().toISOString();

  if (!account) {
    if (!profile) throw new Error("Choose a role and complete your profile.");
    validateRegistration(profile);
    const base = {
      id: makeId(
        "user",
        users.map((item) => item.id),
      ),
      gmail: normalized,
      createdAt: now,
      updatedAt: now,
    };
    account =
      profile.role === "supplier"
        ? {
            ...base,
            role: "supplier",
            businessName: profile.businessName.trim(),
            phoneOrTelegram: profile.phoneOrTelegram.trim(),
            location: profile.location.trim(),
            description: profile.description.trim(),
          }
        : {
            ...base,
            role: "customer",
            fullName: profile.fullName.trim(),
            phoneOrTelegram: profile.phoneOrTelegram.trim(),
          };
    saveUser(account);
  } else if (profile?.role === "customer" && account.role === "customer") {
    validateRegistration(profile);
    account = saveUser({
      ...account,
      fullName: profile.fullName.trim(),
      phoneOrTelegram: profile.phoneOrTelegram.trim(),
      updatedAt: now,
    });
  }

  window.sessionStorage.setItem(SESSION_KEY, account.id);
  emit(AUTH_CHANGED_EVENT);
  return account;
}

export function logout() {
  if (!hasStorage()) return;
  window.sessionStorage.removeItem(SESSION_KEY);
  emit(AUTH_CHANGED_EVENT);
}

function normalizeProduct(
  value: unknown,
  suppliers: SupplierAccount[],
): Product | null {
  const item = record(value);
  if (!item) return null;
  const id = text(item.id);
  const supplierId = text(item.supplierId, text(item.sellerId));
  const supplier = suppliers.find((entry) => entry.id === supplierId);
  const title = text(item.title, text(item.name));
  if (!id || !supplier || !title) return null;

  let status: ProductStatus = "pending";
  if (item.status === "approved" || item.status === "active") {
    status = "approved";
  } else if (item.status === "rejected") {
    status = "rejected";
  }

  return {
    id,
    supplierId,
    supplierName: text(item.supplierName, supplier.businessName),
    supplierGmail: text(item.supplierGmail, supplier.gmail),
    title,
    description: text(item.description),
    category: text(item.category, "Other"),
    price: number(item.price),
    unit: text(item.unit, "per item"),
    stockQuantity: Math.max(0, number(item.stockQuantity, 1)),
    imageUrl: text(item.imageUrl),
    location: text(item.location, supplier.location || "Location not provided"),
    status,
    createdAt: text(item.createdAt, new Date().toISOString()),
    updatedAt: text(
      item.updatedAt,
      text(item.createdAt, new Date().toISOString()),
    ),
  };
}

export function getProducts() {
  const suppliers = getSuppliers();
  return readArray(PRODUCTS_KEY)
    .map((value) => normalizeProduct(value, suppliers))
    .filter((product): product is Product => Boolean(product))
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export function getApprovedProducts() {
  return getProducts().filter((product) => product.status === "approved");
}

export const getActiveProducts = getApprovedProducts;

export function getProductById(productId: string) {
  return getProducts().find((product) => product.id === productId) ?? null;
}

export function getProductsBySupplier(supplierId: string) {
  return getProducts().filter((product) => product.supplierId === supplierId);
}

function validateProduct(input: ProductInput) {
  if (!input.title.trim()) throw new Error("Product title is required.");
  if (!input.description.trim()) throw new Error("Description is required.");
  if (!input.category.trim()) throw new Error("Category is required.");
  if (!Number.isFinite(Number(input.price)) || Number(input.price) <= 0) {
    throw new Error("Price must be greater than 0.");
  }
  if (!input.unit.trim()) throw new Error("Unit is required.");
  if (
    !Number.isInteger(Number(input.stockQuantity)) ||
    Number(input.stockQuantity) < 0
  ) {
    throw new Error("Stock quantity must be a whole number of 0 or more.");
  }
  if (!input.location.trim()) throw new Error("Product location is required.");
}

export function createProduct(
  supplier: SupplierAccount,
  input: ProductInput,
): Product {
  const current = getCurrentUser();
  if (!current || current.role !== "supplier" || current.id !== supplier.id) {
    throw new Error("Only the logged-in supplier can submit products.");
  }
  validateProduct(input);
  const products = getProducts();
  const now = new Date().toISOString();
  const product: Product = {
    id: makeId(
      "product",
      products.map((item) => item.id),
    ),
    supplierId: supplier.id,
    supplierName: supplier.businessName,
    supplierGmail: supplier.gmail,
    title: input.title.trim(),
    description: input.description.trim(),
    category: input.category.trim(),
    price: Number(input.price),
    unit: input.unit.trim(),
    stockQuantity: Number(input.stockQuantity),
    imageUrl: input.imageUrl.trim(),
    location: input.location.trim(),
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };
  writeArray(PRODUCTS_KEY, [product, ...products]);
  emit(PRODUCTS_CHANGED_EVENT);
  return product;
}

export function updateProduct(
  productId: string,
  supplierId: string,
  updates: Partial<ProductInput>,
) {
  const current = getCurrentUser();
  if (!current || current.role !== "supplier" || current.id !== supplierId) {
    return null;
  }
  const products = getProducts();
  const target = products.find((product) => product.id === productId);
  if (!target || target.supplierId !== supplierId) return null;
  const nextInput: ProductInput = { ...target, ...updates };
  validateProduct(nextInput);
  const updated: Product = {
    ...target,
    ...nextInput,
    title: nextInput.title.trim(),
    description: nextInput.description.trim(),
    category: nextInput.category.trim(),
    unit: nextInput.unit.trim(),
    imageUrl: nextInput.imageUrl.trim(),
    location: nextInput.location.trim(),
    price: Number(nextInput.price),
    stockQuantity: Number(nextInput.stockQuantity),
    status: "pending",
    updatedAt: new Date().toISOString(),
  };
  writeArray(
    PRODUCTS_KEY,
    products.map((product) => (product.id === productId ? updated : product)),
  );
  emit(PRODUCTS_CHANGED_EVENT);
  return updated;
}

export function deleteProduct(productId: string, supplierId: string) {
  const current = getCurrentUser();
  if (!current || current.role !== "supplier" || current.id !== supplierId) {
    return false;
  }
  const products = getProducts();
  const target = products.find((product) => product.id === productId);
  if (!target || target.supplierId !== supplierId) return false;
  writeArray(
    PRODUCTS_KEY,
    products.filter((product) => product.id !== productId),
  );
  emit(PRODUCTS_CHANGED_EVENT);
  return true;
}

export function setProductApproval(productId: string, status: ProductStatus) {
  const current = getCurrentUser();
  if (!current || current.role !== "admin") return null;
  const products = getProducts();
  const target = products.find((product) => product.id === productId);
  if (!target) return null;
  const updated = { ...target, status, updatedAt: new Date().toISOString() };
  writeArray(
    PRODUCTS_KEY,
    products.map((product) => (product.id === productId ? updated : product)),
  );
  emit(PRODUCTS_CHANGED_EVENT);
  return updated;
}

export function updateSupplierProfile(
  supplierId: string,
  updates: Pick<
    SupplierAccount,
    "businessName" | "phoneOrTelegram" | "location" | "description"
  >,
) {
  const current = getCurrentUser();
  if (!current || current.role !== "supplier" || current.id !== supplierId) {
    return null;
  }
  const supplier = getSuppliers().find((item) => item.id === supplierId);
  if (!supplier) return null;
  const profile: RegistrationProfile = { role: "supplier", ...updates };
  validateRegistration(profile);
  const updated = saveUser({
    ...supplier,
    businessName: updates.businessName.trim(),
    phoneOrTelegram: updates.phoneOrTelegram.trim(),
    location: updates.location.trim(),
    description: updates.description.trim(),
    updatedAt: new Date().toISOString(),
  });
  const products = getProducts().map((product) =>
    product.supplierId === supplierId
      ? {
          ...product,
          supplierName: updated.businessName,
          updatedAt: new Date().toISOString(),
        }
      : product,
  );
  writeArray(PRODUCTS_KEY, products);
  emit(PRODUCTS_CHANGED_EVENT);
  return updated;
}

export function updateCustomerProfile(
  customerId: string,
  updates: Pick<CustomerAccount, "fullName" | "phoneOrTelegram">,
) {
  const current = getCurrentUser();
  if (!current || current.role !== "customer" || current.id !== customerId) {
    return null;
  }
  if (!updates.fullName.trim() || !updates.phoneOrTelegram.trim()) return null;
  const customer = getUsers().find(
    (item): item is CustomerAccount =>
      item.id === customerId && item.role === "customer",
  );
  if (!customer) return null;
  return saveUser({
    ...customer,
    fullName: updates.fullName.trim(),
    phoneOrTelegram: updates.phoneOrTelegram.trim(),
    updatedAt: new Date().toISOString(),
  });
}

function normalizeCartItem(value: unknown): CartItem | null {
  const item = record(value);
  if (!item) return null;
  const productId = text(item.productId);
  const title = text(item.title);
  if (!productId || !title) return null;
  return {
    productId,
    title,
    price: Math.max(0, number(item.price)),
    unit: text(item.unit, "per item"),
    supplierId: text(item.supplierId),
    supplierName: text(item.supplierName),
    quantity: Math.max(1, Math.floor(number(item.quantity, 1))),
    imageUrl: text(item.imageUrl),
  };
}

function getCarts() {
  return readArray(CARTS_KEY)
    .map(record)
    .filter((item): item is Record<string, unknown> => Boolean(item))
    .map((item) => ({
      customerId: text(item.customerId),
      items: Array.isArray(item.items)
        ? item.items
            .map(normalizeCartItem)
            .filter((entry): entry is CartItem => Boolean(entry))
        : [],
    }))
    .filter((cart) => cart.customerId);
}

export function getCartSummary() {
  const carts = getCarts().filter((cart) => cart.items.length > 0);
  return {
    customerCarts: carts.length,
    itemQuantity: carts.reduce(
      (total, cart) =>
        total + cart.items.reduce((sum, item) => sum + item.quantity, 0),
      0,
    ),
  };
}

export function getCart(customerId: string): CustomerCart {
  return (
    getCarts().find((cart) => cart.customerId === customerId) ?? {
      customerId,
      items: [],
    }
  );
}

function saveCart(cart: CustomerCart) {
  const carts = getCarts();
  const next = carts.some((item) => item.customerId === cart.customerId)
    ? carts.map((item) => (item.customerId === cart.customerId ? cart : item))
    : [...carts, cart];
  writeArray(CARTS_KEY, next);
  emit(CARTS_CHANGED_EVENT);
  return cart;
}

function requireCustomer(customerId: string) {
  const current = getCurrentUser();
  if (!current || current.role !== "customer" || current.id !== customerId) {
    throw new Error("A customer account is required for this action.");
  }
  return current;
}

export function addToCart(customerId: string, product: Product) {
  requireCustomer(customerId);
  if (product.status !== "approved") {
    throw new Error("This product is not currently available.");
  }
  if (product.stockQuantity < 1)
    throw new Error("This product is out of stock.");
  const cart = getCart(customerId);
  const existing = cart.items.find((item) => item.productId === product.id);
  const items = existing
    ? cart.items.map((item) =>
        item.productId === product.id
          ? {
              ...item,
              quantity: Math.min(item.quantity + 1, product.stockQuantity),
            }
          : item,
      )
    : [
        ...cart.items,
        {
          productId: product.id,
          title: product.title,
          price: product.price,
          unit: product.unit,
          supplierId: product.supplierId,
          supplierName: product.supplierName,
          quantity: 1,
          imageUrl: product.imageUrl,
        },
      ];
  return saveCart({ customerId, items });
}

export function setCartItemQuantity(
  customerId: string,
  productId: string,
  quantity: number,
) {
  requireCustomer(customerId);
  const cart = getCart(customerId);
  if (quantity <= 0) return removeCartItem(customerId, productId);
  const product = getProductById(productId);
  const limit = product?.stockQuantity ?? quantity;
  return saveCart({
    customerId,
    items: cart.items.map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity: Math.max(1, Math.min(Math.floor(quantity), limit)),
          }
        : item,
    ),
  });
}

export function removeCartItem(customerId: string, productId: string) {
  requireCustomer(customerId);
  const cart = getCart(customerId);
  return saveCart({
    customerId,
    items: cart.items.filter((item) => item.productId !== productId),
  });
}

export function clearCart(customerId: string) {
  requireCustomer(customerId);
  return saveCart({ customerId, items: [] });
}

function normalizeOrder(value: unknown): OrderRequest | null {
  const item = record(value);
  if (!item) return null;
  const id = text(item.id);
  const customerId = text(item.customerId);
  if (!id || !customerId) return null;
  const createdAt = text(item.createdAt, new Date().toISOString());
  const allowedStatuses: OrderStatus[] = [
    "new",
    "reviewed",
    "approved",
    "rejected",
  ];
  const statusValue = text(item.status) as OrderStatus;
  const items = Array.isArray(item.items)
    ? item.items
        .map(normalizeCartItem)
        .filter((entry): entry is CartItem => Boolean(entry))
    : [];
  return {
    id,
    requestType: item.requestType === "quote" ? "quote" : "order",
    customerId,
    customerName: text(item.customerName),
    customerGmail: text(item.customerGmail),
    phoneOrTelegram: text(item.phoneOrTelegram),
    deliveryLocation: text(item.deliveryLocation),
    notes: text(item.notes),
    items,
    totalAmount: Math.max(0, number(item.totalAmount)),
    status: allowedStatuses.includes(statusValue) ? statusValue : "new",
    createdAt,
    updatedAt: text(item.updatedAt, createdAt),
  };
}

export function getOrderRequests() {
  return readArray(ORDERS_KEY)
    .map(normalizeOrder)
    .filter((order): order is OrderRequest => Boolean(order))
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export function createOrderRequest(input: {
  customer: CustomerAccount;
  deliveryLocation: string;
  notes: string;
  items: CartItem[];
  requestType?: "order" | "quote";
}) {
  requireCustomer(input.customer.id);
  if (!input.deliveryLocation.trim()) {
    throw new Error("Delivery location is required.");
  }
  if (!input.items.length) throw new Error("Add at least one product first.");
  const orders = getOrderRequests();
  const now = new Date().toISOString();
  const order: OrderRequest = {
    id: makeId(
      "request",
      orders.map((item) => item.id),
    ),
    requestType: input.requestType ?? "order",
    customerId: input.customer.id,
    customerName: input.customer.fullName,
    customerGmail: input.customer.gmail,
    phoneOrTelegram: input.customer.phoneOrTelegram,
    deliveryLocation: input.deliveryLocation.trim(),
    notes: input.notes.trim(),
    items: input.items,
    totalAmount: input.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    ),
    status: "new",
    createdAt: now,
    updatedAt: now,
  };
  writeArray(ORDERS_KEY, [order, ...orders]);
  if (input.requestType !== "quote") clearCart(input.customer.id);
  emit(ORDERS_CHANGED_EVENT);
  return order;
}

export function setOrderStatus(orderId: string, status: OrderStatus) {
  const current = getCurrentUser();
  if (!current || current.role !== "admin") return null;
  const orders = getOrderRequests();
  const target = orders.find((order) => order.id === orderId);
  if (!target) return null;
  const updated = { ...target, status, updatedAt: new Date().toISOString() };
  writeArray(
    ORDERS_KEY,
    orders.map((order) => (order.id === orderId ? updated : order)),
  );
  emit(ORDERS_CHANGED_EVENT);
  return updated;
}

export function seedDemoData() {
  if (!hasStorage()) return;
  const now = new Date();
  const date = (hoursAgo: number) =>
    new Date(now.getTime() - hoursAgo * 60 * 60 * 1000).toISOString();
  const users: LocalAccount[] = [
    {
      id: "user_demo_admin",
      role: "admin",
      gmail: "admin@gmail.com",
      fullName: "MATRIX SUPPLY Admin",
      createdAt: date(720),
      updatedAt: date(1),
    },
    {
      id: "user_demo_supplier_coffee",
      role: "supplier",
      gmail: "mekongcoffee@gmail.com",
      businessName: "Mekong Coffee Cooperative",
      phoneOrTelegram: "+855 12 345 678",
      location: "Mondulkiri",
      description: "Cambodian coffee grown and roasted by a local cooperative.",
      createdAt: date(600),
      updatedAt: date(20),
    },
    {
      id: "user_demo_supplier_office",
      role: "supplier",
      gmail: "cityoffice@gmail.com",
      businessName: "City Office Supply",
      phoneOrTelegram: "@cityofficesupply",
      location: "Phnom Penh",
      description:
        "Reliable office essentials for local schools and businesses.",
      createdAt: date(500),
      updatedAt: date(18),
    },
    {
      id: "user_demo_customer",
      role: "customer",
      gmail: "customer@gmail.com",
      fullName: "Sokha Demo",
      phoneOrTelegram: "+855 96 123 4567",
      createdAt: date(240),
      updatedAt: date(12),
    },
  ];
  const products: Product[] = [
    {
      id: "product_demo_coffee",
      supplierId: "user_demo_supplier_coffee",
      supplierName: "Mekong Coffee Cooperative",
      supplierGmail: "mekongcoffee@gmail.com",
      title: "Cambodian Arabica Coffee",
      description:
        "Medium-roast whole coffee beans with cocoa and citrus notes.",
      category: "Food & Beverage",
      price: 12.5,
      unit: "per kg",
      stockQuantity: 42,
      imageUrl: "",
      location: "Mondulkiri",
      status: "approved",
      createdAt: date(96),
      updatedAt: date(72),
    },
    {
      id: "product_demo_paper",
      supplierId: "user_demo_supplier_office",
      supplierName: "City Office Supply",
      supplierGmail: "cityoffice@gmail.com",
      title: "A4 Copy Paper",
      description: "Bright white 80gsm copy paper, 500 sheets in each ream.",
      category: "Office Supplies",
      price: 4.75,
      unit: "per pack",
      stockQuantity: 120,
      imageUrl: "",
      location: "Phnom Penh",
      status: "approved",
      createdAt: date(84),
      updatedAt: date(60),
    },
    {
      id: "product_demo_cups",
      supplierId: "user_demo_supplier_office",
      supplierName: "City Office Supply",
      supplierGmail: "cityoffice@gmail.com",
      title: "Reusable Meeting Cups",
      description:
        "A durable set of twelve reusable cups for offices and events.",
      category: "Other",
      price: 9,
      unit: "per set",
      stockQuantity: 18,
      imageUrl: "",
      location: "Phnom Penh",
      status: "approved",
      createdAt: date(72),
      updatedAt: date(48),
    },
    {
      id: "product_demo_pending_tea",
      supplierId: "user_demo_supplier_coffee",
      supplierName: "Mekong Coffee Cooperative",
      supplierGmail: "mekongcoffee@gmail.com",
      title: "Wild Forest Tea",
      description: "Loose-leaf forest tea submitted for marketplace review.",
      category: "Food & Beverage",
      price: 8.25,
      unit: "per pack",
      stockQuantity: 25,
      imageUrl: "",
      location: "Mondulkiri",
      status: "pending",
      createdAt: date(24),
      updatedAt: date(24),
    },
  ];
  const sampleItems: CartItem[] = [
    {
      productId: "product_demo_coffee",
      title: "Cambodian Arabica Coffee",
      price: 12.5,
      unit: "per kg",
      supplierId: "user_demo_supplier_coffee",
      supplierName: "Mekong Coffee Cooperative",
      quantity: 2,
      imageUrl: "",
    },
  ];
  const orders: OrderRequest[] = [
    {
      id: "request_demo_first",
      requestType: "order",
      customerId: "user_demo_customer",
      customerName: "Sokha Demo",
      customerGmail: "customer@gmail.com",
      phoneOrTelegram: "+855 96 123 4567",
      deliveryLocation: "Toul Kork, Phnom Penh",
      notes: "Please contact me on Telegram before delivery.",
      items: sampleItems,
      totalAmount: 25,
      status: "new",
      createdAt: date(6),
      updatedAt: date(6),
    },
  ];

  writeArray(ACCOUNTS_KEY, users);
  writeArray(PRODUCTS_KEY, products);
  writeArray(CARTS_KEY, []);
  writeArray(ORDERS_KEY, orders);
  window.sessionStorage.setItem(SESSION_KEY, "user_demo_admin");
  window.localStorage.removeItem(LEGACY_SESSION_KEY);
  emitAll();
}

export function resetDemoData() {
  if (!hasStorage()) return;
  [
    ACCOUNTS_KEY,
    PRODUCTS_KEY,
    CARTS_KEY,
    ORDERS_KEY,
    LEGACY_SESSION_KEY,
  ].forEach((key) => window.localStorage.removeItem(key));
  window.sessionStorage.removeItem(SESSION_KEY);
  emitAll();
}
