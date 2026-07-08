import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import fs from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
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
}

const source = fs.readFileSync("src/lib/localStorage.ts", "utf8");
const output = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;

const localStorage = new MemoryStorage();
const sessionStorage = new MemoryStorage();
const browserWindow = {
  localStorage,
  sessionStorage,
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() {},
};
const testModule = { exports: {} };
const commonJsRequire = createRequire(import.meta.url);
const context = vm.createContext({
  module: testModule,
  exports: testModule.exports,
  require: commonJsRequire,
  console,
  crypto: webcrypto,
  window: browserWindow,
  Event,
  Date,
  Math,
  JSON,
});

vm.runInContext(output, context, { filename: "localStorage.js" });
const store = testModule.exports;

store.seedDemoData();
assert.equal(store.getCurrentUser().role, "admin");
assert.equal(store.getApprovedProducts().length, 3);
assert.equal(
  store.getProducts().filter((product) => product.status === "pending").length,
  1,
);

store.logout();
const customer = store.loginOrCreateUser("customer@gmail.com", {
  role: "customer",
  fullName: "Sokha Demo Updated",
  phoneOrTelegram: "@sokha-demo",
});
assert.equal(customer.role, "customer");
const coffee = store.getProductById("product_demo_coffee");
store.addToCart(customer.id, coffee);
store.addToCart(customer.id, coffee);
assert.equal(store.getCart(customer.id).items[0].quantity, 2);

const request = store.createOrderRequest({
  customer,
  deliveryLocation: "Phnom Penh",
  notes: "Local verification request",
  items: store.getCart(customer.id).items,
});
assert.equal(request.status, "new");
assert.equal(store.getCart(customer.id).items.length, 0);

store.logout();
const supplier = store.loginOrCreateUser("mekongcoffee@gmail.com");
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
assert.equal(submission.status, "pending");

store.logout();
store.loginOrCreateUser("admin@gmail.com");
assert.equal(
  store.setProductApproval(submission.id, "approved").status,
  "approved",
);
assert.equal(store.setOrderStatus(request.id, "reviewed").status, "reviewed");
assert.ok(
  store.getApprovedProducts().some((product) => product.id === submission.id),
);

console.log("Local demo data flows passed.");
