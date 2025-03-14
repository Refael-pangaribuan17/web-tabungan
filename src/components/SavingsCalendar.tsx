
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
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

// Example data
const EXAMPLE_SAVINGS: SavingsDay[] = [
  { date: 5, month: 5, year: 2023, amount: 50000 },
  { date: 12, month: 5, year: 2023, amount: 100000 },
  { date: 18, month: 5, year: 2023, amount: 75000 },
  { date: 25, month: 5, year: 2023, amount: 200000 },
];

const SavingsCalendar: React.FC = () => {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth());
  const [year, setYear] = useState(currentDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(currentDate.getDate());

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const hasSavings = (day: number) => {
    return EXAMPLE_SAVINGS.some(saving => 
      saving.date === day && saving.month === month && saving.year === year
    );
  };

  const getSavingAmount = (day: number) => {
    const saving = EXAMPLE_SAVINGS.find(s => 
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
            "calendar-day",
            isToday && !isSelected && "border border-wishlist-primary",
            isSelected && "active",
            hasSavingsForDay && "has-savings"
          )}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-wishlist-primary" />
          Kalender Tabungan
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevMonth}
            className="h-8 w-8 text-wishlist-primary hover:text-wishlist-secondary hover:bg-wishlist-light"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {MONTHS[month]} {year}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextMonth}
            className="h-8 w-8 text-wishlist-primary hover:text-wishlist-secondary hover:bg-wishlist-light"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {renderCalendarDays()}
        </div>
        
        {selectedDate && (
          <div className="mt-4 p-3 bg-wishlist-light rounded-lg animate-scale-in">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">
                {selectedDate} {MONTHS[month]} {year}
              </p>
              {hasSavings(selectedDate) ? (
                <p className="text-sm font-bold text-wishlist-green">
                  +Rp{getSavingAmount(selectedDate).toLocaleString('id-ID')}
                </p>
              ) : (
                <p className="text-sm text-gray-500">Belum ada tabungan</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavingsCalendar;
