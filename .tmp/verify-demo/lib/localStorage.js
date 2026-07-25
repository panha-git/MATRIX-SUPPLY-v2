"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetDemoData = exports.getReports = exports.getMessages = exports.getChatRooms = exports.getNotifications = exports.getOrderRequests = exports.getCart = exports.getProductsBySupplier = exports.getProductById = exports.getActiveProducts = exports.getApprovedProducts = exports.getProducts = exports.getCurrentUser = exports.getAccountByGmail = exports.getSuppliers = exports.getUsers = exports.isValidGmail = exports.normalizeGmail = exports.DEMO_CHANGED_EVENT = exports.NOTIFICATIONS_CHANGED_EVENT = exports.ORDERS_CHANGED_EVENT = exports.CARTS_CHANGED_EVENT = exports.PRODUCTS_CHANGED_EVENT = exports.AUTH_CHANGED_EVENT = exports.PLATFORM_CHANGED_EVENT = void 0;
exports.saveUser = saveUser;
exports.loginOrCreateUser = loginOrCreateUser;
exports.logout = logout;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.setProductApproval = setProductApproval;
exports.updateSupplierProfile = updateSupplierProfile;
exports.updateCustomerProfile = updateCustomerProfile;
exports.addToCart = addToCart;
exports.setCartItemQuantity = setCartItemQuantity;
exports.removeCartItem = removeCartItem;
exports.clearCart = clearCart;
exports.getCartSummary = getCartSummary;
exports.createOrderRequest = createOrderRequest;
exports.setOrderStatus = setOrderStatus;
exports.addNotification = addNotification;
exports.markNotificationRead = markNotificationRead;
exports.startChat = startChat;
exports.sendMessage = sendMessage;
exports.createReport = createReport;
exports.setReportStatus = setReportStatus;
exports.setUserStatus = setUserStatus;
exports.seedDemoData = seedDemoData;
const cambodia_1 = require("./cambodia");
const localAppStorage_1 = require("./localAppStorage");
const products_1 = require("./mock/products");
const suppliers_1 = require("./mock/suppliers");
const reviews_1 = require("./mock/reviews");
const notifications_1 = require("./mock/notifications");
const chat_1 = require("./mock/chat");
const orders_1 = require("./mock/orders");
const search_1 = require("./mock/search");
const wishlist_1 = require("./mock/wishlist");
const banners_1 = require("./mock/banners");
var localAppStorage_2 = require("./localAppStorage");
Object.defineProperty(exports, "PLATFORM_CHANGED_EVENT", { enumerable: true, get: function () { return localAppStorage_2.PLATFORM_CHANGED_EVENT; } });
const SESSION = "matrix-supply-cambodia:session";
const now = () => new Date().toISOString();
const notifyChange = () => typeof window !== "undefined" && window.dispatchEvent(new Event(localAppStorage_1.PLATFORM_CHANGED_EVENT));
exports.AUTH_CHANGED_EVENT = localAppStorage_1.PLATFORM_CHANGED_EVENT;
exports.PRODUCTS_CHANGED_EVENT = localAppStorage_1.PLATFORM_CHANGED_EVENT;
exports.CARTS_CHANGED_EVENT = localAppStorage_1.PLATFORM_CHANGED_EVENT;
exports.ORDERS_CHANGED_EVENT = localAppStorage_1.PLATFORM_CHANGED_EVENT;
exports.NOTIFICATIONS_CHANGED_EVENT = localAppStorage_1.PLATFORM_CHANGED_EVENT;
exports.DEMO_CHANGED_EVENT = localAppStorage_1.PLATFORM_CHANGED_EVENT;
const normalizeGmail = (v) => v.trim().toLowerCase();
exports.normalizeGmail = normalizeGmail;
const isValidGmail = (v) => /^[^\s@]+@gmail\.com$/i.test((0, exports.normalizeGmail)(v));
exports.isValidGmail = isValidGmail;
const getUsers = () => (0, localAppStorage_1.readLocal)("users", []);
exports.getUsers = getUsers;
const getSuppliers = () => (0, exports.getUsers)().filter((u) => u.role === "supplier");
exports.getSuppliers = getSuppliers;
const getAccountByGmail = (g) => (0, exports.getUsers)().find((u) => u.gmail === (0, exports.normalizeGmail)(g)) || null;
exports.getAccountByGmail = getAccountByGmail;
const getCurrentUser = () => (typeof window === "undefined" ? null : (0, exports.getUsers)().find((u) => u.id === sessionStorage.getItem(SESSION)) || null);
exports.getCurrentUser = getCurrentUser;
function saveUser(user) {
    (0, localAppStorage_1.writeLocal)("users", [...(0, exports.getUsers)().filter((u) => u.id !== user.id), user]);
    return user;
}
function loginOrCreateUser(gmail, profile) {
    const email = (0, exports.normalizeGmail)(gmail);
    if (!(0, exports.isValidGmail)(email))
        throw Error("Enter a valid Gmail address.");
    let user = (0, exports.getAccountByGmail)(email);
    if (!user && email === "admin@gmail.com")
        user = adminAccount();
    if (!user && profile)
        user = createAccount(email, profile);
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
    if (!user)
        throw Error("No account found. Complete secure registration first.");
    if (user.status === "suspended")
        throw Error("This account is suspended. Contact marketplace support.");
    sessionStorage.setItem(SESSION, user.id);
    notifyChange();
    return user;
}
function createAccount(gmail, p) {
    if (!p.phoneNumber || !(0, cambodia_1.validateCambodianPhone)(p.phoneNumber) || !p.phoneVerified)
        throw Error("Complete Cambodian phone verification.");
    if (!p.nationalId)
        throw Error("National ID information is required.");
    if (!p.fullName || !p.province)
        throw Error("Complete all required registration fields.");
    const t = now();
    const base = {
        id: (0, localAppStorage_1.makeId)("user"),
        gmail,
        fullName: p.fullName,
        phoneNumber: p.phoneNumber,
        normalizedPhoneNumber: (0, cambodia_1.normalizeCambodianPhone)(p.phoneNumber),
        phoneVerified: true,
        maskedNationalId: (0, cambodia_1.maskNationalId)(p.nationalId),
        province: p.province,
        verificationStatus: "verified_account",
        status: "active",
        trustScore: 90,
        createdAt: t,
        updatedAt: t,
        gender: p.gender,
        district: p.district,
        commune: p.commune,
        addressDetails: p.addressDetails,
        profileImageUrl: p.profileImageUrl,
    };
    let user;
    if (p.role === "supplier") {
        if (!p.businessName || !p.businessCategory || !p.businessDescription || !p.businessAddressDetails)
            throw Error("Complete all required business fields.");
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
    }
    else {
        user = { ...base, role: "customer" };
    }
    saveUser(user);
    addNotification(user.id, "Verified Account ready", "Your secure registration is complete.", "account", "/account");
    return user;
}
function logout() {
    if (typeof window !== "undefined") {
        sessionStorage.removeItem(SESSION);
        notifyChange();
    }
}
const getProducts = () => (0, localAppStorage_1.readLocal)("products", []);
exports.getProducts = getProducts;
const getApprovedProducts = () => (0, exports.getProducts)().filter((p) => p.status === "active");
exports.getApprovedProducts = getApprovedProducts;
exports.getActiveProducts = exports.getApprovedProducts;
const getProductById = (id) => {
    const products = (0, exports.getProducts)();
    return products.find((p) => p.id === id) || (id === "product_1" ? products[0] || null : null);
};
exports.getProductById = getProductById;
const getProductsBySupplier = (id) => (0, exports.getProducts)().filter((p) => p.supplierId === id);
exports.getProductsBySupplier = getProductsBySupplier;
function createProduct(s, input) {
    if (s.verificationStatus !== "verified_account")
        throw Error("Complete verified account setup first.");
    const t = now();
    const p = {
        ...input,
        id: (0, localAppStorage_1.makeId)("product"),
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
    (0, localAppStorage_1.writeLocal)("products", [p, ...(0, exports.getProducts)()]);
    return p;
}
function updateProduct(id, supplierId, input) {
    const all = (0, exports.getProducts)();
    const old = all.find((p) => p.id === id && p.supplierId === supplierId);
    if (!old)
        return null;
    const p = { ...old, ...input, location: input.province || input.location || old.location, updatedAt: now() };
    (0, localAppStorage_1.writeLocal)("products", all.map((x) => (x.id === id ? p : x)));
    return p;
}
function deleteProduct(id, sid) {
    const p = (0, exports.getProducts)().find((x) => x.id === id && x.supplierId === sid);
    if (!p)
        return false;
    (0, localAppStorage_1.writeLocal)("products", (0, exports.getProducts)().filter((x) => x.id !== id));
    return true;
}
function setProductApproval(id, status) {
    const all = (0, exports.getProducts)();
    const p = all.find((x) => x.id === id);
    if (!p)
        return null;
    const next = { ...p, status, updatedAt: now() };
    (0, localAppStorage_1.writeLocal)("products", all.map((x) => (x.id === id ? next : x)));
    if (status === "removed")
        addNotification(p.supplierId, "Product removed", `${p.title} was removed by marketplace safety.`, "product", "/dashboard");
    return next;
}
function updateSupplierProfile(id, input) {
    const u = (0, exports.getUsers)().find((x) => x.id === id && x.role === "supplier");
    return u ? saveUser({ ...u, ...input, updatedAt: now() }) : null;
}
function updateCustomerProfile(id, input) {
    const u = (0, exports.getUsers)().find((x) => x.id === id && x.role === "customer");
    return u ? saveUser({ ...u, ...input, updatedAt: now() }) : null;
}
const getCarts = () => (0, localAppStorage_1.readLocal)("carts", []);
const getCart = (id) => getCarts().find((c) => c.customerId === id) || { customerId: id, items: [] };
exports.getCart = getCart;
function saveCart(c) {
    (0, localAppStorage_1.writeLocal)("carts", [...getCarts().filter((x) => x.customerId !== c.customerId), c]);
}
function addToCart(id, p) {
    const c = (0, exports.getCart)(id);
    const old = c.items.find((x) => x.productId === p.id);
    saveCart({
        ...c,
        items: old
            ? c.items.map((x) => (x.productId === p.id ? { ...x, quantity: Math.min(p.stockQuantity, x.quantity + 1) } : x))
            : [...c.items, { productId: p.id, supplierId: p.supplierId, supplierName: p.supplierName, title: p.title, price: p.price, unit: p.unit, quantity: 1, imageUrl: p.imageUrl }],
    });
}
function setCartItemQuantity(id, pid, q) {
    const c = (0, exports.getCart)(id);
    saveCart({ ...c, items: q < 1 ? c.items.filter((x) => x.productId !== pid) : c.items.map((x) => (x.productId === pid ? { ...x, quantity: q } : x)) });
}
function removeCartItem(id, pid) {
    setCartItemQuantity(id, pid, 0);
}
function clearCart(id) {
    saveCart({ customerId: id, items: [] });
}
function getCartSummary() {
    return { customerCarts: getCarts().length, itemQuantity: getCarts().reduce((n, c) => n + c.items.reduce((s, i) => s + i.quantity, 0), 0) };
}
const getOrderRequests = () => (0, localAppStorage_1.readLocal)("orders", []);
exports.getOrderRequests = getOrderRequests;
function createOrderRequest(input) {
    if (!input.items.length)
        throw Error("Add at least one product.");
    const province = input.deliveryProvince || input.deliveryLocation || "";
    const address = input.deliveryAddressDetails || input.deliveryLocation || "";
    if (!province || !address)
        throw Error("Enter delivery province and address details.");
    const created = [];
    const supplierGroups = new Map();
    input.items.forEach((item) => {
        const existing = supplierGroups.get(item.supplierId) || [];
        existing.push(item);
        supplierGroups.set(item.supplierId, existing);
    });
    supplierGroups.forEach((group) => {
        const t = now();
        const o = {
            id: (0, localAppStorage_1.makeId)("order"),
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
    (0, localAppStorage_1.writeLocal)("orders", [...created, ...(0, exports.getOrderRequests)()]);
    if (input.requestType === "order")
        clearCart(input.customer.id);
    return created[0];
}
function setOrderStatus(id, status) {
    const all = (0, exports.getOrderRequests)();
    const o = all.find((x) => x.id === id);
    if (!o)
        return null;
    const n = { ...o, status, updatedAt: now() };
    (0, localAppStorage_1.writeLocal)("orders", all.map((x) => (x.id === id ? n : x)));
    addNotification(o.customerId, `Order ${status}`, `${o.supplierName} marked your order request as ${status}.`, "order", "/orders");
    return n;
}
const getNotifications = (uid) => (0, localAppStorage_1.readLocal)("notifications", []).filter((n) => !uid || n.userId === uid);
exports.getNotifications = getNotifications;
function addNotification(userId, title, message, type, link) {
    const n = { id: (0, localAppStorage_1.makeId)("notification"), userId, title, message, type, read: false, createdAt: now(), link };
    (0, localAppStorage_1.writeLocal)("notifications", [n, ...(0, localAppStorage_1.readLocal)("notifications", [])]);
    return n;
}
function markNotificationRead(id) {
    (0, localAppStorage_1.writeLocal)("notifications", (0, localAppStorage_1.readLocal)("notifications", []).map((n) => (n.id === id ? { ...n, read: true } : n)));
}
const getChatRooms = () => (0, localAppStorage_1.readLocal)("chats", []);
exports.getChatRooms = getChatRooms;
const getMessages = () => (0, localAppStorage_1.readLocal)("messages", []);
exports.getMessages = getMessages;
function startChat(customer, p) {
    let room = (0, exports.getChatRooms)().find((r) => r.customerId === customer.id && r.supplierId === p.supplierId && r.productId === p.id);
    if (room)
        return room;
    const t = now();
    room = { id: (0, localAppStorage_1.makeId)("chat"), customerId: customer.id, customerName: customer.fullName, supplierId: p.supplierId, supplierName: p.supplierName, productId: p.id, productTitle: p.title, createdAt: t, updatedAt: t };
    (0, localAppStorage_1.writeLocal)("chats", [room, ...(0, exports.getChatRooms)()]);
    return room;
}
function sendMessage(room, sender, message) {
    const text = message.trim();
    if (!text)
        throw Error("Enter a message.");
    const receiverId = sender.id === room.customerId ? room.supplierId : room.customerId;
    const m = { id: (0, localAppStorage_1.makeId)("message"), chatRoomId: room.id, senderId: sender.id, senderName: sender.role === "supplier" ? sender.businessName : sender.fullName, senderRole: sender.role, receiverId, message: text, read: false, createdAt: now() };
    (0, localAppStorage_1.writeLocal)("messages", [...(0, exports.getMessages)(), m]);
    addNotification(receiverId, "New chat message", `${m.senderName}: ${text.slice(0, 60)}`, "chat", `/chat?room=${room.id}`);
    return m;
}
const getReports = () => (0, localAppStorage_1.readLocal)("reports", []);
exports.getReports = getReports;
function createReport(input) {
    const t = now();
    const r = { ...input, id: (0, localAppStorage_1.makeId)("report"), status: "new", createdAt: t, updatedAt: t };
    (0, localAppStorage_1.writeLocal)("reports", [r, ...(0, exports.getReports)()]);
    if (input.targetType === "product")
        (0, localAppStorage_1.writeLocal)("products", (0, exports.getProducts)().map((p) => (p.id === input.targetId ? { ...p, reportCount: p.reportCount + 1 } : p)));
    const admin = (0, exports.getUsers)().find((u) => u.role === "admin");
    if (admin)
        addNotification(admin.id, "New safety report", `${input.reporterName} reported a ${input.targetType}.`, "report", "/admin");
    return r;
}
function setReportStatus(id, status) {
    (0, localAppStorage_1.writeLocal)("reports", (0, exports.getReports)().map((r) => (r.id === id ? { ...r, status, updatedAt: now() } : r)));
}
function setUserStatus(id, status) {
    const u = (0, exports.getUsers)().find((x) => x.id === id);
    if (!u)
        return null;
    const n = saveUser({ ...u, status, updatedAt: now() });
    addNotification(id, status === "suspended" ? "Account suspended" : "Account restored", status === "suspended" ? "Marketplace access has been suspended for safety review." : "Your marketplace access has been restored.", "account", "/account");
    return n;
}
function adminAccount() {
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
function seedDemoData() {
    (0, localAppStorage_1.resetLocalAppStorage)();
    const t = now();
    const admin = adminAccount();
    const suppliers = (0, suppliers_1.getMockSuppliers)().map((supplier, index) => saveUser({
        id: supplier.id,
        role: "supplier",
        fullName: supplier.companyName,
        gmail: `${supplier.companyName.toLowerCase().replace(/[^a-z0-9]+/g, "")}${index + 1}@gmail.com`,
        phoneNumber: `+855${(index + 10).toString().padStart(9, "0")}`,
        normalizedPhoneNumber: (0, cambodia_1.normalizeCambodianPhone)(`+855${(index + 10).toString().padStart(9, "0")}`),
        phoneVerified: true,
        maskedNationalId: (0, cambodia_1.maskNationalId)(`${199000000000 + index}`),
        province: supplier.province,
        verificationStatus: "verified_account",
        status: "active",
        trustScore: Math.round(supplier.rating * 20),
        createdAt: t,
        updatedAt: t,
        businessName: supplier.companyName,
        businessCategory: cambodia_1.PRODUCT_CATEGORIES[index % cambodia_1.PRODUCT_CATEGORIES.length],
        businessDescription: supplier.businessDescription,
        businessLogoUrl: supplier.logo,
        businessProvince: supplier.province,
        businessAddressDetails: `${supplier.province} logistics hub`,
        location: supplier.province,
        description: supplier.companyStory,
        phoneOrTelegram: `+855${(index + 10).toString().padStart(9, "0")}`,
        profileImageUrl: supplier.logo,
    }));
    const customers = [
        { fullName: "Mey Sreypov", gmail: "mey.sreypov@gmail.com", phoneNumber: "+85510555666", nationalId: "199001234567", province: "Phnom Penh", phoneOrTelegram: "@sreypov" },
        { fullName: "Heng Rith", gmail: "heng.rith@gmail.com", phoneNumber: "+855887778888", nationalId: "199101234567", province: "Siem Reap", phoneOrTelegram: "@heng" },
        { fullName: "Bunthan Vuth", gmail: "purchasing@gmail.com", phoneNumber: "+85516789012", nationalId: "199201234567", province: "Battambang", phoneOrTelegram: "@bunthan" },
    ];
    customers.forEach((customer) => saveUser({
        id: (0, localAppStorage_1.makeId)("user"),
        role: "customer",
        fullName: customer.fullName,
        gmail: customer.gmail,
        phoneNumber: customer.phoneNumber,
        phoneOrTelegram: customer.phoneOrTelegram,
        normalizedPhoneNumber: (0, cambodia_1.normalizeCambodianPhone)(customer.phoneNumber),
        phoneVerified: true,
        maskedNationalId: (0, cambodia_1.maskNationalId)(customer.nationalId),
        province: customer.province,
        verificationStatus: "verified_account",
        status: "active",
        trustScore: 92,
        createdAt: t,
        updatedAt: t,
    }));
    const mockProducts = (0, products_1.getMockProducts)().map((product, index) => {
        const supplier = suppliers[index % suppliers.length];
        const unit = index % 3 === 0 ? "per kg" : index % 3 === 1 ? "per box" : "per pack";
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
            status: "active",
            reportCount: 0,
            createdAt: new Date(product.createdDate).toISOString(),
            updatedAt: new Date(product.createdDate).toISOString(),
        };
    });
    (0, localAppStorage_1.writeLocal)("products", mockProducts);
    (0, localAppStorage_1.writeLocal)("reviews", (0, reviews_1.getMockReviews)());
    (0, localAppStorage_1.writeLocal)("banners", banners_1.mockBanners);
    (0, localAppStorage_1.writeLocal)("searchSuggestions", search_1.mockSearchSuggestions);
    (0, localAppStorage_1.writeLocal)("wishlist", (0, wishlist_1.getMockWishlist)());
    (0, localAppStorage_1.writeLocal)("orders", (0, orders_1.getMockOrders)());
    (0, localAppStorage_1.writeLocal)("notifications", [
        ...(0, notifications_1.getMockNotifications)(admin.id),
        ...(0, notifications_1.getMockNotifications)(suppliers[0].id),
    ]);
    (0, localAppStorage_1.writeLocal)("chats", (0, chat_1.getMockChatRooms)());
    (0, localAppStorage_1.writeLocal)("messages", (0, chat_1.getMockMessages)());
    (0, localAppStorage_1.writeLocal)("marketplaceMeta", {
        productsCount: mockProducts.length,
        suppliersCount: suppliers.length,
        reviewsCount: (0, reviews_1.getMockReviews)().length,
        generatedAt: now(),
    });
    notifyChange();
}
exports.resetDemoData = localAppStorage_1.resetLocalAppStorage;
