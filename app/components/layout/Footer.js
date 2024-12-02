// app/components/layout/Footer.js
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 w-full mt-12 px-8 pt-8 -mr-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold mb-4">VG Automotive</h3>
            <p className="text-gray-600">Share and discover amazing videos</p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link></li>
              <li><Link href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Twitter</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Instagram</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">YouTube</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-gray-600">
          <p>&copy; {new Date().getFullYear()} VG Automotive All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
