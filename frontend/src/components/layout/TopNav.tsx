import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, User as UserIcon, Search } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';
import { cn } from '@/lib/utils';

interface TopNavProps {
  transparent?: boolean;
}

export function TopNav({ transparent = false }: TopNavProps) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = React.useState(false);
  
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navBackgroundClass = React.useMemo(() => {
    if (!transparent) return 'bg-background border-b';
    return isScrolled ? 'bg-background/95 backdrop-blur-sm border-b' : 'bg-transparent';
  }, [transparent, isScrolled]);
  
  const logoVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.1 * i,
        duration: 0.4,
        ease: 'easeOut'
      }
    })
  };
  
  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        navBackgroundClass
      )}
    >
      <div className="container-custom mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <motion.div
            variants={logoVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center"
          >
            <Link to="/" className="flex items-center gap-2">
              <ShoppingCart className="h-8 w-8 text-foodly-primary" />
              <span className="text-xl font-bold text-foodly-primary">Foodly</span>
            </Link>
          </motion.div>
          
          <div className="hidden md:block">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search for restaurants or cuisines..." 
                className="pl-10 pr-4"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.div 
              custom={1}
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
            >
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/cart')}
                className="relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foodly-primary text-xs font-medium text-white">
                    {getTotalItems()}
                  </span>
                )}
              </Button>
            </motion.div>

            {isAuthenticated ? (
              <>
                <motion.div 
                  custom={2}
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Avatar className="h-8 w-8 cursor-pointer" onClick={() => navigate('/profile')}>
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </motion.div>
                
                <motion.div 
                  custom={3}
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => logout()}
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div 
                  custom={2}
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Button 
                    variant="ghost"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                </motion.div>
                
                <motion.div 
                  custom={3}
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Button 
                    onClick={() => navigate('/register')}
                    className="bg-foodly-primary hover:bg-foodly-primary/90"
                  >
                    Sign Up
                  </Button>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}