
import React, { useState } from 'react';
import Header from '@/components/Header';
import WishlistItem from '@/components/WishlistItem';
import SavingsCalendar from '@/components/SavingsCalendar';
import SavingsChecklist from '@/components/SavingsChecklist';
import MotivationCard from '@/components/MotivationCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Plus, Moon, Sun } from 'lucide-react';
import SetTargetForm from '@/components/SetTargetForm';

interface WishlistItemData {
  image: string;
  name: string;
  price: number;
  saved: number;
}

const Index: React.FC = () => {
  const [isNewItemDialogOpen, setIsNewItemDialogOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentWishlistItem, setCurrentWishlistItem] = useState<WishlistItemData>({
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=500&auto=format&fit=crop',
    name: 'Laptop Baru',
    price: 10000000,
    saved: 2500000,
  });

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  const handleNewWishlistItem = (newItem: WishlistItemData) => {
    setCurrentWishlistItem(newItem);
    setIsNewItemDialogOpen(false);
    
    // Reset savings when adding a new wishlist
    window.dispatchEvent(new CustomEvent('savingsReset'));
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300`}>
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 max-w-5xl">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-wishlist-dark dark:text-white">Tabungan Impianku</h2>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleDarkMode}
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button 
              onClick={() => setIsNewItemDialogOpen(true)}
              className="button-gradient"
            >
              <Plus className="h-4 w-4 mr-1" />
              <span>Tambah Wishlist Baru</span>
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <WishlistItem 
            initialImage={currentWishlistItem.image}
            initialName={currentWishlistItem.name}
            initialPrice={currentWishlistItem.price}
            initialSaved={currentWishlistItem.saved}
          />
        </div>
        
        <div className="mb-6">
          <MotivationCard />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SavingsCalendar />
          <SavingsChecklist />
        </div>
      </main>
      
      <Dialog open={isNewItemDialogOpen} onOpenChange={setIsNewItemDialogOpen}>
        <DialogContent className="sm:max-w-md dark:bg-gray-900 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Tambah Wishlist Baru</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Menambahkan wishlist baru akan menggantikan wishlist yang lama dan mereset tabungan.
            </DialogDescription>
          </DialogHeader>
          <SetTargetForm onClose={() => setIsNewItemDialogOpen(false)} onSave={handleNewWishlistItem} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
