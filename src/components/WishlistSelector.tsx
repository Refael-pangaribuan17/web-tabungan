
import React, { useState } from 'react';
import { PlusCircle, Check, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { useWishlist, WishlistItemData } from '@/contexts/WishlistContext';
import SetTargetForm from './SetTargetForm';
import { formatCurrency } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { toast } from '@/hooks/use-toast';

const WishlistSelector: React.FC = () => {
  const { 
    wishlists, 
    currentWishlistId, 
    selectWishlist, 
    deleteWishlist, 
    addWishlist,
    getCurrentWishlist
  } = useWishlist();
  
  const currentWishlist = getCurrentWishlist();
  const [isNewItemDialogOpen, setIsNewItemDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [wishlistToDelete, setWishlistToDelete] = useState<string | null>(null);
  const [showAllWishlists, setShowAllWishlists] = useState(false);
  
  const handleOpenDeleteDialog = (id: string) => {
    setWishlistToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (wishlistToDelete) {
      deleteWishlist(wishlistToDelete);
      setDeleteDialogOpen(false);
      setWishlistToDelete(null);
    }
  };

  const handleNewWishlistItem = (newItem: Omit<WishlistItemData, 'id' | 'dateCreated' | 'completed'>) => {
    addWishlist(newItem);
    setIsNewItemDialogOpen(false);
  };
  
  // Determine if current wishlist is complete
  const isCurrentComplete = currentWishlist ? currentWishlist.saved >= currentWishlist.price : false;
  
  // Only show completed wishlists in main display
  const completedWishlists = wishlists.filter(w => w.completed);
  const incompleteWishlists = wishlists.filter(w => !w.completed);
  
  // Display wishlists based on toggle
  const displayWishlists = showAllWishlists ? wishlists : wishlists.slice(0, 5);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-wishlist-dark dark:text-white">Daftar Wishlist</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setShowAllWishlists(!showAllWishlists)}
            className="dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            {showAllWishlists ? (
              <><ChevronUp className="h-4 w-4 mr-1" /> Sembunyikan</>
            ) : (
              <><ChevronDown className="h-4 w-4 mr-1" /> Lihat Semua</>
            )}
          </Button>
          <Button 
            onClick={() => setIsNewItemDialogOpen(true)}
            className="button-gradient"
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            <span>Tambah Baru</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {displayWishlists.map((wishlist) => (
          <div 
            key={wishlist.id} 
            className={`relative p-3 rounded-lg border transition-all ${
              wishlist.id === currentWishlistId 
                ? 'border-purple-500 dark:border-purple-400 shadow-md' 
                : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
            } ${
              wishlist.completed 
                ? 'bg-green-50 dark:bg-green-900/20' 
                : 'bg-white dark:bg-gray-800'
            }`}
          >
            {wishlist.id === currentWishlistId && (
              <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full px-2 py-1">
                Aktif
              </div>
            )}
            {wishlist.completed && (
              <div className="absolute -top-2 -left-2 bg-green-500 text-white rounded-full p-1">
                <Check className="h-3 w-3" />
              </div>
            )}
            
            <div className="flex items-center space-x-3">
              <img 
                src={wishlist.image} 
                alt={wishlist.name} 
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm dark:text-white truncate">{wishlist.name}</h4>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {formatCurrency(wishlist.saved)} / {formatCurrency(wishlist.price)}
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-1.5">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                    style={{ width: `${Math.min(100, (wishlist.saved / wishlist.price) * 100)}%` }}
                  />
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 dark:text-gray-400 dark:hover:text-white"
                  >
                    <span className="sr-only">Open menu</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="dark:bg-gray-900 dark:border-gray-800">
                  {wishlist.id !== currentWishlistId && (
                    <DropdownMenuItem 
                      onClick={() => selectWishlist(wishlist.id)}
                      className="dark:hover:bg-gray-800 dark:text-gray-300"
                    >
                      Pilih Wishlist
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={() => handleOpenDeleteDialog(wishlist.id)}
                    className="text-red-500 dark:text-red-400 dark:hover:bg-gray-800"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Hapus</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
      
      {/* Show message if there are more wishlists not displayed */}
      {!showAllWishlists && wishlists.length > 5 && (
        <div className="text-center mt-4">
          <Button 
            variant="ghost" 
            onClick={() => setShowAllWishlists(true)}
            className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
          >
            <ChevronDown className="h-4 w-4 mr-1" />
            <span>Lihat {wishlists.length - 5} wishlist lainnya</span>
          </Button>
        </div>
      )}
      
      {/* If current wishlist is complete, show notification */}
      {isCurrentComplete && (
        <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800 dark:text-green-300">
                Selamat! Kamu telah mencapai target tabungan untuk {currentWishlist?.name}.
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Pilih wishlist lain atau tambahkan wishlist baru.
              </p>
            </div>
            <Button 
              size="sm" 
              onClick={() => setIsNewItemDialogOpen(true)}
              className="button-gradient ml-2"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              <span>Tambah Baru</span>
            </Button>
          </div>
        </div>
      )}
      
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
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="dark:bg-gray-900 dark:border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white">Hapus Wishlist</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-400">
              Apakah kamu yakin ingin menghapus wishlist ini? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WishlistSelector;
