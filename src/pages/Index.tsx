
import React, { useState } from 'react';
import Header from '@/components/Header';
import WishlistItem from '@/components/WishlistItem';
import SavingsCalendar from '@/components/SavingsCalendar';
import SavingsChecklist from '@/components/SavingsChecklist';
import MotivationCard from '@/components/MotivationCard';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { WishlistProvider } from '@/contexts/WishlistContext';
import WishlistSelector from '@/components/WishlistSelector';

const Index: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <WishlistProvider>
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
            </div>
          </div>

          <WishlistSelector />
          
          <div className="mb-6">
            <WishlistItem />
          </div>
          
          <div className="mb-6">
            <MotivationCard />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SavingsCalendar />
            <SavingsChecklist />
          </div>
        </main>
      </div>
    </WishlistProvider>
  );
};

export default Index;
