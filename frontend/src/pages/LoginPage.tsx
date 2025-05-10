import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from '@/components/auth/LoginForm';

export function LoginPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-foodly-light dark:bg-foodly-dark">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        {/* Left Side - Form */}
        <div className="flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md rounded-xl bg-background p-8 shadow-lg"
          >
            <div className="mb-6 flex justify-center">
              <Link to="/" className="flex items-center gap-2">
                <ShoppingCart className="h-8 w-8 text-foodly-primary" />
                <span className="text-xl font-bold text-foodly-primary">Foodly</span>
              </Link>
            </div>
            
            <h1 className="mb-6 text-center text-2xl font-bold">Welcome Back</h1>
            
            <Tabs defaultValue="user" className="mb-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="user">User</TabsTrigger>
                <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
              </TabsList>
              
              <TabsContent value="user" className="mt-6">
                <LoginForm />
              </TabsContent>
              
              <TabsContent value="restaurant" className="mt-6">
                <LoginForm isRestaurant redirectTo="/restaurant/dashboard" />
              </TabsContent>
            </Tabs>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>Don't have an account? <Link to="/register" className="font-semibold text-foodly-primary hover:underline">Sign up</Link></p>
            </div>
          </motion.div>
        </div>
        
        {/* Right Side - Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="hidden bg-cover bg-center md:block"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)',
          }}
        >
          <div className="flex h-full items-center justify-center bg-black/40 p-8">
            <div className="max-w-md text-center text-white">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-4 text-3xl font-bold"
              >
                Delicious food is just a few clicks away
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mb-6"
              >
                Log in to order from your favorite restaurants or manage your restaurant menu
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <Button asChild className="bg-white text-foodly-primary hover:bg-white/90">
                  <Link to="/">Explore Food</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}