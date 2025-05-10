import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, PenSquare, Trash, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MenuItemForm } from '@/components/restaurant/MenuItemForm';
import { TopNav } from '@/components/layout/TopNav';
import { Footer } from '@/components/layout/Footer';
import { useRestaurantStore } from '@/store/restaurant-store';
import { formatCurrency } from '@/lib/utils';

export function RestaurantDashboard() {
  const { menuItems, fetchMenuItems, deleteMenuItem } = useRestaurantStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  // For this example, we're using a hardcoded restaurant ID since we don't have actual auth
  const restaurantId = '1';
  
  useEffect(() => {
    fetchMenuItems(restaurantId);
  }, [fetchMenuItems, restaurantId]);
  
  const handleAddItem = () => {
    setIsAddDialogOpen(true);
  };
  
  const handleEditItem = (itemId: string) => {
    setSelectedMenuItem(itemId);
    setIsEditDialogOpen(true);
  };
  
  const handleConfirmDelete = (itemId: string) => {
    setItemToDelete(itemId);
    setIsDeleteAlertOpen(true);
  };
  
  const handleDeleteItem = async () => {
    if (itemToDelete) {
      await deleteMenuItem(itemToDelete);
      setIsDeleteAlertOpen(false);
      setItemToDelete(null);
    }
  };
  
  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const selectedItem = menuItems.find(item => item.id === selectedMenuItem);
  
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <div className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center"
        >
          <div>
            <h1 className="text-3xl font-bold">Menu Management</h1>
            <p className="text-muted-foreground">
              Add, edit, or remove items from your restaurant menu
            </p>
          </div>
          
          <Button 
            onClick={handleAddItem}
            className="gap-2 bg-foodly-primary hover:bg-foodly-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add New Item
          </Button>
        </motion.div>
        
        <div className="mb-6 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search menu items..."
              className="pl-10 pr-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-4 py-3 font-medium">Image</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No menu items found
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b"
                    >
                      <td className="px-4 py-3">
                        <div className="h-12 w-12 overflow-hidden rounded-md">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">{item.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
                      <td className="px-4 py-3">{formatCurrency(item.price)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          item.isAvailable
                            ? 'bg-foodly-success/10 text-foodly-success'
                            : 'bg-destructive/10 text-destructive'
                        }`}>
                          {item.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditItem(item.id)}
                          >
                            <PenSquare className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => handleConfirmDelete(item.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Menu Item</DialogTitle>
          </DialogHeader>
          <MenuItemForm 
            restaurantId={restaurantId}
            onSuccess={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <MenuItemForm 
              initialData={selectedItem}
              restaurantId={restaurantId}
              onSuccess={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation */}
      <Dialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertDescription>
              Are you sure you want to delete this menu item? This action cannot be undone.
            </AlertDescription>
          </Alert>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteAlertOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteItem}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}