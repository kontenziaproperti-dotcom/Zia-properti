import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '@/firebase-applet-config.json';

// Explicit target Firestore Database ID from configuration
export const FIRESTORE_DATABASE_ID =
  (firebaseConfig as any)?.firestoreDatabaseId || 'ai-studio-e7e5e0b2-3070-42b3-b698-ab325ea50bb7';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: Always pass the named database ID to getFirestore, never fall back to default '(default)'
export const db = getFirestore(app, FIRESTORE_DATABASE_ID);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function getFirestoreFailureMessage(error: unknown): string {
  const code = error && typeof error === 'object' && 'code' in error
    ? String((error as { code?: unknown }).code || '')
    : '';

  if (code === 'permission-denied') {
    return 'Perubahan belum tersimpan: Firebase menolak akses database. Pastikan Anda masuk dengan akun yang berwenang dan aturan Firestore telah diterapkan pada database yang digunakan website.';
  }
  if (code === 'unauthenticated') {
    return 'Sesi Firebase tidak aktif. Silakan keluar dari CMS, masuk kembali, lalu ulangi perubahan.';
  }
  if (code === 'unavailable' || code === 'deadline-exceeded') {
    return 'Database sedang tidak dapat dijangkau. Periksa koneksi internet lalu coba kembali.';
  }
  if (code === 'not-found') {
    return 'Data yang akan diperbarui tidak ditemukan di database.';
  }
  return 'Gagal menyimpan perubahan ke database. Tidak ada perubahan yang dinyatakan berhasil.';
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const code = error && typeof error === 'object' && 'code' in error
    ? String((error as { code?: unknown }).code || 'unknown')
    : 'unknown';

  // Keep diagnostics useful without logging administrator email or provider data.
  console.error('Firestore operation failed:', {
    code,
    operationType,
    path,
    authenticated: !!auth.currentUser
  });

  throw new Error(getFirestoreFailureMessage(error));
}

export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firestore] Offline mode active or checking connection.');
    }
  }
}

// Test initial connection as per skill instructions
if (typeof window !== 'undefined') {
  testConnection();
}

export default app;
