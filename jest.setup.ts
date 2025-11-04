/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from 'util';

class LocalStorageMock {
    private store: Record<string, string> = {};
    clear() { this.store = {}; }
    getItem(key: string) { return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null; }
    setItem(key: string, value: string) { this.store[key] = String(value); }
    removeItem(key: string) { delete this.store[key]; }
}

if (typeof globalThis.localStorage === 'undefined') {
    (globalThis as any).localStorage = new LocalStorageMock();
}

if (typeof (globalThis as any).TextEncoder === 'undefined') {
    (globalThis as any).TextEncoder = TextEncoder as any;
}
if (typeof (globalThis as any).TextDecoder === 'undefined') {
    (globalThis as any).TextDecoder = TextDecoder as any;
}

beforeEach(() => {
    (globalThis as any).localStorage?.clear();
});

afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
});

// Só toca em window (ex.: matchMedia) quando window estiver definido (jsdom)
if (typeof window !== 'undefined' && typeof window.matchMedia === 'undefined') {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: jest.fn(), // deprecated
            removeListener: jest.fn(),
            addEventListener: jest.fn(),// deprecated
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        })),
    });
}