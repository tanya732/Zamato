import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Restaurant } from '../../types';
import { restaurantService } from '../../services/restaurantService';
import RestaurantCard from './RestaurantCard';
import RestaurantSkeleton from './RestaurantSkeleton';

const RestaurantsList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prevPage => prevPage + 1);
        }
      });
      
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );
  
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      
      try {
        const newRestaurants = await restaurantService.getRestaurants(page);
        
        setRestaurants(prev => {
          // If it's the first page, just return the new restaurants
          if (page === 1) return newRestaurants;
          
          // Otherwise, combine with previous and deduplicate
          const combined = [...prev, ...newRestaurants];
          return combined.filter(
            (restaurant, index, self) => 
              index === self.findIndex(r => r.id === restaurant.id)
          );
        });
        
        // If we received fewer restaurants than the limit, there are no more
        setHasMore(newRestaurants.length > 0);
      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRestaurants();
  }, [page]);
  
  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl font-bold text-gray-900">Restaurants Near You</h2>
        <p className="mt-2 text-lg text-gray-600">
          Discover amazing restaurants in your area
        </p>
      </motion.div>
      
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {restaurants.map((restaurant, index) => (
          <RestaurantCard 
            key={restaurant.id} 
            restaurant={restaurant} 
            index={index}
          />
        ))}
        
        {/* Loading skeletons */}
        {loading && page === 1 && (
          Array(8).fill(0).map((_, index) => (
            <RestaurantSkeleton key={index} />
          ))
        )}
      </motion.div>
      
      {/* Loading indicator for infinite scroll */}
      {loading && page > 1 && (
        <div className="flex justify-center mt-8">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Infinite scroll trigger */}
      {!loading && hasMore && (
        <div ref={loadingRef} className="h-10 mt-8"></div>
      )}
      
      {/* End message */}
      {!loading && !hasMore && restaurants.length > 0 && (
        <motion.p
          className="text-center mt-8 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          You've reached the end of the list 🎉
        </motion.p>
      )}
    </div>
  );
};

export default RestaurantsList;