"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.startChat = exports.getMessages = exports.getChatRooms = void 0;
var localStorage_1 = require("./localStorage");
Object.defineProperty(exports, "getChatRooms", { enumerable: true, get: function () { return localStorage_1.getChatRooms; } });
Object.defineProperty(exports, "getMessages", { enumerable: true, get: function () { return localStorage_1.getMessages; } });
Object.defineProperty(exports, "startChat", { enumerable: true, get: function () { return localStorage_1.startChat; } });
Object.defineProperty(exports, "sendMessage", { enumerable: true, get: function () { return localStorage_1.sendMessage; } });
