'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PlusCircle, Car, Users, Wallet, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/auth-store';
import api from '@/lib/api';
import { formatPrice, formatDate, formatTime } from '@/lib/utils';

export default function DriverDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/auth'); return; }
    api.get('/trips/my-trips')
      .then(({ data }) => setTrips(data))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  const stats = [
    { label: 'Total Trips', value: trips.length, icon: Car, color: 'text-blue-600' },
    { label: 'Active Trips', value: trips.filter(t => t.status === 'active').length, icon: Users, color: 'text-green-600' },
    { label: 'Completed', value: trips.filter(t => t.status === 'completed').length, icon: Wallet, color: 'text-purple-600' },
    { label: 'My Rating', value: Number(user.rating) > 0 ? Number(user.rating).toFixed(1) : 'New', icon: Star, color: 'text-yellow-600' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
          <p className="text-gray-500">Manage your trips and earnings</p>
        </div>
        <Button onClick={() => router.push('/driver/create-trip')}>
          <PlusCircle className="mr-2 h-4 w-4" /> New Trip
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-500">{s.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                  </div>
                  <s.icon className={`h-5 w-5 ${s.color} opacity-50`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Trips */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>My Trips</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : trips.length === 0 ? (
            <div className="p-16 text-center">
              <div className="text-5xl mb-4">🚗</div>
              <p className="text-gray-500 mb-4">No trips yet</p>
              <Button onClick={() => router.push('/driver/create-trip')}>Create your first trip</Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {trips.map((trip) => (
                <div key={trip.id} className="p-6 flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={trip.status === 'active' ? 'success' : trip.status === 'cancelled' ? 'destructive' : 'default'}>
                        {trip.status}
                      </Badge>
                      <span className="text-sm text-gray-500">{trip.available_seats}/{trip.total_seats} seats</span>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {trip.departure_city} → {trip.destination_city}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(trip.departure_date)} at {formatTime(trip.departure_time)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-xl font-bold text-blue-600">{formatPrice(trip.price_per_seat)}<span className="text-xs text-gray-400 font-normal">/seat</span></p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
