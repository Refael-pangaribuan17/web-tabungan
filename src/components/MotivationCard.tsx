
import React from 'react';
import { Card, CardContent } from './ui/card';
import { Sparkles } from 'lucide-react';

const motivationalQuotes = [
  "Menabung adalah investasi untuk masa depanmu.",
  "Setiap rupiah yang kamu tabung adalah satu langkah mendekati impianmu.",
  "Kebiasaan menabung hari ini akan mewujudkan mimpimu di masa depan.",
  "Kebahagiaan bukan dari berapa banyak yang kita miliki, tapi berapa bijak kita menggunakannya.",
  "Belilah apa yang kamu butuhkan, bukan apa yang kamu inginkan.",
];

const MotivationCard: React.FC = () => {
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  
  return (
    <Card className="bg-gradient-primary text-white dark:bg-gray-800 dark:border-none">
      <CardContent className="p-4 flex items-center">
        <Sparkles className="h-5 w-5 mr-3 flex-shrink-0 animate-pulse-subtle" />
        <p className="text-sm font-medium italic">{randomQuote}</p>
      </CardContent>
    </Card>
  );
};

export default MotivationCard;
