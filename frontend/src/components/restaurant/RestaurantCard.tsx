import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Restaurant } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface RestaurantCardProps {
  restaurant: Restaurant;
  index: number;
}

export function RestaurantCard({ restaurant, index }: RestaurantCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="restaurant-card group"
    >
      <Link to={`/restaurant/${restaurant.id}`} className="block">
        <div className="relative overflow-hidden pb-[60%]">
          <img 
            src={restaurant.coverImage} 
            alt={restaurant.name} 
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {restaurant.isFeatured && (
            <div className="badge-featured">Featured</div>
          )}
          
          {restaurant.discount && (
            <div className="badge-discount">
              {restaurant.discount.percentage}% OFF
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-12 w-12 overflow-hidden rounded-full border">
              <img 
                src={restaurant.logo} 
                alt={`${restaurant.name} logo`} 
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold">{restaurant.name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                {restaurant.cuisineType.slice(0, 2).join(', ')}
              </div>
            </div>
          </div>
          
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className={cn(
                "flex items-center gap-1 rounded-full",
                restaurant.rating >= 4.5 ? "border-foodly-success bg-foodly-success/10 text-foodly-success" :
                restaurant.rating >= 4 ? "border-foodly-accent bg-foodly-accent/10 text-foodly-accent" :
                "border-muted-foreground bg-muted/10 text-muted-foreground"
              )}
            >
              <Star className="h-3 w-3 fill-current" />
              <span>{restaurant.rating}</span>
              <span className="text-xs">({restaurant.reviewCount})</span>
            </Badge>
            
            <Badge
              variant="outline"
              className="flex items-center gap-1 rounded-full border-muted-foreground bg-muted/10 text-muted-foreground"
            >
              <Clock className="h-3 w-3" />
              <span>{restaurant.estimatedDeliveryTime}</span>
            </Badge>
            
            <Badge
              variant="outline"
              className="flex items-center gap-1 rounded-full border-muted-foreground bg-muted/10 text-muted-foreground"
            >
              <DollarSign className="h-3 w-3" />
              <span>{restaurant.priceRange}</span>
            </Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>${restaurant.deliveryFee.toFixed(2)} delivery</span>
              <span>•</span>
              <span>${restaurant.minimumOrder} min</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}