import React from 'react';
import { motion } from 'framer-motion';

const RestaurantSkeleton: React.FC = () => {
  return (
    <motion.div
      className="card h-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Image skeleton */}
      <div className="h-48 bg-gray-200 rounded-t-xl animate-pulse"></div>
      
      {/* Content skeleton */}
      <div className="p-4">
        {/* Name */}
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
        
        {/* Cuisine */}
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
        
        {/* Info row */}
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-10 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default RestaurantSkeleton;