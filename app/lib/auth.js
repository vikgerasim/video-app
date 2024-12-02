// lib/auth.js
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from './firebase'

export const auth = getAuth()
const provider = new GoogleAuthProvider()

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    await createUserProfile(user)
    return user
  } catch (error) {
    console.error('Error signing in:', error)
    throw error
  }
}

export const createUserProfile = async (user) => {
  const userRef = doc(db, 'users', user.uid)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: new Date().toISOString()
    })
  }
}

export const handleSignOut = () => signOut(auth)



