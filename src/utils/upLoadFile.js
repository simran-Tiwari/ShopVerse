
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";


export function uploadFileWithProgress(file, pathPrefix = "chat_files") {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error("No file provided"));
    const path = `${pathPrefix}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      snapshot => {
       
      },
      error => reject(error),
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({ url, path: uploadTask.snapshot.ref.fullPath });
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

/**
 * Simple helper to upload without progress tracking:
 * await uploadFile(file) -> returns { url, path }
 */
export async function uploadFile(file, pathPrefix = "chat_files") {
  return uploadFileWithProgress(file, pathPrefix);
}
