'use client';

import HeroSection from '@/components/hero-section';
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <HeroSection />
      </div>
    </main>
  );
}
