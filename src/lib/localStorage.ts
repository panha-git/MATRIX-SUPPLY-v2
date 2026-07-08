export type UserRole = "customer" | "supplier";

type BaseAccount = {
  id: string;
  gmail: string;
  role: UserRole;
  createdAt: string;
};

export type SupplierAccount = BaseAccount & {
  role: "supplier";
  businessName: string;
  phoneNumber: string;
  location: string;
  description: string;
};

export type CustomerAccount = BaseAccount & {
  role: "customer";
  fullName: string;
  phoneNumber?: string;
  location?: string;
};

export type LocalAccount = SupplierAccount | CustomerAccount;

export type RegistrationProfile =
  | Pick<
      SupplierAccount,
      "role" | "businessName" | "phoneNumber" | "location" | "description"
    >
  | Pick<CustomerAccount, "role" | "fullName" | "phoneNumber" | "location">;

export type ProductStatus = "active" | "inactive";

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
  | "status"
>;

const ACCOUNTS_KEY = "matrix-supply-v2:accounts";
const SESSION_KEY = "matrix-supply-v2:session";
const PRODUCTS_KEY = "matrix-supply-v2:products";

export const AUTH_CHANGED_EVENT = "matrix-supply-v2:auth-changed";
export const PRODUCTS_CHANGED_EVENT = "matrix-supply-v2:products-changed";

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
  if (!id || !isValidGmail(gmail)) return null;

  // Compatibility for accounts created by the earlier local demo: seller = supplier.
  if (item.role === "supplier" || item.role === "seller") {
    return {
      id,
      gmail,
      role: "supplier",
      businessName: text(item.businessName, gmail.split("@")[0]),
      phoneNumber: text(item.phoneNumber),
      location: text(item.location),
      description: text(item.description),
      createdAt,
    };
  }

  if (item.role === "customer") {
    return {
      id,
      gmail,
      role: "customer",
      fullName: text(item.fullName, gmail.split("@")[0]),
      phoneNumber: text(item.phoneNumber) || undefined,
      location: text(item.location) || undefined,
      createdAt,
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
  const userId = window.localStorage.getItem(SESSION_KEY);
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
    if (!profile.businessName.trim())
      throw new Error("Business name is required.");
    if (!profile.phoneNumber.trim())
      throw new Error("Phone number is required.");
    if (!profile.location.trim()) throw new Error("Location is required.");
  } else if (!profile.fullName.trim()) {
    throw new Error("Full name is required.");
  }
}

export function loginOrCreateUser(
  gmail: string,
  profile?: RegistrationProfile,
) {
  const normalized = normalizeGmail(gmail);
  if (!isValidGmail(normalized))
    throw new Error("Enter a valid email ending with @gmail.com.");

  const users = getUsers();
  let account = users.find((item) => item.gmail === normalized);
  if (!account) {
    if (!profile) throw new Error("Choose a role and complete your profile.");
    validateRegistration(profile);
    const base = {
      id: makeId(
        "user",
        users.map((item) => item.id),
      ),
      gmail: normalized,
      createdAt: new Date().toISOString(),
    };
    account =
      profile.role === "supplier"
        ? {
            ...base,
            ...profile,
            businessName: profile.businessName.trim(),
            phoneNumber: profile.phoneNumber.trim(),
            location: profile.location.trim(),
            description: profile.description.trim(),
          }
        : {
            ...base,
            ...profile,
            fullName: profile.fullName.trim(),
            phoneNumber: profile.phoneNumber?.trim() || undefined,
            location: profile.location?.trim() || undefined,
          };
    saveUser(account);
  }

  window.localStorage.setItem(SESSION_KEY, account.id);
  emit(AUTH_CHANGED_EVENT);
  return account;
}

export function logout() {
  if (!hasStorage()) return;
  window.localStorage.removeItem(SESSION_KEY);
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
    status: item.status === "inactive" ? "inactive" : "active",
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

export function getActiveProducts() {
  return getProducts().filter((product) => product.status === "active");
}

export function getProductsBySupplier(supplierId: string) {
  return getProducts().filter((product) => product.supplierId === supplierId);
}

function validateProduct(input: ProductInput) {
  if (!input.title.trim()) throw new Error("Product title is required.");
  if (!input.description.trim()) throw new Error("Description is required.");
  if (!input.category.trim()) throw new Error("Category is required.");
  if (!Number.isFinite(Number(input.price)) || Number(input.price) <= 0)
    throw new Error("Price must be greater than 0.");
  if (!input.unit.trim()) throw new Error("Unit is required.");
  if (
    !Number.isInteger(Number(input.stockQuantity)) ||
    Number(input.stockQuantity) < 0
  )
    throw new Error("Stock quantity must be a whole number of 0 or more.");
  if (!input.location.trim()) throw new Error("Product location is required.");
}

export function createProduct(
  supplier: SupplierAccount,
  input: ProductInput,
): Product {
  const current = getCurrentUser();
  if (!current || current.role !== "supplier" || current.id !== supplier.id)
    throw new Error("Only the logged-in supplier can create products.");
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
    status: input.status,
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
  if (!current || current.role !== "supplier" || current.id !== supplierId)
    return null;
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
    unit: nextInput.unit.trim(),
    imageUrl: nextInput.imageUrl.trim(),
    location: nextInput.location.trim(),
    price: Number(nextInput.price),
    stockQuantity: Number(nextInput.stockQuantity),
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
  if (!current || current.role !== "supplier" || current.id !== supplierId)
    return false;
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

export function updateSupplierProfile(
  supplierId: string,
  updates: Pick<
    SupplierAccount,
    "businessName" | "phoneNumber" | "location" | "description"
  >,
) {
  const current = getCurrentUser();
  if (!current || current.role !== "supplier" || current.id !== supplierId)
    return null;
  const supplier = getSuppliers().find((item) => item.id === supplierId);
  if (!supplier) return null;
  const profile: RegistrationProfile = { role: "supplier", ...updates };
  validateRegistration(profile);
  const updated = saveUser({
    ...supplier,
    businessName: updates.businessName.trim(),
    phoneNumber: updates.phoneNumber.trim(),
    location: updates.location.trim(),
    description: updates.description.trim(),
  });
  const products = getProducts().map((product) =>
    product.supplierId === supplierId
      ? {
          ...product,
          supplierName: updated.businessName,
          location:
            product.location === supplier.location
              ? updated.location
              : product.location,
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
  updates: Pick<CustomerAccount, "fullName" | "phoneNumber" | "location">,
) {
  const current = getCurrentUser();
  if (!current || current.role !== "customer" || current.id !== customerId)
    return null;
  const customer = getUsers().find(
    (item): item is CustomerAccount =>
      item.id === customerId && item.role === "customer",
  );
  if (!customer || !updates.fullName.trim()) return null;
  return saveUser({
    ...customer,
    fullName: updates.fullName.trim(),
    phoneNumber: updates.phoneNumber?.trim() || undefined,
    location: updates.location?.trim() || undefined,
  });
}
