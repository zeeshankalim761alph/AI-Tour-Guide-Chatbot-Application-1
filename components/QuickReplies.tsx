import React from 'react';

interface QuickRepliesProps {
  onSelect: (text: string) => void;
  language: 'en' | 'ur';
}

export const QuickReplies: React.FC<QuickRepliesProps> = ({ onSelect, language }) => {
  const suggestions = language === 'en' 
    ? ["Plan a 3-day trip to Paris", "Best food in Tokyo", "Budget tips for Bali", "Historical places in Rome"]
    : ["لاہور کا 3 دن کا سفر منصوبہ", "کراچی میں بہترین کھانا", "مری کے لیے بجٹ ٹپس", "اسلام آباد کے تاریخی مقامات"];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {suggestions.map((text, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(text)}
          className="whitespace-nowrap px-4 py-2 bg-travel-50 text-travel-700 border border-travel-200 rounded-full text-sm font-medium hover:bg-travel-100 transition-colors focus:outline-none focus:ring-2 focus:ring-travel-400"
        >
          {text}
        </button>
      ))}
    </div>
  );
};