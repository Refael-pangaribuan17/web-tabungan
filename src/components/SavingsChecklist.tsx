
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, List, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from '@/hooks/use-toast';
import { useWishlist } from '@/contexts/WishlistContext';

interface ChecklistItem {
  id: string;
  date: Date;
  amount: number;
  note: string;
  completed: boolean;
}

const SavingsChecklist: React.FC = () => {
  const { currentWishlistId, addSavings } = useWishlist();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newAmount, setNewAmount] = useState('');
  const [newNote, setNewNote] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [dailySavingAdded, setDailySavingAdded] = useState(false);

  // Check if savings were already added today
  useEffect(() => {
    // Check for today's date
    const today = new Date();
    const todayKey = `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`;
    const hasSavedToday = localStorage.getItem(`dailySaving-${currentWishlistId}-${todayKey}`);
    
    if (hasSavedToday) {
      setDailySavingAdded(true);
    } else {
      setDailySavingAdded(false);
    }
  }, [currentWishlistId]);

  useEffect(() => {
    // Listen for savings added events
    const handleSavingsAdded = (event: CustomEvent) => {
      const { amount } = event.detail;
      
      const newItem: ChecklistItem = {
        id: Date.now().toString(),
        date: new Date(),
        amount: amount,
        note: 'Tabungan harian',
        completed: true,
      };
      
      setItems(prev => [newItem, ...prev]);
      
      // Mark that savings were added today
      const today = new Date();
      const todayKey = `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`;
      localStorage.setItem(`dailySaving-${currentWishlistId}-${todayKey}`, 'true');
      setDailySavingAdded(true);
    };
    
    // Listen for savings reset events
    const handleSavingsReset = () => {
      setItems([]);
      setDailySavingAdded(false);
    };
    
    // Listen for wishlist change events
    const handleWishlistChange = () => {
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
    
    window.addEventListener('savingsAdded', handleSavingsAdded as EventListener);
    window.addEventListener('savingsReset', handleSavingsReset as EventListener);
    window.addEventListener('wishlistChanged', handleWishlistChange as EventListener);
    
    // Load saved checklist items for this wishlist from localStorage
    const savedItems = localStorage.getItem(`checklist-${currentWishlistId}`);
    if (savedItems) {
      // Convert date strings back to Date objects
      const parsedItems = JSON.parse(savedItems).map((item: any) => ({
        ...item,
        date: new Date(item.date)
      }));
      setItems(parsedItems);
    }
    
    return () => {
      window.removeEventListener('savingsAdded', handleSavingsAdded as EventListener);
      window.removeEventListener('savingsReset', handleSavingsReset as EventListener);
      window.removeEventListener('wishlistChanged', handleWishlistChange as EventListener);
    };
  }, [currentWishlistId]);

  // Save checklist items to localStorage when they change
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem(`checklist-${currentWishlistId}`, JSON.stringify(items));
    }
  }, [items, currentWishlistId]);

  const toggleItemCompletion = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const handleAddItem = () => {
    if (dailySavingAdded) {
      toast({
        title: "Batas Harian Tercapai",
        description: "Kamu hanya dapat menambahkan tabungan sekali per hari.",
        variant: "destructive",
      });
      return;
    }

    if (!newAmount || parseInt(newAmount) <= 0) {
      toast({
        title: "Error",
        description: "Silakan masukkan jumlah tabungan yang valid",
        variant: "destructive",
      });
      return;
    }

    const amount = parseInt(newAmount);
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      date: new Date(),
      amount: amount,
      note: newNote || 'Tabungan harian',
      completed: true,
    };

    setItems([newItem, ...items]);
    addSavings(currentWishlistId, amount);
    setNewAmount('');
    setNewNote('');
    setIsAddingNew(false);
    
    // Mark that savings were added today
    const today = new Date();
    const todayKey = `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`;
    localStorage.setItem(`dailySaving-${currentWishlistId}-${todayKey}`, 'true');
    setDailySavingAdded(true);
    
    toast({
      title: "Checklist Berhasil Ditambahkan!",
      description: `Tabungan sebesar Rp ${amount.toLocaleString('id-ID')} telah dicatat.`,
    });
  };

  return (
    <Card className="w-full dark:bg-gray-900 dark:border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium flex items-center dark:text-white">
          <List className="h-5 w-5 mr-2 text-wishlist-primary dark:text-purple-400" />
          Checklist Tabungan
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAddingNew(!isAddingNew)}
          disabled={dailySavingAdded}
          className={cn(
            "text-wishlist-primary hover:text-wishlist-secondary hover:bg-wishlist-light dark:text-purple-400 dark:hover:bg-gray-800",
            dailySavingAdded && "opacity-50 cursor-not-allowed"
          )}
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          <span className="text-sm">Tambah</span>
        </Button>
      </CardHeader>
      <CardContent>
        {isAddingNew && (
          <div className="mb-4 p-4 bg-wishlist-light dark:bg-gray-800 rounded-xl animate-scale-in">
            <div className="mb-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                Jumlah Tabungan (Rp)
              </label>
              <Input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="50000"
                className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="mb-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                Catatan
              </label>
              <Input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Hemat dari uang jajan"
                className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={handleAddItem} 
                className="flex-1 button-gradient"
              >
                Simpan
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsAddingNew(false)}
                className="flex-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                Batal
              </Button>
            </div>
          </div>
        )}

        {dailySavingAdded && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-700 dark:text-green-400 flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Kamu sudah menambahkan tabungan hari ini!
            </p>
          </div>
        )}

        <div className="space-y-3">
          {items.map((item) => (
            <div 
              key={item.id} 
              className={cn(
                "checklist-item group dark:bg-gray-800",
                item.completed ? "border-l-4 border-wishlist-green dark:border-green-500" : "border-l-4 border-gray-200"
              )}
            >
              <div
                className="flex-shrink-0 mr-3 cursor-pointer"
                onClick={() => toggleItemCompletion(item.id)}
              >
                {item.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-wishlist-green dark:text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400 group-hover:text-wishlist-primary dark:group-hover:text-purple-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{formatDate(item.date)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.note}</p>
              </div>
              <div className="text-right">
                <p className={cn(
                  "font-bold",
                  item.completed ? "text-wishlist-green dark:text-green-500" : "text-gray-400"
                )}>
                  Rp{item.amount.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SavingsChecklist;
