
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';

interface SavingsDay {
  date: number;
  month: number;
  year: number;
  amount: number;
}

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

const SavingsCalendar: React.FC = () => {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth());
  const [year, setYear] = useState(currentDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(currentDate.getDate());
  const [savingsDays, setSavingsDays] = useState<SavingsDay[]>([
    { date: 5, month: currentDate.getMonth(), year: currentDate.getFullYear(), amount: 50000 },
    { date: 12, month: currentDate.getMonth(), year: currentDate.getFullYear(), amount: 100000 },
    { date: 18, month: currentDate.getMonth(), year: currentDate.getFullYear(), amount: 75000 },
    { date: 25, month: currentDate.getMonth(), year: currentDate.getFullYear(), amount: 200000 },
  ]);

  useEffect(() => {
    // Listen for savings added events
    const handleSavingsAdded = (event: CustomEvent<SavingsDay>) => {
      const newSaving = event.detail;
      
      // Check if we already have a saving for this day
      const existingIndex = savingsDays.findIndex(day => 
        day.date === newSaving.date && 
        day.month === newSaving.month && 
        day.year === newSaving.year
      );
      
      if (existingIndex >= 0) {
        // Update existing saving
        const updatedSavings = [...savingsDays];
        updatedSavings[existingIndex].amount += newSaving.amount;
        setSavingsDays(updatedSavings);
      } else {
        // Add new saving
        setSavingsDays(prev => [...prev, newSaving]);
      }
      
      // Auto-select the date that was just updated
      setSelectedDate(newSaving.date);
    };

    window.addEventListener('savingsAdded', handleSavingsAdded as EventListener);
    
    return () => {
      window.removeEventListener('savingsAdded', handleSavingsAdded as EventListener);
    };
  }, [savingsDays]);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const hasSavings = (day: number) => {
    return savingsDays.some(saving => 
      saving.date === day && saving.month === month && saving.year === year
    );
  };

  const getSavingAmount = (day: number) => {
    const saving = savingsDays.find(s => 
      s.date === day && s.month === month && s.year === year
    );
    return saving ? saving.amount : 0;
  };

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
    setSelectedDate(null);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day invisible"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear();
      const isSelected = day === selectedDate;
      const hasSavingsForDay = hasSavings(day);

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(day)}
          className={cn(
            "calendar-day group",
            isToday && !isSelected && "border border-wishlist-primary dark:border-purple-500",
            isSelected && "active dark:bg-purple-800",
            hasSavingsForDay && "has-savings",
            "dark:text-white dark:hover:bg-gray-800"
          )}
        >
          {day}
          {hasSavingsForDay && (
            <CheckCircle2 className="absolute bottom-1 left-1/2 transform -translate-x-1/2 h-3 w-3 text-wishlist-green dark:text-green-400 animate-scale-in" />
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <Card className="w-full dark:bg-gray-900 dark:border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium flex items-center dark:text-white">
          <Calendar className="h-5 w-5 mr-2 text-wishlist-primary dark:text-purple-400" />
          Kalender Tabungan
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevMonth}
            className="h-8 w-8 text-wishlist-primary hover:text-wishlist-secondary hover:bg-wishlist-light dark:text-purple-400 dark:hover:bg-gray-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium dark:text-gray-300">
            {MONTHS[month]} {year}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextMonth}
            className="h-8 w-8 text-wishlist-primary hover:text-wishlist-secondary hover:bg-wishlist-light dark:text-purple-400 dark:hover:bg-gray-800"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {renderCalendarDays()}
        </div>
        
        {selectedDate && (
          <div className="mt-4 p-3 bg-wishlist-light dark:bg-gray-800 rounded-lg animate-scale-in">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium dark:text-white">
                {selectedDate} {MONTHS[month]} {year}
              </p>
              {hasSavings(selectedDate) ? (
                <p className="text-sm font-bold text-wishlist-green dark:text-green-400 flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  +Rp{getSavingAmount(selectedDate).toLocaleString('id-ID')}
                </p>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">Belum ada tabungan</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavingsCalendar;
