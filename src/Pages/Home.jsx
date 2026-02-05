import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import ProductList from '../components/ProductList';
import TrainingSetion from '../components/TrainingSection';
import Testimonials from '../components/Testimonials';
import StatsDashboard from '../components/StatsDashboard';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <ProductList />
      <TrainingSetion />
      <Testimonials />
      <StatsDashboard />
      
    </>
  );
}
