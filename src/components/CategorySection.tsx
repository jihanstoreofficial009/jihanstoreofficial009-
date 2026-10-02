import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Smartphone, 
  Shirt, 
  Sparkles, 
  Watch, 
  Heart, 
  Home, 
  Layers,
  ArrowRight
} from 'lucide-react';

interface CategorySectionProps {
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  const { categories, products } = useStore();

  const getCategoryIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'smartphone': return <Smartphone className="w-5 h-5" />;
      case 'shirt': return <Shirt className="w-5 h-5" />;
      case 'sparkles': return <Sparkles className="w-5 h-5" />;
      case 'watch': return <Watch className="w-5 h-5" />;
      case 'heart': return <Heart className="w-5 h-5" />;
      case 'home': return <Home className="w-5 h-5" />;
      default: return <Layers className="w-5 h-5" />;
    }
  };

  const getProductCount = (catId: string) => {
    if (catId === 'all') return products.length;
    return products.filter(p => p.category === catId).length;
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>ক্যাটাগরি সমূহ</span>
            <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
              Explore
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            আপনার পছন্দের ক্যাটাগরি বেছে নিন এবং ব্রাউজ করুন
          </p>
        </div>

        {selectedCategory !== 'all' && (
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>সব পণ্য দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Horizontal Scroll on Mobile, Grid on Larger Screens */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2.5 sm:gap-3">
        {/* All Products pill */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all group ${
            selectedCategory === 'all'
              ? 'bg-[#0B1E3F] text-amber-400 border-amber-500 shadow-md scale-102'
              : 'bg-white dark:bg-[#0B1E3F]/60 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-blue-900/60 hover:border-amber-400/50'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition ${
            selectedCategory === 'all' 
              ? 'bg-amber-500 text-slate-950 font-black' 
              : 'bg-slate-100 dark:bg-blue-900/60 text-amber-500 group-hover:scale-110'
          }`}>
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold truncate max-w-full">সব পণ্য</span>
          <span className="text-[10px] text-slate-400 dark:text-slate-400">
            {products.length} আইটেম
          </span>
        </button>

        {/* Dynamic Categories */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = getProductCount(cat.id);

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all group ${
                isSelected
                  ? 'bg-[#0B1E3F] text-amber-400 border-amber-500 shadow-md scale-102'
                  : 'bg-white dark:bg-[#0B1E3F]/60 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-blue-900/60 hover:border-amber-400/50'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition ${
                isSelected 
                  ? 'bg-amber-500 text-slate-950 font-black' 
                  : 'bg-slate-100 dark:bg-blue-900/60 text-amber-500 group-hover:scale-110'
              }`}>
                {getCategoryIcon(cat.icon)}
              </div>
              <span className="text-xs font-bold truncate max-w-full">
                {cat.nameBn || cat.name}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-400">
                {count} আইটেম
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
