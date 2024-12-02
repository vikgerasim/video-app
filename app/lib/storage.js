// app/lib/storage.js
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase';

const storage = getStorage();

export async function uploadVideo(file, metadata, userId) {
  const storageRef = ref(storage, `videos/${userId}/${Date.now()}-${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed',
      null,
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        const videoDoc = await addDoc(collection(db, 'videos'), {
          ...metadata,
          userId,
          url,
          createdAt: new Date().toISOString(),
          views: 0,
          likes: 0
        });
        resolve(videoDoc.id);
      }
    );
  });
}