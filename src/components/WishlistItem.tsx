
import React, { useState, useEffect } from 'react';
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
  const [dailySavingAdded, setDailySavingAdded] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Check if savings were already added today
  useEffect(() => {
    if (!currentWishlistId) return;
    
    // Check for today's date
    const today = new Date();
    const todayKey = `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`;
    const hasSavedToday = localStorage.getItem(`dailySaving-${currentWishlistId}-${todayKey}`);
    
    if (hasSavedToday) {
      setDailySavingAdded(true);
    } else {
      setDailySavingAdded(false);
    }

    // Check if target is met for celebration animation
    if (currentWishlist && currentWishlist.saved >= currentWishlist.price) {
      const celebrationShown = localStorage.getItem(`celebration-${currentWishlistId}`);
      if (!celebrationShown) {
        setShowCelebration(true);
        localStorage.setItem(`celebration-${currentWishlistId}`, 'true');
        setTimeout(() => setShowCelebration(false), 5000);
      }
    }
  }, [currentWishlistId, currentWishlist]);
  
  // Listen for wishlist change events
  useEffect(() => {
    const handleWishlistChange = () => {
      if (!currentWishlistId) return;
      
      // Check if savings were already added today for the new wishlist
      const today = new Date();
      const todayKey = `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`;
      const hasSavedToday = localStorage.getItem(`dailySaving-${currentWishlistId}-${todayKey}`);
      
      if (hasSavedToday) {
        setDailySavingAdded(true);
      } else {
        setDailySavingAdded(false);
      }
    };

    const handleSavingsAdded = () => {
      setDailySavingAdded(true);
    };

    const handleSavingsReset = () => {
      setDailySavingAdded(false);
    };
    
    window.addEventListener('wishlistChanged', handleWishlistChange);
    window.addEventListener('savingsAdded', handleSavingsAdded);
    window.addEventListener('savingsReset', handleSavingsReset);
    
    return () => {
      window.removeEventListener('wishlistChanged', handleWishlistChange);
      window.removeEventListener('savingsAdded', handleSavingsAdded);
      window.removeEventListener('savingsReset', handleSavingsReset);
    };
  }, [currentWishlistId]);
  
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
    if (dailySavingAdded) {
      toast({
        title: "Batas Harian Tercapai",
        description: "Kamu hanya dapat menambahkan tabungan sekali per hari.",
        variant: "destructive",
      });
      return;
    }

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
    
    // Mark that savings were added today
    const today = new Date();
    const todayKey = `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`;
    localStorage.setItem(`dailySaving-${currentWishlistId}-${todayKey}`, 'true');
    setDailySavingAdded(true);

    // Check if target is reached after adding savings
    if (saved + amount >= price) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
    }
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
    setDailySavingAdded(false);
    
    // Clear the daily saving flag for this wishlist
    const today = new Date();
    const todayKey = `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`;
    localStorage.removeItem(`dailySaving-${currentWishlistId}-${todayKey}`);
    // Clear the celebration flag
    localStorage.removeItem(`celebration-${currentWishlistId}`);
  };

  return (
    <div className="wishlist-card p-4 relative overflow-hidden">
      <div className="wave-background"></div>
      
      {/* Celebration effects shown when target is reached */}
      {showCelebration && (
        <>
          <div className="absolute inset-0 z-20 pointer-events-none">
            <div className="absolute left-0 top-0 w-8 h-8 bg-yellow-500 rounded-full animate-confetti-1"></div>
            <div className="absolute left-1/4 top-0 w-6 h-6 bg-purple-500 rounded-full animate-confetti-2"></div>
            <div className="absolute left-2/4 top-0 w-10 h-10 bg-blue-500 rounded-full animate-confetti-3"></div>
            <div className="absolute left-3/4 top-0 w-4 h-4 bg-green-500 rounded-full animate-confetti-1 animate-delay-100"></div>
            <div className="absolute right-0 top-0 w-8 h-8 bg-pink-500 rounded-full animate-confetti-2 animate-delay-150"></div>
            <div className="absolute left-10 top-0 w-5 h-5 bg-red-500 rounded-full animate-confetti-3 animate-delay-200"></div>
            <div className="absolute left-1/3 top-0 w-7 h-7 bg-indigo-500 rounded-full animate-confetti-1 animate-delay-300"></div>
            <div className="absolute right-1/3 top-0 w-9 h-9 bg-orange-500 rounded-full animate-confetti-2 animate-delay-400"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20 dark:to-purple-900/20 animate-pulse-celebration z-10 pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 text-center animate-scale-celebration pointer-events-none">
            <div className="text-4xl font-bold text-wishlist-accent dark:text-yellow-400 drop-shadow-lg animate-wiggle">
              SELAMAT!
            </div>
            <div className="text-xl font-medium text-wishlist-primary dark:text-purple-300 mt-2 drop-shadow-md">
              Target Tercapai!
            </div>
          </div>
        </>
      )}
      
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
                <Button 
                  className={`mt-4 button-gradient group relative overflow-hidden ${dailySavingAdded ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={dailySavingAdded}
                  onClick={(e) => {
                    if (dailySavingAdded) {
                      e.preventDefault();
                      toast({
                        title: "Batas Harian Tercapai",
                        description: "Kamu hanya dapat menambahkan tabungan sekali per hari.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  <Plus className="h-4 w-4 mr-1" />
                  <span>Tambah Tabungan</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md dark:bg-gray-900 dark:border-gray-800">
                <DialogHeader>
                  <DialogTitle className="dark:text-white">Tambah Tabungan</DialogTitle>
                  <DialogDescription className="dark:text-gray-400">
                    Tambahkan jumlah tabungan yang ingin kamu simpan hari ini.
                  </DialogDescription>
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
