import React from 'react';
import { motion } from 'framer-motion';
import RestaurantsList from '../components/restaurants/RestaurantsList';

const RestaurantsPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-16">
      <RestaurantsList />
    </div>
  );
};

export default RestaurantsPage;