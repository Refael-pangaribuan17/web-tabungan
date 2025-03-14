
import React, { useState } from 'react';
import Header from '@/components/Header';
import WishlistItem from '@/components/WishlistItem';
import SavingsCalendar from '@/components/SavingsCalendar';
import SavingsChecklist from '@/components/SavingsChecklist';
import MotivationCard from '@/components/MotivationCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import SetTargetForm from '@/components/SetTargetForm';

const Index: React.FC = () => {
  const [isNewItemDialogOpen, setIsNewItemDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 max-w-5xl">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-wishlist-dark">Tabungan Impianku</h2>
          <Button 
            onClick={() => setIsNewItemDialogOpen(true)}
            className="button-gradient"
          >
            <Plus className="h-4 w-4 mr-1" />
            <span>Tambah Wishlist Baru</span>
          </Button>
        </div>

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
      
      <Dialog open={isNewItemDialogOpen} onOpenChange={setIsNewItemDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Wishlist Baru</DialogTitle>
          </DialogHeader>
          <SetTargetForm onClose={() => setIsNewItemDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
