'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, Star, Luggage, Wind, PawPrint, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/auth-store';
import api from '@/lib/api';
import { formatPrice, formatDate, formatTime, getInitials } from '@/lib/utils';

export default function TripDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [seats, setSeats] = useState(1);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/trips/${id}`)
      .then(({ data }) => setTrip(data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async () => {
    if (!user) { router.push('/auth'); return; }
    setBooking(true); setError('');
    try {
      await api.post('/bookings', { tripId: id, seats });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/3" />
      <div className="h-64 bg-gray-200 rounded-xl" />
    </div>
  );

  if (!trip) return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      <p className="text-gray-500">Trip not found</p>
      <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm">
        <ArrowLeft className="h-4 w-4" /> Back to results
      </button>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Driver Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
                  {trip.driver?.user ? getInitials(trip.driver.user.first_name, trip.driver.user.last_name) : 'DR'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {trip.driver?.user?.first_name} {trip.driver?.user?.last_name}
                  </h2>
                  <div className="flex items-center gap-1 mt-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`h-4 w-4 ${s <= Math.round(trip.driver?.user?.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">
                      {Number(trip.driver?.user?.rating) > 0 ? Number(trip.driver?.user?.rating).toFixed(1) : 'New Driver'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Route */}
          <Card>
            <CardHeader><CardTitle>Route Details</CardTitle></CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-600 mt-1" />
                    <div className="w-0.5 h-12 bg-gray-200" />
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="font-semibold text-gray-900">{trip.departure_location}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {formatTime(trip.departure_time)} • {formatDate(trip.departure_date)}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{trip.destination_location}</p>
                      <p className="text-sm text-gray-500">Destination</p>
                    </div>
                  </div>
                </div>
              </div>

              {trip.estimated_duration_minutes && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-6 text-sm text-gray-500">
                  <span>⏱ ~{Math.round(trip.estimated_duration_minutes / 60)}h {trip.estimated_duration_minutes % 60}m</span>
                  {trip.distance_km && <span>📍 {trip.distance_km} km</span>}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader><CardTitle>Trip Rules & Amenities</CardTitle></CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Luggage, label: 'Luggage', allowed: trip.luggage_allowed },
                  { icon: Wind, label: 'Smoking', allowed: trip.smoking_allowed },
                  { icon: PawPrint, label: 'Pets', allowed: trip.pets_allowed },
                  { icon: Users, label: 'Women Only', allowed: trip.women_only },
                ].map(({ icon: Icon, label, allowed }) => (
                  <div key={label} className={`flex items-center gap-2 p-3 rounded-lg text-sm ${allowed ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    <Icon className="h-4 w-4" />
                    <span>{label}: {allowed ? '✓ Allowed' : '✗ Not allowed'}</span>
                  </div>
                ))}
              </div>
              {trip.additional_notes && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-800">
                  📝 {trip.additional_notes}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Booking Card */}
        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-blue-600">{formatPrice(trip.price_per_seat)}</p>
                <p className="text-sm text-gray-500">per seat</p>
              </div>

              <div className="mb-4">
                <Badge variant={trip.available_seats > 0 ? 'success' : 'destructive'} className="w-full justify-center py-1">
                  {trip.available_seats > 0 ? `${trip.available_seats} seats available` : 'Fully booked'}
                </Badge>
              </div>

              {success ? (
                <div className="text-center py-4">
                  <div className="text-4xl mb-2">🎉</div>
                  <p className="font-semibold text-green-700">Booking Confirmed!</p>
                  <Button className="w-full mt-4" variant="outline" onClick={() => router.push('/dashboard')}>
                    View My Bookings
                  </Button>
                </div>
              ) : (
                <>
                  {error && <p className="text-sm text-red-600 mb-3 text-center">{error}</p>}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
                    <select
                      value={seats}
                      onChange={e => setSeats(Number(e.target.value))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    >
                      {Array.from({ length: Math.min(trip.available_seats, 4) }, (_, i) => i + 1).map(n => (
                        <option key={n} value={n}>{n} seat{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{seats} × {formatPrice(trip.price_per_seat)}</span>
                      <span className="font-bold">{formatPrice(seats * trip.price_per_seat)}</span>
                    </div>
                  </div>
                  <Button
                    className="w-full" size="lg" loading={booking}
                    disabled={trip.available_seats === 0}
                    onClick={handleBook}
                  >
                    {user ? 'Book Now' : 'Login to Book'}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
