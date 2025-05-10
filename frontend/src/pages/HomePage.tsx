import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RestaurantCard } from '@/components/restaurant/RestaurantCard';
import { TopNav } from '@/components/layout/TopNav';
import { Footer } from '@/components/layout/Footer';
import { useRestaurantStore } from '@/store/restaurant-store';

export function HomePage() {
  const { restaurants, fetchRestaurants } = useRestaurantStore();
  
  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);
  
  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };
  
  const featuredRestaurants = restaurants.filter(r => r.isFeatured);
  
  return (
    <div className="min-h-screen bg-background">
      <TopNav transparent />
      
      {/* Hero Section */}
      <motion.section
        className="relative flex min-h-[85vh] items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)',
        }}
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <div className="container-custom text-center text-white">
          <motion.h1 
            className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl"
            variants={itemVariants}
          >
            Delicious Food, Delivered Fast
          </motion.h1>
          
          <motion.p 
            className="mx-auto mb-8 max-w-2xl text-lg md:text-xl"
            variants={itemVariants}
          >
            Order from your favorite restaurants with just a few taps and enjoy the convenience of doorstep delivery.
          </motion.p>
          
          <motion.div
            className="mx-auto mb-8 flex max-w-md flex-col items-center gap-2 md:flex-row"
            variants={itemVariants}
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Enter your delivery address" 
                className="h-12 w-full pl-10 pr-4"
              />
            </div>
            <Button 
              className="h-12 bg-foodly-primary px-8 hover:bg-foodly-primary/90"
            >
              Find Food
            </Button>
          </motion.div>
          
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            variants={itemVariants}
          >
            <Button variant="outline" className="rounded-full border-white bg-transparent text-white hover:bg-white hover:text-black">
              Pizza
            </Button>
            <Button variant="outline" className="rounded-full border-white bg-transparent text-white hover:bg-white hover:text-black">
              Burgers
            </Button>
            <Button variant="outline" className="rounded-full border-white bg-transparent text-white hover:bg-white hover:text-black">
              Sushi
            </Button>
            <Button variant="outline" className="rounded-full border-white bg-transparent text-white hover:bg-white hover:text-black">
              Mexican
            </Button>
            <Button variant="outline" className="rounded-full border-white bg-transparent text-white hover:bg-white hover:text-black">
              Chinese
            </Button>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Featured Restaurants */}
      <section className="py-16">
        <div className="container-custom">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold md:text-3xl">Featured Restaurants</h2>
            <Link to="/restaurants" className="flex items-center gap-1 text-foodly-primary hover:underline">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredRestaurants.map((restaurant, index) => (
              <RestaurantCard 
                key={restaurant.id} 
                restaurant={restaurant} 
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="bg-foodly-light py-16 dark:bg-foodly-dark/20">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">How It Works</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Ordering your favorite food has never been easier. Just follow these simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <motion.div 
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-foodly-primary text-2xl font-bold text-white">1</div>
              <h3 className="mb-2 text-xl font-semibold">Select Restaurant</h3>
              <p className="text-muted-foreground">
                Browse through our collection of restaurants and choose your favorite.
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-foodly-primary text-2xl font-bold text-white">2</div>
              <h3 className="mb-2 text-xl font-semibold">Add to Cart</h3>
              <p className="text-muted-foreground">
                Pick your favorite dishes and add them to your cart.
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-foodly-primary text-2xl font-bold text-white">3</div>
              <h3 className="mb-2 text-xl font-semibold">Enjoy Your Food</h3>
              <p className="text-muted-foreground">
                Place your order, sit back, and wait for your food to arrive.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="rounded-2xl bg-foodly-primary p-8 text-white md:p-12">
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
              <div>
                <h2 className="mb-4 text-2xl font-bold md:text-3xl">Become a Restaurant Partner</h2>
                <p className="mb-6 text-white/90">
                  Join our platform and reach new customers. Grow your business with us.
                </p>
                <Button 
                  className="border-2 border-white bg-transparent hover:bg-white hover:text-foodly-primary"
                  asChild
                >
                  <Link to="/restaurant/register">Join Now</Link>
                </Button>
              </div>
              <div className="hidden md:block">
                <img 
                  src="https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Restaurant chef cooking" 
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}