import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAee7W7xzn391WNUgN2lmWo5WkLrPwbST4",
  authDomain: "app-projeto-a3.firebaseapp.com",
  projectId: "app-projeto-a3",
  storageBucket: "app-projeto-a3.appspot.com",
  messagingSenderId: "165712366045",
  appId: "1:165712366045:web:a5353d8c68c2cb739d8e34"
};



const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const db = app.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();
// Sign in and check or create account in firestore
const signInWithGoogle = async () => {
  try {
    const response = await auth.signInWithPopup(googleProvider);
    console.log(response.user);
    const user = response.user;
    console.log(`User ID - ${user.uid}`);
    const querySnapshot = await db
      .collection("users")
      .where("uid", "==", user.uid)
      .get();
    if (querySnapshot.docs.length === 0) {
      // create a new user
      await db.collection("users").add({
        uid: user.uid,
        enrolledClassrooms: [],
      });
    }
  } catch (err) {
    alert(err.message);
  }
};
const logout = () => {
  auth.signOut();
};

export { app, auth, db, signInWithGoogle, logout };
