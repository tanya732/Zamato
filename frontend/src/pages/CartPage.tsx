import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowLeft, CreditCard } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CartItem } from '@/components/cart/CartItem';
import { TopNav } from '@/components/layout/TopNav';
import { Footer } from '@/components/layout/Footer';
import { useCartStore } from '@/store/cart-store';
import { useRestaurantStore } from '@/store/restaurant-store';
import { formatCurrency } from '@/lib/utils';

export function CartPage() {
  const { cart, clearCart } = useCartStore();
  const { restaurants } = useRestaurantStore();
  
  const restaurant = restaurants.find(r => cart?.restaurantId === r.id);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };
  
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        
        <div className="container-custom flex min-h-[70vh] flex-col items-center justify-center py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted"
          >
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4 text-2xl font-semibold"
          >
            Your cart is empty
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8 text-center text-muted-foreground"
          >
            Looks like you haven't added anything to your cart yet.
            <br />
            Go ahead and explore our restaurants.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button asChild className="bg-foodly-primary hover:bg-foodly-primary/90">
              <Link to="/restaurants">Browse Restaurants</Link>
            </Button>
          </motion.div>
        </div>
        
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <div className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center justify-between"
        >
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <Button
            variant="ghost"
            className="gap-2 text-muted-foreground"
            asChild
          >
            <Link to={`/restaurant/${cart.restaurantId}`}>
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </motion.div>
        
        {restaurant && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 flex items-center gap-4 rounded-lg border bg-card p-4"
          >
            <div className="h-16 w-16 overflow-hidden rounded-lg">
              <img
                src={restaurant.logo}
                alt={restaurant.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-semibold">{restaurant.name}</h2>
              <p className="text-sm text-muted-foreground">
                Estimated delivery: {restaurant.estimatedDeliveryTime}
              </p>
            </div>
          </motion.div>
        )}
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2"
          >
            <AnimatePresence>
              {cart.items.map((item, index) => (
                <CartItem key={item.menuItem.id} item={item} index={index} />
              ))}
            </AnimatePresence>
            
            <motion.div
              variants={itemVariants}
              className="mt-4 flex justify-end"
            >
              <Button
                variant="outline"
                onClick={() => clearCart()}
                className="text-muted-foreground"
              >
                Clear Cart
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-lg border bg-card p-6"
          >
            <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>{formatCurrency(cart.deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatCurrency(cart.tax)}</span>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-lg">{formatCurrency(cart.total)}</span>
              </div>
              
              <Button className="mt-6 w-full gap-2 bg-foodly-primary text-lg hover:bg-foodly-primary/90">
                <CreditCard className="h-5 w-5" />
                Checkout
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}