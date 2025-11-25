
import { messaging } from "./firebase";
import { getToken, onMessage } from "firebase/messaging";


export async function requestFCMPermissionAndGetToken() {
  if (!messaging) return null;
  try {
    const token = await getToken(messaging, { vapidKey: import.meta.env.VITE_FCM_VAPID });
    return token;
  } catch (e) {
    console.error("FCM token error", e);
    return null;
  }
}


export function listenToForegroundMessages(cb) {
  if (!messaging) return;
  onMessage(messaging, payload => cb(payload));
}
