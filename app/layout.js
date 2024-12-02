// app/layout.js

import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/app/context/AuthContext'
import Navbar from '@/app/components/layout/NavBar' // Corrected casing
import Footer from '@/app/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Video Sharing Platform',
  description: 'Share and watch videos',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}