import React, { useState, useEffect, useContext, createContext } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth'

//initialize Firebase
firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID 
})

const AuthContext = createContext()

// Hook for child components to get the auth object...
// ...and re-render when it chantes
export const useAuth = () => {
  return useContext(AuthContext)
}

// Provider hook that creates auth object and handles state
export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null)
  const [isAuthenticating, setIsAuthenticating] = useState(true)

  const sendSignInLinkToEmail = email => {
    return firebase
      .auth()
      .sendSignInLinkToEmail(email, { 
      url: 'http://localhost:3000/confirm',
      handleCodeInApp: true,
      })
      .then(() => {
      return true
    });
  };

  const signInWithEmailLink = (email, code) => {
    return firebase
      .auth()
      .signInWithEmailLink(email, code)
      .then(result => {
        setUser(result.user);
        return true;
    });
  };

  const logout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null);
    });
  };

  //Subscribe to user on mount
  // Because this sets state in the callback it will cause
  // any component that utilizes this hook to re-render with the latest auth object
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      setUser(user)
      setIsAuthenticating(false)
    })

    //cleanup subscription on unmount
    return () => unsubscribe()

  },[]);

  const values = {
    user, 
    isAuthenticating,
    sendSignInLinkToEmail,
    signInWithEmailLink,
    logout
  }

  return (
    <AuthContext.Provider value={values}>
      {!isAuthenticating && children}
    </AuthContext.Provider>
  )

}