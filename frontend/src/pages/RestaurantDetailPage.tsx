import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, DollarSign, MapPin, Phone } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MenuItemCard } from '@/components/restaurant/MenuItemCard';
import { TopNav } from '@/components/layout/TopNav';
import { Footer } from '@/components/layout/Footer';
import { useRestaurantStore } from '@/store/restaurant-store';
import { cn } from '@/lib/utils';

export function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { selectedRestaurant, menuItems, fetchRestaurantById, fetchMenuItems } = useRestaurantStore();
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    if (id) {
      fetchRestaurantById(id);
      fetchMenuItems(id);
    }
  }, [id, fetchRestaurantById, fetchMenuItems]);
  
  if (!selectedRestaurant) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-foodly-primary border-t-transparent"></div>
      </div>
    );
  }
  
  const categories = Array.from(new Set(menuItems.map(item => item.category)));
  
  const filteredMenuItems = activeTab === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === activeTab);
  
  return (
    <div className="min-h-screen bg-background">
      <TopNav transparent />
      
      {/* Restaurant Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-96 bg-cover bg-center"
        style={{ backgroundImage: `url(${selectedRestaurant.coverImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70"></div>
        <div className="container-custom relative z-10 flex h-full flex-col justify-end pb-6 text-white">
          <div className="mb-4 flex items-center gap-4">
            <div className="h-24 w-24 overflow-hidden rounded-xl border-2 border-white bg-white">
              <img 
                src={selectedRestaurant.logo} 
                alt={selectedRestaurant.name} 
                className="h-full w-full object-cover"
              />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold">{selectedRestaurant.name}</h1>
              <p className="text-lg">{selectedRestaurant.cuisineType.join(', ')}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Badge
              variant="outline"
              className={cn(
                "flex items-center gap-1 rounded-full border-white bg-white/10",
                selectedRestaurant.rating >= 4.5 ? "text-foodly-accent" :
                selectedRestaurant.rating >= 4 ? "text-foodly-success" :
                "text-white"
              )}
            >
              <Star className="h-4 w-4 fill-current" />
              <span>{selectedRestaurant.rating}</span>
              <span className="text-xs">({selectedRestaurant.reviewCount})</span>
            </Badge>
            
            <Badge
              variant="outline"
              className="flex items-center gap-1 rounded-full border-white bg-white/10 text-white"
            >
              <Clock className="h-4 w-4" />
              <span>{selectedRestaurant.estimatedDeliveryTime}</span>
            </Badge>
            
            <Badge
              variant="outline"
              className="flex items-center gap-1 rounded-full border-white bg-white/10 text-white"
            >
              <DollarSign className="h-4 w-4" />
              <span>{selectedRestaurant.priceRange}</span>
            </Badge>
            
            <Badge
              variant="outline"
              className="flex items-center gap-1 rounded-full border-white bg-white/10 text-white"
            >
              <span>${selectedRestaurant.deliveryFee.toFixed(2)} delivery</span>
            </Badge>
            
            <Badge
              variant="outline"
              className="flex items-center gap-1 rounded-full border-white bg-white/10 text-white"
            >
              <span>${selectedRestaurant.minimumOrder} min</span>
            </Badge>
          </div>
        </div>
      </motion.div>
      
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Menu Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Tabs defaultValue="all" onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="all">All</TabsTrigger>
                  {categories.map(category => (
                    <TabsTrigger key={category} value={category}>
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <TabsContent value={activeTab} className="space-y-4">
                  {filteredMenuItems.map((item, index) => (
                    <MenuItemCard key={item.id} item={item} index={index} />
                  ))}
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
          
          <div>
            {/* Restaurant Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-lg border bg-card p-6"
            >
              <h3 className="mb-4 text-xl font-semibold">Restaurant Info</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-foodly-primary" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedRestaurant.address.street}, {selectedRestaurant.address.city}, {selectedRestaurant.address.state} {selectedRestaurant.address.postalCode}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="mt-1 h-5 w-5 text-foodly-primary" />
                  <div>
                    <p className="font-medium">Opening Hours</p>
                    <div className="text-sm text-muted-foreground">
                      <p>Mon-Thu: {selectedRestaurant.openingHours.monday.open} - {selectedRestaurant.openingHours.monday.close}</p>
                      <p>Fri-Sat: {selectedRestaurant.openingHours.friday.open} - {selectedRestaurant.openingHours.friday.close}</p>
                      <p>Sun: {selectedRestaurant.openingHours.sunday.open} - {selectedRestaurant.openingHours.sunday.close}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 h-5 w-5 text-foodly-primary" />
                  <div>
                    <p className="font-medium">Contact</p>
                    <p className="text-sm text-muted-foreground">
                      (555) 123-4567
                    </p>
                  </div>
                </div>
              </div>
              
              {selectedRestaurant.discount && (
                <div className="mt-6 rounded-lg bg-foodly-accent/10 p-4 text-foodly-dark">
                  <p className="font-medium">Special Offer</p>
                  <p className="text-sm">
                    {selectedRestaurant.discount.percentage}% OFF on orders above ${selectedRestaurant.discount.minimumOrder || selectedRestaurant.minimumOrder}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}