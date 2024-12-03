<<<<<<< HEAD
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase';
=======
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";
>>>>>>> f5a50e810a42ce4ee928a68283b7987cfba7745e

const storage = getStorage();

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_VIDEO_TYPES = [
<<<<<<< HEAD
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime'
=======
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
>>>>>>> f5a50e810a42ce4ee928a68283b7987cfba7745e
];

export class VideoUploadError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

export async function uploadVideo(file, metadata, userId, onProgress) {
  // Validate file
  if (!file) {
<<<<<<< HEAD
    throw new VideoUploadError('No file provided', 'no_file');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new VideoUploadError('File size exceeds 100MB limit', 'file_too_large');
  }

  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    throw new VideoUploadError('Invalid file type. Please upload a valid video file', 'invalid_file_type');
  }

  // Create unique filename
  const fileExtension = file.name.split('.').pop();
  const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substr(2)}.${fileExtension}`;
=======
    throw new VideoUploadError("No file provided", "no_file");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new VideoUploadError(
      "File size exceeds 100MB limit",
      "file_too_large"
    );
  }

  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    throw new VideoUploadError(
      "Invalid file type. Please upload a valid video file",
      "invalid_file_type"
    );
  }

  // Create unique filename
  const fileExtension = file.name.split(".").pop();
  const uniqueFileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substr(2)}.${fileExtension}`;
>>>>>>> f5a50e810a42ce4ee928a68283b7987cfba7745e
  const storageRef = ref(storage, `videos/${userId}/${uniqueFileName}`);

  // Set metadata
  const videoMetadata = {
    contentType: file.type,
    customMetadata: {
<<<<<<< HEAD
      originalFileName: file.name
    }
=======
      originalFileName: file.name,
    },
>>>>>>> f5a50e810a42ce4ee928a68283b7987cfba7745e
  };

  const uploadTask = uploadBytesResumable(storageRef, file, videoMetadata);

  return new Promise((resolve, reject) => {
<<<<<<< HEAD
    uploadTask.on('state_changed',
      // Progress handler
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
=======
    uploadTask.on(
      "state_changed",
      // Progress handler
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
>>>>>>> f5a50e810a42ce4ee928a68283b7987cfba7745e
        if (onProgress) {
          onProgress({
            progress,
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
<<<<<<< HEAD
            state: snapshot.state
=======
            state: snapshot.state,
>>>>>>> f5a50e810a42ce4ee928a68283b7987cfba7745e
          });
        }
      },
      // Error handler
      (error) => {
        switch (error.code) {
<<<<<<< HEAD
          case 'storage/unauthorized':
            reject(new VideoUploadError('Unauthorized to upload file', 'unauthorized'));
            break;
          case 'storage/canceled':
            reject(new VideoUploadError('Upload cancelled', 'cancelled'));
            break;
          case 'storage/unknown':
          default:
            reject(new VideoUploadError('An error occurred during upload', error.code));
=======
          case "storage/unauthorized":
            reject(
              new VideoUploadError(
                "Unauthorized to upload file",
                "unauthorized"
              )
            );
            break;
          case "storage/canceled":
            reject(new VideoUploadError("Upload cancelled", "cancelled"));
            break;
          case "storage/unknown":
          default:
            reject(
              new VideoUploadError(
                "An error occurred during upload",
                error.code
              )
            );
>>>>>>> f5a50e810a42ce4ee928a68283b7987cfba7745e
            break;
        }
      },
      // Success handler
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
<<<<<<< HEAD
          
          const videoDoc = await addDoc(collection(db, 'videos'), {
=======

          const videoDoc = await addDoc(collection(db, "videos"), {
>>>>>>> f5a50e810a42ce4ee928a68283b7987cfba7745e
            ...metadata,
            userId,
            url,
            fileName: uniqueFileName,
            originalFileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            views: 0,
            likes: 0,
<<<<<<< HEAD
            status: 'published'
=======
            status: "published",
>>>>>>> f5a50e810a42ce4ee928a68283b7987cfba7745e
          });

          resolve({
            id: videoDoc.id,
            url,
<<<<<<< HEAD
            fileName: uniqueFileName
          });
        } catch (error) {
          reject(new VideoUploadError('Failed to save video metadata', 'metadata_error'));
=======
            fileName: uniqueFileName,
          });
        } catch (error) {
          reject(
            new VideoUploadError(
              "Failed to save video metadata",
              "metadata_error"
            )
          );
>>>>>>> f5a50e810a42ce4ee928a68283b7987cfba7745e
        }
      }
    );
  });
}

// Optional: Add a function to cancel ongoing uploads
export function cancelUpload(uploadTask) {
<<<<<<< HEAD
  if (uploadTask && typeof uploadTask.cancel === 'function') {
    uploadTask.cancel();
  }
}
=======
  if (uploadTask && typeof uploadTask.cancel === "function") {
    uploadTask.cancel();
  }
}
>>>>>>> f5a50e810a42ce4ee928a68283b7987cfba7745e
