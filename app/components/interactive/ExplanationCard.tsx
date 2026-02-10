import React from 'react';
import { motion } from 'framer-motion';

interface ExplanationCardProps {
  title: string;
  description: string;
  onClose?: () => void;
  color?: string;
}

const ExplanationCard: React.FC<ExplanationCardProps> = ({
  title,
  description,
  onClose,
  color // We'll ignore the passed bg color for the card background to keep it dark themed, 
  // or we can use it as a border/accent. Let's use it as a border.
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={`p-6 rounded-2xl shadow-2xl border-2 ${color ? color.replace('bg-', 'border-') : 'border-blue-500'} bg-slate-800 relative max-w-md mx-auto my-4`}
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white transition-colors"
          aria-label="Close"
        >
          ✕
        </button>
      )}
      <h3 className={`text-xl font-bold mb-3 ${color ? color.replace('bg-', 'text-').replace('400', '300') : 'text-blue-300'}`}>
        {title}
      </h3>
      <p className="text-slate-300 leading-relaxed text-lg font-medium">
        {description}
      </p>
    </motion.div>
  );
};

export default ExplanationCard;
