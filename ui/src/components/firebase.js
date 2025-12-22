import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC9_ydhjHLdKJ_GReay_hHV1zj9-CCyQ2s",
    authDomain: "recipe-c4973.firebaseapp.com",
    projectId: "recipe-c4973",
    storageBucket: "recipe-c4973.firebasestorage.app",
    messagingSenderId: "748549233624",
    appId: "1:748549233624:web:1477d76f95458fb1fa70ad"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
export default app;