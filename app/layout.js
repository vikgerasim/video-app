import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/app/context/AuthContext'
import Navbar from '@/app/components/layout/NavBar'
import Sidebar from '@/app/components/layout/Sidebar'
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
            <Navbar className="z-40" />
            <div className="flex flex-grow">
              <Sidebar />
              <main className="transition-all duration-300 flex-grow pl-16 mt-16 lg:pl-60 px-4 py-8">
                {children}
              </main>
            </div>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}