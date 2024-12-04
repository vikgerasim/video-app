import { setupCategories } from './app/lib/firebase';

async function main() {
  try {
    await setupCategories();
    console.log('Categories setup complete');
  } catch (error) {
    console.error('Setup failed:', error);
  }
  process.exit();
}

main();