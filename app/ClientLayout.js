// app/ClientLayout.js (Client Component)
'use client';

import { AuthProvider } from '@/app/context/AuthContext'
import Navbar from '@/app/components/layout/NavBar'
import Footer from '@/app/components/layout/Footer'

export default function ClientLayout({ children }) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}