import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type CategoryFilterProps = {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
};

const buttonVariants = {
  selected: {
    scale: 1.05,
    backgroundColor: 'rgb(var(--brand-500))',
    color: 'white',
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30
    }
  },
  unselected: {
    scale: 1,
    backgroundColor: 'transparent',
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30
    }
  }
};

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-3 justify-center">
        <motion.button
          onClick={() => onSelectCategory(null)}
          animate={selectedCategory === null ? 'selected' : 'unselected'}
          variants={buttonVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all",
            "border border-brand-200 dark:border-brand-700",
            selectedCategory === null
              ? "bg-brand-500 text-white dark:bg-brand-400"
              : "bg-transparent text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-800/50"
          )}
        >
          All Items
        </motion.button>
        {categories.map((category) => (
          <motion.button
            key={category}
            onClick={() => onSelectCategory(category)}
            animate={selectedCategory === category ? 'selected' : 'unselected'}
            variants={buttonVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              "border border-brand-200 dark:border-brand-700",
              selectedCategory === category
                ? "bg-brand-500 text-white dark:bg-brand-400"
                : "bg-transparent text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-800/50"
            )}
          >
            {category}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
