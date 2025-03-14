
import React, { useState } from 'react';
import { CheckCircle2, Circle, List, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from '@/hooks/use-toast';

interface ChecklistItem {
  id: string;
  date: Date;
  amount: number;
  note: string;
  completed: boolean;
}

const SavingsChecklist: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: '1',
      date: new Date(),
      amount: 50000,
      note: 'Hemat dari uang makan siang',
      completed: true,
    },
    {
      id: '2',
      date: new Date(Date.now() - 86400000),
      amount: 75000,
      note: 'Bonus dari pekerjaan sampingan',
      completed: true,
    },
    {
      id: '3',
      date: new Date(Date.now() - 172800000),
      amount: 100000,
      note: 'Tabungan mingguan',
      completed: true,
    },
  ]);
  const [newAmount, setNewAmount] = useState('');
  const [newNote, setNewNote] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

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
    if (!newAmount || parseInt(newAmount) <= 0) {
      toast({
        title: "Error",
        description: "Silakan masukkan jumlah tabungan yang valid",
        variant: "destructive",
      });
      return;
    }

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      date: new Date(),
      amount: parseInt(newAmount),
      note: newNote || 'Tabungan harian',
      completed: true,
    };

    setItems([newItem, ...items]);
    setNewAmount('');
    setNewNote('');
    setIsAddingNew(false);
    
    toast({
      title: "Checklist Berhasil Ditambahkan!",
      description: `Tabungan sebesar Rp ${parseInt(newAmount).toLocaleString('id-ID')} telah dicatat.`,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <List className="h-5 w-5 mr-2 text-wishlist-primary" />
          Checklist Tabungan
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="text-wishlist-primary hover:text-wishlist-secondary hover:bg-wishlist-light"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          <span className="text-sm">Tambah</span>
        </Button>
      </CardHeader>
      <CardContent>
        {isAddingNew && (
          <div className="mb-4 p-4 bg-wishlist-light rounded-xl animate-scale-in">
            <div className="mb-3">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Jumlah Tabungan (Rp)
              </label>
              <Input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="50000"
                className="w-full"
              />
            </div>
            <div className="mb-3">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Catatan (Opsional)
              </label>
              <Input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Hemat dari uang jajan"
                className="w-full"
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
                className="flex-1"
              >
                Batal
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {items.map((item) => (
            <div 
              key={item.id} 
              className={cn(
                "checklist-item group",
                item.completed ? "border-l-4 border-wishlist-green" : "border-l-4 border-gray-200"
              )}
            >
              <div
                className="flex-shrink-0 mr-3 cursor-pointer"
                onClick={() => toggleItemCompletion(item.id)}
              >
                {item.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-wishlist-green" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400 group-hover:text-wishlist-primary" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">{formatDate(item.date)}</p>
                <p className="text-xs text-gray-500 mt-1">{item.note}</p>
              </div>
              <div className="text-right">
                <p className={cn(
                  "font-bold",
                  item.completed ? "text-wishlist-green" : "text-gray-400"
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
