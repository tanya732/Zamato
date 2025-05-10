import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuthStore } from '@/store/auth-store';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  redirectTo?: string;
  isRestaurant?: boolean;
}

export function LoginForm({ redirectTo = '/', isRestaurant = false }: LoginFormProps) {
  const navigate = useNavigate();
  const { login, error, clearError } = useAuthStore();
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: isRestaurant ? 'restaurant@example.com' : 'user@example.com',
      password: 'password', // Preset for demonstration
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    try {
      await login(values);
      
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });
      
      navigate(redirectTo);
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  
  React.useEffect(() => {
    if (error) {
      toast({
        title: 'Login failed',
        description: error,
        variant: 'destructive',
      });
      
      clearError();
    }
  }, [error, toast, clearError]);
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="your.email@example.com"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="••••••••"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full bg-foodly-primary hover:bg-foodly-primary/90">
          Sign In
        </Button>
      </form>
    </Form>
  );
}