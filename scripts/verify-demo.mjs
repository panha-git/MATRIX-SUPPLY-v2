import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

class MemoryStorage {
  constructor() {
    this.values = new Map();
  }

  getItem(key) {
    return this.values.has(key) ? this.values.get(key) : null;
  }

  setItem(key, value) {
    this.values.set(key, String(value));
  }

  removeItem(key) {
    this.values.delete(key);
  }

  clear() {
    this.values.clear();
  }
}

const tempDir = path.resolve(".tmp/verify-demo");
fs.mkdirSync(tempDir, { recursive: true });

function compileToJs(relativePath) {
  const sourcePath = path.resolve(relativePath);
  const source = fs.readFileSync(sourcePath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText;
  const relative = path.relative(path.resolve("src"), sourcePath).replace(/\\/g, "/");
  const outputPath = path.join(tempDir, relative.replace(/\.ts$/, ".js"));
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, output);
  return outputPath;
}

function compileAllLibFiles(rootDir) {
  const dirPath = path.resolve(rootDir);
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      compileAllLibFiles(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".ts") && entry.name !== "next-env.d.ts") {
      compileToJs(fullPath);
    }
  }
}

compileAllLibFiles("src/lib");

const localStorage = new MemoryStorage();
const sessionStorage = new MemoryStorage();
const browserWindow = {
  localStorage,
  sessionStorage,
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() {},
};

Object.defineProperty(globalThis, "crypto", { value: webcrypto, configurable: true });
Object.defineProperty(globalThis, "window", { value: browserWindow, configurable: true });
Object.defineProperty(globalThis, "localStorage", { value: localStorage, configurable: true });
Object.defineProperty(globalThis, "sessionStorage", { value: sessionStorage, configurable: true });
Object.defineProperty(globalThis, "Event", { value: Event, configurable: true });
Object.defineProperty(globalThis, "Date", { value: Date, configurable: true });
Object.defineProperty(globalThis, "Math", { value: Math, configurable: true });
Object.defineProperty(globalThis, "JSON", { value: JSON, configurable: true });

const localStoragePath = path.resolve(tempDir, "lib/localStorage.js");
const nodeModule = new Module(localStoragePath);
nodeModule.filename = localStoragePath;
nodeModule.paths = Module._nodeModulePaths(path.dirname(localStoragePath));
nodeModule.require = Module.createRequire(localStoragePath);
nodeModule.exports = {};
nodeModule._compile(fs.readFileSync(localStoragePath, "utf8"), localStoragePath);
const store = nodeModule.exports;

store.seedDemoData();
assert.ok(store.getSuppliers().length >= 40);
assert.ok(store.getApprovedProducts().length >= 120);
assert.ok(store.getNotifications().length >= 20);
assert.ok(store.getChatRooms().length >= 8);

store.loginOrCreateUser("admin@gmail.com");
assert.equal(store.getCurrentUser().role, "admin");

store.logout();
const customer = store.loginOrCreateUser("customer@gmail.com", {
  role: "customer",
  fullName: "Sokha Demo Updated",
  phoneNumber: "+85510555666",
  phoneVerified: true,
  nationalId: "199001234567",
  province: "Phnom Penh",
  phoneOrTelegram: "@sokha-demo",
});
assert.equal(customer.role, "customer");
const coffee = store.getProductById("product_1");
store.addToCart(customer.id, coffee);
store.addToCart(customer.id, coffee);
assert.equal(store.getCart(customer.id).items[0].quantity, 2);

const request = store.createOrderRequest({
  customer,
  deliveryLocation: "Phnom Penh",
  notes: "Local verification request",
  items: store.getCart(customer.id).items,
  requestType: "order",
});
assert.equal(request.status, "new");
assert.equal(store.getCart(customer.id).items.length, 0);

store.logout();
const supplier = store.loginOrCreateUser("office.supply@gmail.com");
const submission = store.createProduct(supplier, {
  title: "Demo Cocoa Powder",
  description: "A product created by the automated local data check.",
  category: "Food & Beverage",
  price: 6.5,
  unit: "per pack",
  stockQuantity: 20,
  imageUrl: "",
  location: "Mondulkiri",
});
assert.equal(submission.status, "active");

store.logout();
store.loginOrCreateUser("admin@gmail.com");
assert.equal(store.setProductApproval(submission.id, "active").status, "active");
assert.equal(store.setOrderStatus(request.id, "completed").status, "completed");
assert.ok(store.getApprovedProducts().some((product) => product.id === submission.id));

console.log("Local demo data flows passed.");
