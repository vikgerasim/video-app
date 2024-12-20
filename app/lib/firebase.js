// app/lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// app/lib/firebase.js - Add this function
import { doc, setDoc, writeBatch } from 'firebase/firestore';

export async function setupCategories() {
  const batch = writeBatch(db);

  const categories = {
    carMakes: {
      toyota: { 
        name: 'Toyota',
        models: ['Camry', 'Sienna', 'Tundra', 'Prius']
      },
      lexus: { 
        name: 'Lexus',
        models: ['RX350', 'ES300', 'NX200t', 'NX300h', 'UX250h']
      }
    },
    workTypes: {
      'filter-replacement': { name: 'Filter Replacement' },
      'bulb-replacement': { name: 'Bulb Replacement' },
      'battery-replacement': { name: 'Battery Replacement' },
      'oil-change': { name: 'Oil Change' },
      'maintenance': { name: 'Maintenance' },
      'diagnostics': { name: 'Diagnostics' }
    },
    systemCategories: {
      engine: { name: 'Engine' },
      electrical: { name: 'Electrical' },
      maintenance: { name: 'Maintenance' },
      interior: { name: 'Interior' },
      exterior: { name: 'Exterior' },
      security: { name: 'Key/Security' }
    }
  };

  for (const [category, items] of Object.entries(categories)) {
    for (const [id, data] of Object.entries(items)) {
      batch.set(doc(db, 'categories', category, id), data);
    }
  }

  await batch.commit();
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);