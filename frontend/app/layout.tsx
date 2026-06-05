import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';

export const metadata: Metadata = {
  title: 'ZA Lift Club - Safe & Affordable Long Distance Travel',
  description: 'Connect with verified drivers and passengers traveling between South African cities.',
  keywords: 'ride sharing, carpool, South Africa, travel, long distance',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, -apple-system, sans-serif', margin: 0 }}>
        <Navbar />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
            © 2026 ZA Lift Club. Safe & affordable travel across South Africa 🇿🇦
          </div>
        </footer>
      </body>
    </html>
  );
}
