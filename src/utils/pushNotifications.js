
import { messaging } from "./firebase";
import { getToken, onMessage } from "firebase/messaging";

export async function requestPermissionAndGetToken() {
  if (!messaging) return null;
  try {
    const token = await getToken(messaging, { vapidKey: import.meta.env.VITE_FCM_VAPID });
    return token;
  } catch (e) {
    console.error("FCM error", e);
    return null;
  }
}

export function listenForegroundMessages(cb) {
  if (!messaging) return;
  onMessage(messaging, payload => cb(payload));
}
