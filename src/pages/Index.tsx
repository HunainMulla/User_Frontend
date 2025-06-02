import React from 'react';
import { Hero } from '@/components/Hero';
import { ProductShowcase } from '@/components/ProductShowcase';
import { About } from '@/components/About';
import { Contact } from '@/components/Contact';
import { Navigation } from '@/components/Navigation';

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navigation />
      <Hero />
      <ProductShowcase />
      <About />
      <Contact />
    </div>
  );
};

export default Index;
