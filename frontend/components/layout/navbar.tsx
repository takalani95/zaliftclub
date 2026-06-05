'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Car, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Car className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">ZA Lift Club</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/search" className={cn('text-sm font-medium transition-colors', pathname === '/search' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900')}>
              Find a Ride
            </Link>
            {user?.user_type === 'driver' && (
              <Link href="/driver" className={cn('text-sm font-medium transition-colors', pathname.startsWith('/driver') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900')}>
                Driver Dashboard
              </Link>
            )}
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <LayoutDashboard className="h-4 w-4 mr-1" />
                    My Trips
                  </Button>
                </Link>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                  {user.first_name?.[0]}{user.last_name?.[0]}
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth"><Button variant="outline" size="sm">Login</Button></Link>
                <Link href="/auth?tab=register"><Button size="sm">Sign Up</Button></Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-3">
          <Link href="/search" className="block text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>Find a Ride</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="block text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>My Trips</Link>
              {user.user_type === 'driver' && (
                <Link href="/driver" className="block text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>Driver Dashboard</Link>
              )}
              <button onClick={handleLogout} className="block text-sm font-medium text-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link href="/auth" className="block text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/auth?tab=register" className="block text-sm font-medium text-blue-600" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
