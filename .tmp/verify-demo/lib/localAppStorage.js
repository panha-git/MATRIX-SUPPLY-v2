"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLATFORM_CHANGED_EVENT = exports.STORAGE_PREFIX = void 0;
exports.readLocal = readLocal;
exports.writeLocal = writeLocal;
exports.makeId = makeId;
exports.resetLocalAppStorage = resetLocalAppStorage;
exports.STORAGE_PREFIX = "matrix-supply-cambodia:";
exports.PLATFORM_CHANGED_EVENT = "matrix-supply-cambodia:changed";
function readLocal(key, fallback) {
    if (typeof window === "undefined")
        return fallback;
    try {
        return JSON.parse(localStorage.getItem(exports.STORAGE_PREFIX + key) || "");
    }
    catch {
        return fallback;
    }
}
function writeLocal(key, value) {
    if (typeof window === "undefined")
        return;
    localStorage.setItem(exports.STORAGE_PREFIX + key, JSON.stringify(value));
    window.dispatchEvent(new Event(exports.PLATFORM_CHANGED_EVENT));
}
function makeId(prefix) {
    return `${prefix}_${globalThis.crypto?.randomUUID?.() || `${Date.now()}_${Math.random().toString(36).slice(2)}`}`;
}
function resetLocalAppStorage() {
    if (typeof window === "undefined")
        return;
    Object.keys(localStorage).filter(k => k.startsWith(exports.STORAGE_PREFIX) || k.startsWith("matrix-supply-v2:")).forEach(k => localStorage.removeItem(k));
    sessionStorage.clear();
    window.dispatchEvent(new Event(exports.PLATFORM_CHANGED_EVENT));
}
