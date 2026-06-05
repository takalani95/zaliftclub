'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth-store';
import api from '@/lib/api';

const SA_CITIES = ['Cape Town','Johannesburg','Durban','Pretoria','Port Elizabeth','Bloemfontein','Nelspruit','East London','Polokwane','Kimberley','George','Rustenburg'];

export default function CreateTripPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    departureCity: '', departureLocation: '',
    destinationCity: '', destinationLocation: '',
    departureDate: '', departureTime: '',
    availableSeats: 3, pricePerSeat: 250,
    luggageAllowed: true, smokingAllowed: false,
    petsAllowed: false, womenOnly: false, notes: '',
  });

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api.post('/trips', form);
      router.push('/driver');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  if (!user) { router.push('/auth'); return null; }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create a New Trip</h1>
        <p className="text-gray-500 mb-8">Post your trip and connect with passengers</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
          )}

          {/* Departure */}
          <Card>
            <CardHeader><CardTitle className="text-base">Departure</CardTitle></CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <select
                  value={form.departureCity} onChange={e => set('departureCity', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select city</option>
                  {SA_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <Input label="Pick-up location / landmark" placeholder="e.g. Cape Town Station, Adderley Street" value={form.departureLocation} onChange={e => set('departureLocation', e.target.value)} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Date" type="date" value={form.departureDate} onChange={e => set('departureDate', e.target.value)} required />
                <Input label="Time" type="time" value={form.departureTime} onChange={e => set('departureTime', e.target.value)} required />
              </div>
            </CardContent>
          </Card>

          {/* Destination */}
          <Card>
            <CardHeader><CardTitle className="text-base">Destination</CardTitle></CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <select
                  value={form.destinationCity} onChange={e => set('destinationCity', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select city</option>
                  {SA_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <Input label="Drop-off location / landmark" placeholder="e.g. Park Station, Johannesburg" value={form.destinationLocation} onChange={e => set('destinationLocation', e.target.value)} required />
            </CardContent>
          </Card>

          {/* Pricing & Seats */}
          <Card>
            <CardHeader><CardTitle className="text-base">Pricing & Seats</CardTitle></CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price per seat (R)</label>
                  <input
                    type="number" min="50" max="2000" value={form.pricePerSeat}
                    onChange={e => set('pricePerSeat', Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available seats</label>
                  <input
                    type="number" min="1" max="8" value={form.availableSeats}
                    onChange={e => set('availableSeats', Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                💰 You'll earn approx. <strong>R{Math.round(form.pricePerSeat * form.availableSeats * 0.85)}</strong> if all seats are booked (after 15% platform fee)
              </div>
            </CardContent>
          </Card>

          {/* Rules */}
          <Card>
            <CardHeader><CardTitle className="text-base">Trip Rules</CardTitle></CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'luggageAllowed', label: '🧳 Luggage allowed' },
                  { key: 'smokingAllowed', label: '🚬 Smoking allowed' },
                  { key: 'petsAllowed', label: '🐾 Pets allowed' },
                  { key: 'womenOnly', label: '👩 Women only' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox" checked={(form as any)[key]}
                      onChange={e => set(key, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional notes (optional)</label>
                <textarea
                  value={form.notes} onChange={e => set('notes', e.target.value)}
                  rows={3} placeholder="Any other info for passengers..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" className="flex-1" size="lg" loading={loading}>Post Trip</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
