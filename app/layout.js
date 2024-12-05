import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/app/context/AuthContext";
import  AppLayout from "@/app/components/layout/AppLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Video Sharing Platform",
  description: "Share and watch videos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <AuthProvider>
          <AppLayout>{children}</AppLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
