import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RestaurantCard } from '@/components/restaurant/RestaurantCard';
import { TopNav } from '@/components/layout/TopNav';
import { Footer } from '@/components/layout/Footer';
import { useRestaurantStore } from '@/store/restaurant-store';

export function RestaurantListPage() {
  const { restaurants, fetchRestaurants, searchRestaurants } = useRestaurantStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchRestaurants(searchQuery);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <div className="container-custom pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="mb-4 text-3xl font-bold">Restaurants</h1>
          <p className="text-muted-foreground">
            Discover restaurants in your area and order delicious food
          </p>
        </motion.div>
        
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex flex-col gap-2 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search restaurants by name, cuisine, or dish..."
                className="pl-10 pr-4"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                type="submit"
                className="bg-foodly-primary hover:bg-foodly-primary/90"
              >
                Search
              </Button>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </form>
        </div>
        
        {restaurants.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed">
            <p className="mb-2 text-lg font-medium">No restaurants found</p>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {restaurants.map((restaurant, index) => (
              <RestaurantCard 
                key={restaurant.id} 
                restaurant={restaurant} 
                index={index}
              />
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}