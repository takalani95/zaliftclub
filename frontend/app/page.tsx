'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Shield, Clock, Users, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  { icon: Shield, title: 'Verified Drivers', desc: 'ID checks, license verification & background screening' },
  { icon: Clock, title: 'Reliable Schedules', desc: 'Real-time updates and punctual departures' },
  { icon: Award, title: 'Rated Experience', desc: 'Community ratings keep quality high' },
  { icon: Users, title: 'Community Driven', desc: 'Thousands of trusted SA travellers' },
];

const popularRoutes = [
  { from: 'Cape Town', to: 'Johannesburg', price: 450, duration: '~14 hrs' },
  { from: 'Johannesburg', to: 'Durban', price: 250, duration: '~6 hrs' },
  { from: 'Pretoria', to: 'Nelspruit', price: 200, duration: '~4 hrs' },
  { from: 'Port Elizabeth', to: 'East London', price: 180, duration: '~4 hrs' },
  { from: 'Bloemfontein', to: 'Cape Town', price: 350, duration: '~10 hrs' },
  { from: 'Durban', to: 'Johannesburg', price: 250, duration: '~6 hrs' },
];

export default function HomePage() {
  const router = useRouter();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to) return;
    router.push(`/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            Travel Smart Across<br />
            <span className="text-yellow-300">South Africa 🇿🇦</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto"
          >
            Connect with verified drivers. Save up to 75% on long-distance travel.
          </motion.p>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="max-w-3xl mx-auto shadow-2xl">
              <CardContent className="p-6">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
                  <Input
                    placeholder="From: Cape Town..."
                    value={from}
                    onChange={e => setFrom(e.target.value)}
                    className="h-12"
                    required
                  />
                  <Input
                    placeholder="To: Johannesburg..."
                    value={to}
                    onChange={e => setTo(e.target.value)}
                    className="h-12"
                    required
                  />
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="h-12 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button type="submit" size="lg" className="h-12 whitespace-nowrap">
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose ZA Lift Club?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Revolutionising long-distance travel in South Africa</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-6 hover:shadow-md transition-shadow h-full">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <f.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Routes</h2>
            <p className="text-gray-500">Most travelled routes across South Africa</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularRoutes.map((route, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <Card
                  className="cursor-pointer hover:shadow-md hover:border-blue-200 transition-all"
                  onClick={() => router.push(`/search?from=${route.from}&to=${route.to}`)}
                >
                  <CardContent className="p-5 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">{route.from}</p>
                      <p className="text-xs text-gray-400 my-0.5 flex items-center gap-1">
                        <ArrowRight className="h-3 w-3" /> to
                      </p>
                      <p className="font-semibold text-gray-900">{route.to}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">R{route.price}</p>
                      <p className="text-xs text-gray-400">{route.duration}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-blue-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Are You a Driver?</h2>
        <p className="text-blue-100 mb-8 max-w-lg mx-auto">Earn money on your regular trips. Register as a driver and start earning today.</p>
        <Button
          size="lg"
          className="bg-white text-blue-600 hover:bg-blue-50"
          onClick={() => router.push('/auth?tab=register&type=driver')}
        >
          Register as Driver
        </Button>
      </section>
    </div>
  );
}
