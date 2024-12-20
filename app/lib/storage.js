import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase';

const storage = getStorage();

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime'
];

export class VideoUploadError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

export async function uploadVideo(file, metadata, userId, onProgress) {
  if (!file) {
    throw new VideoUploadError('No file provided', 'no_file');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new VideoUploadError('File size exceeds 100MB limit', 'file_too_large');
  }

  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    throw new VideoUploadError('Invalid file type. Please upload a valid video file', 'invalid_file_type');
  }

  const fileExtension = file.name.split('.').pop();
  const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substr(2)}.${fileExtension}`;
  const storageRef = ref(storage, `videos/${userId}/${uniqueFileName}`);

  const videoMetadata = {
    contentType: file.type,
    customMetadata: {
      originalFileName: file.name
    }
  };

  const uploadTask = uploadBytesResumable(storageRef, file, videoMetadata);

  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress({
            progress,
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            state: snapshot.state
          });
        }
      },
      (error) => {
        switch (error.code) {
          case 'storage/unauthorized':
            reject(new VideoUploadError('Unauthorized to upload file', 'unauthorized'));
            break;
          case 'storage/canceled':
            reject(new VideoUploadError('Upload cancelled', 'cancelled'));
            break;
          case 'storage/unknown':
          default:
            reject(new VideoUploadError('An error occurred during upload', error.code));
            break;
        }
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          
          const videoDoc = await addDoc(collection(db, 'videos'), {
            title: metadata.title,
            description: metadata.description || '',
            userId,
            url,
            fileName: uniqueFileName,
            originalFileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            thumbnailUrl: metadata.thumbnailUrl || '',
            embedUrl: metadata.embedUrl || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            views: 0,
            likes: [],
            status: 'published',
            categories: {
              carMake: metadata.carMake || '',
              carModel: metadata.carModel || '',
              yearRange: metadata.yearRange || '',
              workType: metadata.workType || '',
              systemCategory: metadata.systemCategory || ''
            }
          });

          resolve({
            id: videoDoc.id,
            url,
            fileName: uniqueFileName
          });
        } catch (error) {
          reject(new VideoUploadError('Failed to save video metadata', 'metadata_error'));
        }
      }
    );
  });
}

export function cancelUpload(uploadTask) {
  if (uploadTask && typeof uploadTask.cancel === 'function') {
    uploadTask.cancel();
  }
}