import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { WishlistItemData } from '@/contexts/WishlistContext';

interface SetTargetFormProps {
  onClose: () => void;
  onSave?: (item: Omit<WishlistItemData, 'id' | 'dateCreated' | 'completed'>) => void;
}

const categories = [
  { value: 'electronics', label: 'Elektronik' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'travel', label: 'Liburan' },
  { value: 'education', label: 'Pendidikan' },
  { value: 'home', label: 'Rumah Tangga' },
  { value: 'other', label: 'Lainnya' }
];

const SetTargetForm: React.FC<SetTargetFormProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImagePreview(event.target.result.toString());
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !price || !category || !targetDate) {
      toast({
        title: "Error",
        description: "Semua field harus diisi",
        variant: "destructive",
      });
      return;
    }

    const priceValue = parseInt(price);
    
    if (onSave) {
      onSave({
        image: imagePreview || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=500&auto=format&fit=crop',
        name: name,
        price: priceValue,
        saved: 0 // Start with 0 saved amount for new wishlist items
      });
    }
    
    toast({
      title: "Target Berhasil Dibuat!",
      description: `${name} telah ditambahkan ke wishlist kamu.`,
    });
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nama Barang</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Laptop Baru"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="price">Harga Barang (Rp)</Label>
        <Input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="5000000"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Kategori</Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger>
            <SelectValue placeholder="Pilih kategori" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="targetDate">Target Tanggal</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !targetDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {targetDate ? format(targetDate, "PPP") : <span>Pilih tanggal</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={targetDate}
              onSelect={setTargetDate}
              initialFocus
              disabled={(date) => date < new Date()}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label>Gambar Barang</Label>
        <div className="flex items-center space-x-4">
          <div className="min-w-24 h-24 rounded-md border border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center">
                <Upload className="mx-auto h-6 w-6 text-gray-400" />
                <span className="mt-1 text-xs text-gray-500 block">
                  Upload Gambar
                </span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleImageUpload}
            />
          </div>
          
          <div className="flex-1">
            <p className="text-sm text-gray-500">
              Upload gambar barang yang ingin kamu beli untuk memotivasi diri.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Batal
        </Button>
        <Button type="submit" className="button-gradient">
          Simpan
        </Button>
      </div>
    </form>
  );
};

export default SetTargetForm;
