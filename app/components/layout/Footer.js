// app/components/layout/Footer.js
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 w-full mt-auto">
      <div className="container mx-auto px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold mb-4">VG Automotive</h3>
            <p className="text-gray-600">Share and discover amazing videos</p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><a href="https://www.youtube.com/@Viktor_G_Automotive" className="text-gray-600 hover:text-gray-900">YouTube</a></li>
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
