import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [profile, setProfile] = useState(null) // firestore user document (name, phone, role)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        const snap = await getDoc(doc(db, 'users', user.uid))
        setProfile(snap.exists() ? snap.data() : null)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function register({ name, phone, email, password }) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: name })
    // role يُحدَّد دائماً كـ "customer" هنا؛ رفعه إلى admin يتم فقط يدوياً من طرف المطور عبر Firebase Console
    await setDoc(doc(db, 'users', cred.user.uid), {
      name,
      phone,
      email,
      role: 'customer',
      createdAt: serverTimestamp(),
    })
    setProfile({ name, phone, email, role: 'customer' })
    return cred.user
  }

  async function login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    const snap = await getDoc(doc(db, 'users', cred.user.uid))
    setProfile(snap.exists() ? snap.data() : null)
    return cred.user
  }

  function logout() {
    return signOut(auth)
  }

  const isAdmin = profile?.role === 'admin'

  const value = { currentUser, profile, isAdmin, loading, register, login, logout }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
