// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAyxH4oqMquwa6dBXdnOgXtB_N09hSyx4M",
  authDomain: "chatappbatuhan.firebaseapp.com",
  projectId: "chatappbatuhan",
  storageBucket: "chatappbatuhan.firebasestorage.app",
  messagingSenderId: "415778838270",
  appId: "1:415778838270:web:80682c12bcfe03eeddf7af",
  measurementId: "G-JTC3J1SB5C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);



const createUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


const updateUser = async (name: string, photoURL: string) => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('User not found');
  }
  try {
    await updateProfile(currentUser, { displayName: name, photoURL: photoURL });
    return currentUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


const getUser = async () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); // sadece bir kere dinle
      resolve(user);
    }, reject);
  });


};

function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); // sadece bir kere dinle
      resolve(user);
    }, reject);
  });
}



export { createUser, signIn, updateUser, getUser ,auth ,getCurrentUser};


