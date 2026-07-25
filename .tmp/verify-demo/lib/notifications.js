"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markNotificationRead = exports.addNotification = exports.getNotifications = void 0;
var localStorage_1 = require("./localStorage");
Object.defineProperty(exports, "getNotifications", { enumerable: true, get: function () { return localStorage_1.getNotifications; } });
Object.defineProperty(exports, "addNotification", { enumerable: true, get: function () { return localStorage_1.addNotification; } });
Object.defineProperty(exports, "markNotificationRead", { enumerable: true, get: function () { return localStorage_1.markNotificationRead; } });
