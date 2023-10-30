import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import { useState, useEffect } from "react";
import { app, database } from "./firebase";
import { addDoc, collection } from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { initializeAuth, getReactNativePesistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'

// web

// device/ emulator

const auth = getAuth(app);

export default function App() {
  // vi laver 2 consts til at gemme vores data lokalt.
  const [enteredEmail, setEnteredEmail] = useState("bjmn93@gmail.com");
  const [enteredPassword, setEnteredPassword] = useState("Gibson0110");
  const [userId, setUserId] = useState(null);
  const [enteredDocumentText, setEnteredDocumentText] = useState("Type here");

  // Denne useEffect will only run after the component mounts, bercause of the empty dependency array.
  useEffect(() => {
    const auth_ = getAuth(); // This line initializes an instance of the Firebase Authentication service and stores it in the auth_ constant.
    const unsubscribe = onAuthStateChanged(auth_, (currentUser) => {
      // Here, the onAuthStateChanged function sets up an observer on the Firebase Authentication state. Whenever a user signs in or out, the callback function provided to onAuthStateChanged will be triggered.
      // hvis currentUser eksistere så:
      if (currentUser) {
        setUserId(currentUser.uid);
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe(); // kaldes når komponenten unmountes. This is the cleanup function for the useEffect. When the component using this hook unmounts (i.e., is removed from the UI), this function will run. In this case, it's calling the unsubscribe function, which will stop the observer set up by onAuthStateChanged from listening to authentication state changes. This is important to prevent memory leaks and unnecessary operations after the component is gone.
  }, []);

  // Metode til at add new document i firebase.
  // den skal være async fordi det kan tage lidt tid at snakke med serveren.
  async function addDocument() {
    try {
      await addDoc(collection(database, userId), {
        text: enteredDocumentText,
      });
    } catch (error) {
      console.log("Error in addDocument: " + error);
    }
  }

  // METODE TIL LOGIN
  async function login() {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        enteredEmail,
        enteredPassword
      );
      console.log("Logged in as user: " + userCredential.user.uid);
    } catch (error) {
      alert("Login error: " + error.response.data.error.errors[0].message);
    }
  }

  //METODE TIL SIGN UP AF NYE BRUGERE
  async function signup() {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        enteredEmail,
        enteredPassword
      );
      console.log("Oprettet ny bruger: " + userCredential.user.uid);
    } catch (error) {
      console.log("Login error: " + error);
    }
  }

  async function sign_out() {
    await signOut(auth);
  }

  return (
    <View style={styles.container}>
      {!userId && ( // betyder at hvis der ikke er noget userId, så && (render nedenstående er hvad && betyder)
        // vi ser kun det her når vi IKKE er logget ind
        <>
          <Text>Login</Text>

          <TextInput
            onChangeText={(newText) => setEnteredEmail(newText)}
            value={enteredEmail}
          ></TextInput>

          <TextInput
            onChangeText={(newText) => setEnteredPassword(newText)}
            value={enteredPassword}
          ></TextInput>

          <Button title="Log in" onPress={login} />

          <TextInput
            onChangeText={(newText) => setEnteredEmail(newText)}
            value={enteredEmail}
          ></TextInput>

          <TextInput
            onChangeText={(newText) => setEnteredPassword(newText)}
            value={enteredPassword}
          ></TextInput>

          <Button title="Sign Up" onPress={signup} />
        </>
      )}

      {userId && ( // vi ser kun det her når vi er logget ind
        <>
          <TextInput
            onChangeText={(newText) => setEnteredDocumentText(newText)}
            value={enteredDocumentText}
          ></TextInput>

          <Button title="Add New Document" onPress={addDocument} />

          <Button title="Sign Out" onPress={sign_out} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
