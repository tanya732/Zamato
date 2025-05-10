import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  const footerAnimation = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.footer 
      className="bg-foodly-secondary text-white"
      variants={footerAnimation}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <motion.div variants={itemAnimation}>
            <div className="mb-4 flex items-center gap-2">
              <ShoppingCart className="h-8 w-8 text-foodly-primary" />
              <span className="text-xl font-bold text-foodly-primary">Foodly</span>
            </div>
            <p className="mb-6 text-sm text-gray-400">
              Delivering happiness, one meal at a time. Discover the best food from local restaurants.
            </p>
            <div className="flex gap-4">
              <Link to="#" className="text-gray-400 transition-colors hover:text-foodly-primary">
                <Facebook size={20} />
              </Link>
              <Link to="#" className="text-gray-400 transition-colors hover:text-foodly-primary">
                <Twitter size={20} />
              </Link>
              <Link to="#" className="text-gray-400 transition-colors hover:text-foodly-primary">
                <Instagram size={20} />
              </Link>
              <Link to="#" className="text-gray-400 transition-colors hover:text-foodly-primary">
                <Linkedin size={20} />
              </Link>
            </div>
          </motion.div>

          <motion.div variants={itemAnimation}>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 transition-colors hover:text-foodly-primary">Home</Link>
              </li>
              <li>
                <Link to="/restaurants" className="text-gray-400 transition-colors hover:text-foodly-primary">Restaurants</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 transition-colors hover:text-foodly-primary">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 transition-colors hover:text-foodly-primary">Contact</Link>
              </li>
              <li>
                <Link to="/restaurant/login" className="text-gray-400 transition-colors hover:text-foodly-primary">Restaurant Login</Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={itemAnimation}>
            <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-foodly-primary" />
                <span className="text-gray-400">123 Food Street, Tasty City, FL 12345, USA</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-foodly-primary" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-foodly-primary" />
                <span className="text-gray-400">support@foodly.com</span>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={itemAnimation}>
            <h3 className="mb-4 text-lg font-semibold">Newsletter</h3>
            <p className="mb-4 text-sm text-gray-400">
              Subscribe to our newsletter and get exclusive deals you won't find anywhere else.
            </p>
            <div className="flex flex-col gap-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="border-foodly-primary bg-foodly-secondary/70 text-white"
              />
              <Button className="bg-foodly-primary hover:bg-foodly-primary/90">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Foodly. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-sm text-gray-400 transition-colors hover:text-foodly-primary">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-gray-400 transition-colors hover:text-foodly-primary">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}