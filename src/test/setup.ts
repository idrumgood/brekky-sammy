import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Firebase
vi.mock('firebase/app', () => ({
    initializeApp: vi.fn(),
    getApps: vi.fn(() => []),
    getApp: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
    getFirestore: vi.fn(),
    collection: vi.fn(() => ({ id: 'mock-collection' })),
    doc: vi.fn(() => ({ id: 'mock-doc-id' })),
    runTransaction: vi.fn(),
    serverTimestamp: vi.fn(),
    getDocs: vi.fn().mockResolvedValue({ docs: [] }),
    setDoc: vi.fn(),
    updateDoc: vi.fn(),
    getDoc: vi.fn().mockResolvedValue({ exists: () => false, data: () => ({}) }),
    query: vi.fn(),
    orderBy: vi.fn(),
}));

vi.mock('firebase/storage', () => ({
    getStorage: vi.fn(),
    ref: vi.fn(),
    uploadBytes: vi.fn().mockResolvedValue({ ref: 'mock-storage-ref' }),
    getDownloadURL: vi.fn().mockResolvedValue('mock-download-url'),
}));

// Global mock for our internal firebase lib to be 100% safe
vi.mock('@/lib/firebase', () => ({
    db: { type: 'firestore' },
    auth: { type: 'auth' },
    storage: { type: 'storage' },
}));
