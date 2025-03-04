import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJo7W6NhDkFyMJv4vO3Hd9GaRPCBljrWw",
  authDomain: "sinatra-ccap.firebaseapp.com",
  projectId: "sinatra-ccap",
  storageBucket: "sinatra-ccap.firebasestorage.app",
  messagingSenderId: "628301408266",
  appId: "1:628301408266:web:fd46a78ab927033bc597f3",
  measurementId: "G-FHPB4FR785"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
export default app;