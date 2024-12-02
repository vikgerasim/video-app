'use client';

import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignIn() {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [isSignUp, setIsSignUp] = useState(false);
 const router = useRouter();

 const handleEmailSubmit = async (e) => {
   e.preventDefault();
   try {
     if (isSignUp) {
       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
       await setDoc(doc(db, 'users', userCredential.user.uid), {
         email: userCredential.user.email,
         createdAt: new Date().toISOString(),
         isAdmin: false
       });
     } else {
       await signInWithEmailAndPassword(auth, email, password);
     }
     router.push('/');
   } catch (error) {
     console.error('Auth error:', error);
     alert(error.message);
   }
 };

 const handleGoogleSignIn = async () => {
   try {
     const provider = new GoogleAuthProvider();
     const result = await signInWithPopup(auth, provider);
     await setDoc(doc(db, 'users', result.user.uid), {
       email: result.user.email,
       createdAt: new Date().toISOString(),
       isAdmin: false
     }, { merge: true });
     router.push('/');
   } catch (error) {
     console.error('Google sign in error:', error);
     alert(error.message);
   }
 };

 return (
   <div className="min-h-screen flex items-center justify-center">
     <div className="p-8 bg-white rounded-lg shadow-md w-96">
       <h1 className="text-2xl font-bold mb-6 text-center">
         {isSignUp ? 'Create Account' : 'Sign In'}
       </h1>
       
       <form onSubmit={handleEmailSubmit} className="space-y-4">
         <div>
           <label className="block text-sm font-medium mb-2">Email</label>
           <input
             type="email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             className="w-full p-2 border rounded"
             required
           />
         </div>

         <div>
           <label className="block text-sm font-medium mb-2">Password</label>
           <input
             type="password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             className="w-full p-2 border rounded"
             required
           />
         </div>

         <button 
           type="submit"
           className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
         >
           {isSignUp ? 'Sign Up' : 'Sign In'}
         </button>
       </form>

       <div className="mt-4 text-center text-gray-500">or</div>

       <button
         onClick={handleGoogleSignIn}
         className="w-full mt-4 flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
       >
         <img
           src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
           alt="Google"
           className="w-5 h-5"
         />
         Sign in with Google
       </button>

       <button 
         onClick={() => setIsSignUp(!isSignUp)}
         className="w-full mt-4 text-blue-600 hover:text-blue-800"
       >
         {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
       </button>
     </div>
   </div>
 );
}