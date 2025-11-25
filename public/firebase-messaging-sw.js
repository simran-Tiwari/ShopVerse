// public/firebase-messaging-sw.js
/* eslint-disable no-undef */
// Service worker for FCM background notifications.
// Put actual firebaseConfig values before deploying or generate during build.
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: '<REPLACE>',
  authDomain: '<REPLACE>',
  projectId: '<REPLACE>',
  storageBucket: '<REPLACE>',
  messagingSenderId: '<REPLACE>',
  appId: '<REPLACE>'
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title || 'Shopverse';
  const notificationOptions = {
    body: payload.notification.body || '',
    icon: '/icons/icon-192.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
