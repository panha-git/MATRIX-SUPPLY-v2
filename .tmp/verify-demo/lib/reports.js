"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setReportStatus = exports.createReport = exports.getReports = void 0;
var localStorage_1 = require("./localStorage");
Object.defineProperty(exports, "getReports", { enumerable: true, get: function () { return localStorage_1.getReports; } });
Object.defineProperty(exports, "createReport", { enumerable: true, get: function () { return localStorage_1.createReport; } });
Object.defineProperty(exports, "setReportStatus", { enumerable: true, get: function () { return localStorage_1.setReportStatus; } });
