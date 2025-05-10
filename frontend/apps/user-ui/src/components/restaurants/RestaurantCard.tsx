import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Clock, Zap, Award } from 'lucide-react';
import { Restaurant } from '../../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  index: number;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, index }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        ease: 'easeOut'
      }
    },
    hover: {
      y: -10,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };
  
  return (
    <motion.div
      className="card h-full"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <Link to={`/restaurant/${restaurant.id}`} className="block h-full">
        <div className="relative">
          {/* Image */}
          <div className="h-48 overflow-hidden rounded-t-xl">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover transition-transform duration-300 transform group-hover:scale-110"
            />
          </div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {restaurant.isPromoted && (
              <motion.span
                className="badge bg-primary-500 text-white px-3 py-1"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                Promoted
              </motion.span>
            )}
          </div>
          
          {/* Quick info badges */}
          <div className="absolute bottom-3 right-3 flex gap-2">
            {restaurant.isTopRated && (
              <motion.span
                className="badge bg-yellow-100 text-yellow-800 flex items-center"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <Award size={12} className="mr-1" /> Top Rated
              </motion.span>
            )}
            
            {restaurant.isFastDelivery && (
              <motion.span
                className="badge bg-blue-100 text-blue-800 flex items-center"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <Zap size={12} className="mr-1" /> Fast
              </motion.span>
            )}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {restaurant.name}
          </h3>
          
          <div className="flex items-center text-sm text-gray-500 mb-2">
            {restaurant.cuisine.join(', ')}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Star size={16} className="text-yellow-400 mr-1" />
              <span className="font-medium text-gray-900">{restaurant.rating}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Clock size={14} className="mr-1" />
              <span>{restaurant.deliveryTime} min</span>
            </div>
            
            <div className="text-sm font-medium text-gray-800">
              {restaurant.priceRange}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default RestaurantCard;