import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from './serviceAccountKey.json';

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function setupCategories() {
  const batch = db.batch();

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
      const ref = db.collection('categories').doc(category).collection('items').doc(id);
      batch.set(ref, data);
    }
  }

  await batch.commit();
  console.log('Categories setup complete');
}

setupCategories()
  .then(() => {
    console.log('Setup completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Setup failed:', error);
    process.exit(1);
  });