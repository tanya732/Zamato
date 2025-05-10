import React from 'react';
import { motion } from 'framer-motion';
import { Trash, Plus, Minus } from 'lucide-react';

import { CartItem as CartItemType } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart-store';

interface CartItemProps {
  item: CartItemType;
  index: number;
}

export function CartItem({ item, index }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCartStore();
  
  const handleIncreaseQuantity = () => {
    updateQuantity(item.menuItem.id, item.quantity + 1);
  };
  
  const handleDecreaseQuantity = () => {
    if (item.quantity > 1) {
      updateQuantity(item.menuItem.id, item.quantity - 1);
    }
  };
  
  const handleRemove = () => {
    removeFromCart(item.menuItem.id);
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: index * 0.1,
      },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.3 },
    },
  };
  
  return (
    <motion.div
      layout
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
    >
      <div className="flex items-center gap-4">
        <img
          src={item.menuItem.image}
          alt={item.menuItem.name}
          className="h-16 w-16 rounded-md object-cover"
        />
        <div>
          <h3 className="font-medium">{item.menuItem.name}</h3>
          <p className="text-sm text-muted-foreground">{formatCurrency(item.menuItem.price)}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 rounded-full"
            onClick={handleDecreaseQuantity}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-6 text-center">{item.quantity}</span>
          <Button
            size="icon"
            className="h-8 w-8 rounded-full bg-foodly-primary hover:bg-foodly-primary/90"
            onClick={handleIncreaseQuantity}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="w-20 text-right font-medium">
          {formatCurrency(item.menuItem.price * item.quantity)}
        </div>
        
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={handleRemove}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}