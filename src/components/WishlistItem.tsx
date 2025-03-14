
import React, { useState } from 'react';
import { Sparkles, Upload, Plus, RefreshCcw } from 'lucide-react';
import CircularProgress from './CircularProgress';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { toast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { useWishlist } from '@/contexts/WishlistContext';

// Example placeholder image
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=500&auto=format&fit=crop';

const WishlistItem: React.FC = () => {
  const { getCurrentWishlist, updateWishlist, resetSavings, addSavings, currentWishlistId } = useWishlist();
  const currentWishlist = getCurrentWishlist();
  
  const [depositAmount, setDepositAmount] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  
  if (!currentWishlist || !currentWishlistId) {
    return (
      <div className="wishlist-card p-4 relative">
        <div className="wave-background"></div>
        <div className="relative z-10 flex items-center justify-center h-44">
          <p className="text-gray-500 dark:text-gray-400">Tidak ada wishlist yang dipilih</p>
        </div>
      </div>
    );
  }
  
  const { image, name, price, saved } = currentWishlist;

  const handleAddSavings = () => {
    const amount = parseInt(depositAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Error",
        description: "Silakan masukkan jumlah tabungan yang valid",
        variant: "destructive",
      });
      return;
    }

    addSavings(currentWishlistId, amount);
    setDepositAmount('');
    setIsDialogOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        updateWishlist(currentWishlistId, { image: event.target.result.toString() });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetSavings = () => {
    resetSavings(currentWishlistId);
    setIsResetDialogOpen(false);
  };

  return (
    <div className="wishlist-card p-4 relative">
      <div className="wave-background"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-wishlist-dark dark:text-white">{name}</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-wishlist-primary hover:text-wishlist-secondary hover:bg-wishlist-light dark:hover:bg-gray-800"
            onClick={() => {
              toast({
                title: "Edit Item",
                description: "Fitur edit item akan segera hadir!",
              });
            }}
          >
            <Sparkles className="h-4 w-4 mr-1" />
            <span className="text-sm">Edit</span>
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-6 relative">
          <div className="relative group">
            <div className="overflow-hidden rounded-xl relative">
              <img 
                src={image} 
                alt={name}
                className="w-52 h-44 object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="h-8 w-8 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <CircularProgress value={saved} max={price} animated={true} />
            <div className="mt-4 text-center relative">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tabungan saat ini</p>
              <div className="flex items-center justify-center">
                <p className="text-lg font-bold text-wishlist-primary">
                  {formatCurrency(saved)} <span className="text-gray-400 font-normal">dari</span> {formatCurrency(price)}
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsResetDialogOpen(true)}
                  className="ml-2 text-gray-400 hover:text-red-500 dark:hover:bg-gray-800"
                >
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4 button-gradient group relative overflow-hidden">
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  <Plus className="h-4 w-4 mr-1" />
                  <span>Tambah Tabungan</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md dark:bg-gray-900 dark:border-gray-800">
                <DialogHeader>
                  <DialogTitle className="dark:text-white">Tambah Tabungan</DialogTitle>
                </DialogHeader>
                <div className="p-4">
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      Jumlah Tabungan (Rp)
                    </label>
                    <Input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="50000"
                      className="w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                  <Button 
                    onClick={handleAddSavings} 
                    className="w-full button-gradient"
                  >
                    Simpan
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
              <AlertDialogContent className="dark:bg-gray-900 dark:border-gray-800">
                <AlertDialogHeader>
                  <AlertDialogTitle className="dark:text-white">Reset Tabungan</AlertDialogTitle>
                  <AlertDialogDescription className="dark:text-gray-400">
                    Apakah kamu yakin ingin mereset tabungan? Tindakan ini tidak dapat dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">Batal</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleResetSavings}
                    className="bg-red-500 text-white hover:bg-red-600"
                  >
                    Reset
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistItem;
