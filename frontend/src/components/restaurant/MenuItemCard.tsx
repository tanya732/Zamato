import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

import { MenuItem } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart-store';

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
}

export function MenuItemCard({ item, index }: MenuItemCardProps) {
  const { addToCart, cart, updateQuantity } = useCartStore();
  
  const itemInCart = cart?.items.find(
    cartItem => cartItem.menuItem.id === item.id
  );
  
  const itemQuantity = itemInCart?.quantity || 0;
  
  const handleAddToCart = () => {
    addToCart(item, 1);
  };
  
  const handleIncreaseQuantity = () => {
    updateQuantity(item.id, itemQuantity + 1);
  };
  
  const handleDecreaseQuantity = () => {
    if (itemQuantity > 0) {
      updateQuantity(item.id, itemQuantity - 1);
    }
  };
  
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
      className="food-card group flex overflow-hidden rounded-lg border bg-card"
    >
      <div className="flex-1 p-4">
        <div className="mb-1 flex items-center gap-2">
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <div className="flex gap-1">
            {item.isVegetarian && (
              <Badge variant="outline" className="border-foodly-success bg-foodly-success/10 text-xs text-foodly-success">
                Veg
              </Badge>
            )}
            {item.isSpicy && (
              <Badge variant="outline" className="border-foodly-error bg-foodly-error/10 text-xs text-foodly-error">
                Spicy
              </Badge>
            )}
          </div>
        </div>
        <p className="mb-2 text-sm text-muted-foreground">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">{formatCurrency(item.price)}</span>
          <div className="flex items-center gap-2">
            {itemQuantity > 0 ? (
              <div className="flex items-center gap-2">
                <Button 
                  size="icon" 
                  variant="outline"
                  className="h-8 w-8 rounded-full"
                  onClick={handleDecreaseQuantity}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-6 text-center">{itemQuantity}</span>
                <Button 
                  size="icon" 
                  className="h-8 w-8 rounded-full bg-foodly-primary hover:bg-foodly-primary/90"
                  onClick={handleIncreaseQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button 
                size="sm" 
                className="bg-foodly-primary hover:bg-foodly-primary/90"
                onClick={handleAddToCart}
              >
                Add
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="relative hidden h-auto w-1/3 sm:block">
        <img 
          src={item.image} 
          alt={item.name} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {item.isFeatured && (
          <div className="absolute left-0 top-0 bg-foodly-primary px-2 py-1 text-xs font-medium text-white">
            Featured
          </div>
        )}
      </div>
    </motion.div>
  );
}