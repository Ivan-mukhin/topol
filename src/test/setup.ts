import '@testing-library/jest-dom';

// Mock IntersectionObserver for tests (use globalThis to satisfy TS in ESM)
const globalWithIO = globalThis as typeof globalThis & {
    IntersectionObserver?: typeof IntersectionObserver;
};

globalWithIO.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    takeRecords() {
        return [];
    }
    unobserve() {}
} as any;






