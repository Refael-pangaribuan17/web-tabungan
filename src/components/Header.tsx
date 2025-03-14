
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

const Header: React.FC = () => {
  const { toast } = useToast();

  const handleNotification = () => {
    toast({
      title: "Pengingat Tabungan",
      description: "Jangan lupa menabung hari ini untuk mencapai impianmu!",
    });
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 bg-white shadow-sm">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">MW</span>
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-wishlist-primary to-wishlist-secondary bg-clip-text text-transparent">
          My Wishlist
        </h1>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleNotification}
        className="text-wishlist-primary hover:text-wishlist-secondary hover:bg-wishlist-light"
      >
        <Bell className="h-5 w-5" />
      </Button>
    </header>
  );
};

export default Header;
