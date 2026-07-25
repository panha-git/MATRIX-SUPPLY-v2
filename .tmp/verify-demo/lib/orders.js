"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setOrderStatus = exports.createOrderRequest = exports.getOrderRequests = void 0;
var localStorage_1 = require("./localStorage");
Object.defineProperty(exports, "getOrderRequests", { enumerable: true, get: function () { return localStorage_1.getOrderRequests; } });
Object.defineProperty(exports, "createOrderRequest", { enumerable: true, get: function () { return localStorage_1.createOrderRequest; } });
Object.defineProperty(exports, "setOrderStatus", { enumerable: true, get: function () { return localStorage_1.setOrderStatus; } });
