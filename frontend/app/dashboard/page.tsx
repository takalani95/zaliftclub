'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Car, Calendar, MapPin, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/auth-store';
import api from '@/lib/api';
import { formatPrice, formatDate, formatTime } from '@/lib/utils';

const statusColor: Record<string, any> = {
  confirmed: 'success', pending: 'warning',
  cancelled: 'destructive', completed: 'default',
};

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/auth'); return; }
    api.get('/bookings')
      .then(({ data }) => setBookings(data))
      .finally(() => setLoading(false));
  }, [user]);

  const cancelBooking = async (id: string) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await api.delete(`/bookings/${id}`, { data: { reason: 'Cancelled by passenger' } });
      setBookings(b => b.map(bk => bk.id === id ? { ...bk, status: 'cancelled' } : bk));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.first_name}! 👋
          </h1>
          <p className="text-gray-500">Manage your trips and bookings</p>
        </div>
        <Button onClick={() => router.push('/search')}>
          <Car className="mr-2 h-4 w-4" /> Find a Ride
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Bookings', value: bookings.length },
          { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length },
          { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : bookings.length === 0 ? (
            <div className="p-16 text-center">
              <div className="text-5xl mb-4">🚗</div>
              <p className="text-gray-500 mb-4">No bookings yet</p>
              <Button onClick={() => router.push('/search')}>Find your first ride</Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {bookings.map((booking, i) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-6"
                >
                  <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={statusColor[booking.status] || 'default'}>
                          {booking.status}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {booking.seats_booked} seat{booking.seats_booked > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{booking.trip?.departure_city}</span>
                          <span className="text-gray-400">→</span>
                          <span className="font-medium">{booking.trip?.destination_city}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {booking.trip ? formatDate(booking.trip.departure_date) : ''}
                          <Clock className="h-3 w-3 ml-2" />
                          {booking.trip ? formatTime(booking.trip.departure_time) : ''}
                        </div>
                        <div className="text-gray-500">
                          Driver: {booking.trip?.driver?.user?.first_name} {booking.trip?.driver?.user?.last_name}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="text-xl font-bold text-blue-600">{formatPrice(booking.total_amount)}</p>
                      {booking.status === 'confirmed' && (
                        <Button
                          variant="destructive" size="sm"
                          onClick={() => cancelBooking(booking.id)}
                        >
                          <XCircle className="h-3 w-3 mr-1" /> Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Driver CTA */}
      {user.user_type === 'passenger' && (
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-blue-900">Become a Driver</h3>
              <p className="text-sm text-blue-700">Earn money on your regular trips</p>
            </div>
            <Button onClick={() => router.push('/driver/apply')}>Apply Now</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
