'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, Star, Filter, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { formatPrice, formatDate, formatTime, getInitials } from '@/lib/utils';

function SearchResults() {
  const params = useSearchParams();
  const router = useRouter();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState(params.get('from') || '');
  const [to, setTo] = useState(params.get('to') || '');
  const [date, setDate] = useState(params.get('date') || '');

  const search = async () => {
    if (!from || !to) return;
    setLoading(true);
    try {
      const { data } = await api.get('/trips/search', { params: { from, to, date } });
      setTrips(data);
    } catch {
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { search(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`);
    search();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Search Bar */}
      <Card className="mb-8">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            <Input placeholder="From" value={from} onChange={e => setFrom(e.target.value)} required />
            <Input placeholder="To" value={to} onChange={e => setTo(e.target.value)} required />
            <input
              type="date" value={date} onChange={e => setDate(e.target.value)}
              className="h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button type="submit" loading={loading}>Search</Button>
          </form>
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {from && to ? `${from} → ${to}` : 'Search Results'}
          </h1>
          <p className="text-sm text-gray-500">
            {date ? formatDate(date) : ''} • {trips.length} ride{trips.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* Trip Cards */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6 h-32" />
            </Card>
          ))}
        </div>
      ) : trips.length === 0 ? (
        <Card>
          <CardContent className="p-16 text-center">
            <div className="text-5xl mb-4">🚗</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No rides found</h3>
            <p className="text-gray-500 mb-6">No trips available for this route and date.</p>
            <Button onClick={() => router.push('/auth')}>Post a Ride Request</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {trips.map((trip, i) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                className="hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
                onClick={() => router.push(`/trips/${trip.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    {/* Driver */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                        {trip.driver?.user ? getInitials(trip.driver.user.first_name, trip.driver.user.last_name) : 'DR'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {trip.driver?.user?.first_name} {trip.driver?.user?.last_name?.[0]}.
                        </p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-500">
                            {Number(trip.driver?.user?.rating) > 0 ? Number(trip.driver?.user?.rating).toFixed(1) : 'New'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Route */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm mb-1">
                        <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <span className="font-medium">{trip.departure_location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 ml-6 mb-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(trip.departure_time)} • {formatDate(trip.departure_date)}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-red-500 flex-shrink-0" />
                        <span className="font-medium">{trip.destination_location}</span>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="default">
                        <Users className="h-3 w-3 mr-1" />
                        {trip.available_seats} seats
                      </Badge>
                      {trip.women_only && <Badge variant="warning">Women Only</Badge>}
                      {trip.luggage_allowed && <Badge variant="outline">Luggage ✓</Badge>}
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-bold text-blue-600">{formatPrice(trip.price_per_seat)}</p>
                      <p className="text-xs text-gray-400">per seat</p>
                      <Button size="sm" className="mt-2">Book Now</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return <Suspense><SearchResults /></Suspense>;
}
