import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export interface WishlistItemData {
  id: string;
  image: string;
  name: string;
  price: number;
  saved: number;
  dateCreated: string;
  completed: boolean;
}

interface WishlistContextType {
  wishlists: WishlistItemData[];
  currentWishlistId: string | null;
  addWishlist: (wishlist: Omit<WishlistItemData, 'id' | 'dateCreated' | 'completed'>) => void;
  updateWishlist: (id: string, data: Partial<WishlistItemData>) => void;
  deleteWishlist: (id: string) => void;
  selectWishlist: (id: string) => void;
  getCurrentWishlist: () => WishlistItemData | undefined;
  resetSavings: (id: string) => void;
  addSavings: (id: string, amount: number) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlists, setWishlists] = useState<WishlistItemData[]>(() => {
    const savedWishlists = localStorage.getItem('wishlists');
    if (savedWishlists) {
      return JSON.parse(savedWishlists);
    }
    const defaultWishlist = {
      id: "default-wishlist",
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=500&auto=format&fit=crop',
      name: 'Laptop Baru',
      price: 10000000,
      saved: 2500000,
      dateCreated: new Date().toISOString(),
      completed: false
    };
    return [defaultWishlist];
  });

  const [currentWishlistId, setCurrentWishlistId] = useState<string | null>(() => {
    const savedCurrentId = localStorage.getItem('currentWishlistId');
    return savedCurrentId || "default-wishlist";
  });

  useEffect(() => {
    localStorage.setItem('wishlists', JSON.stringify(wishlists));
  }, [wishlists]);

  useEffect(() => {
    if (currentWishlistId) {
      localStorage.setItem('currentWishlistId', currentWishlistId);
    }
  }, [currentWishlistId]);

  const addWishlist = (wishlist: Omit<WishlistItemData, 'id' | 'dateCreated' | 'completed'>) => {
    const newWishlist: WishlistItemData = {
      ...wishlist,
      id: `wishlist-${Date.now()}`,
      dateCreated: new Date().toISOString(),
      completed: false
    };

    setWishlists(prev => [...prev, newWishlist]);
    setCurrentWishlistId(newWishlist.id);
    
    window.dispatchEvent(new CustomEvent('savingsReset'));
    window.dispatchEvent(new CustomEvent('wishlistChanged'));
    
    toast({
      title: "Wishlist Ditambahkan",
      description: `${newWishlist.name} telah ditambahkan ke wishlist kamu.`,
    });
  };

  const updateWishlist = (id: string, data: Partial<WishlistItemData>) => {
    setWishlists(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...data } : item
      )
    );
  };

  const deleteWishlist = (id: string) => {
    if (wishlists.length <= 1) {
      toast({
        title: "Tidak Dapat Menghapus",
        description: "Minimal harus ada satu wishlist.",
        variant: "destructive"
      });
      return;
    }

    const wishlistToDelete = wishlists.find(w => w.id === id);

    setWishlists(prev => prev.filter(item => item.id !== id));
    
    if (currentWishlistId === id) {
      const newCurrent = wishlists.find(w => w.id !== id);
      if (newCurrent) {
        setCurrentWishlistId(newCurrent.id);
        window.dispatchEvent(new CustomEvent('savingsReset'));
        window.dispatchEvent(new CustomEvent('wishlistChanged'));
      }
    }

    if (wishlistToDelete) {
      toast({
        title: "Wishlist Dihapus",
        description: `${wishlistToDelete.name} telah dihapus.`,
      });
    }
  };

  const selectWishlist = (id: string) => {
    if (id === currentWishlistId) return;
    
    setCurrentWishlistId(id);
    
    window.dispatchEvent(new CustomEvent('savingsReset'));
    window.dispatchEvent(new CustomEvent('wishlistChanged'));
    
    const selected = wishlists.find(w => w.id === id);
    if (selected) {
      toast({
        title: "Wishlist Diubah",
        description: `Sekarang menabung untuk: ${selected.name}`,
      });
    }
  };

  const getCurrentWishlist = () => {
    return wishlists.find(w => w.id === currentWishlistId);
  };

  const resetSavings = (id: string) => {
    setWishlists(prev => 
      prev.map(item => 
        item.id === id ? { ...item, saved: 0 } : item
      )
    );
    
    window.dispatchEvent(new CustomEvent('savingsReset'));
    
    toast({
      title: "Tabungan Direset",
      description: "Tabunganmu telah direset menjadi 0.",
    });
  };

  const addSavings = (id: string, amount: number) => {
    setWishlists(prev => 
      prev.map(item => {
        if (item.id === id) {
          const newSaved = item.saved + amount;
          const completed = newSaved >= item.price;
          return { 
            ...item, 
            saved: newSaved,
            completed 
          };
        }
        return item;
      })
    );
    
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    
    window.dispatchEvent(new CustomEvent('savingsAdded', {
      detail: {
        date: day,
        month: month,
        year: year,
        amount: amount
      }
    }));
    
    toast({
      title: "Tabungan Berhasil Ditambahkan!",
      description: `Rp ${amount.toLocaleString('id-ID')} telah ditambahkan ke tabunganmu.`,
    });
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlists,
        currentWishlistId,
        addWishlist,
        updateWishlist,
        deleteWishlist,
        selectWishlist,
        getCurrentWishlist,
        resetSavings,
        addSavings
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
