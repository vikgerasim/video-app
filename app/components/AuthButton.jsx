// components/AuthButton.jsx
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, signInWithGoogle, handleSignOut } from '@/lib/auth'

export default function AuthButton() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  if (loading) return <div className="animate-pulse">Loading...</div>

  return (
    <button
      onClick={user ? handleSignOut : signInWithGoogle}
      className="px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
    >
      {user ? 'Sign Out' : 'Sign in with Google'}
    </button>
  )
}