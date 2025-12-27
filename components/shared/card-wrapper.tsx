import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardWrapperProps {
  children: ReactNode;
  className?: string;
}

export const CardWrapper = ({ children, className = '' }: CardWrapperProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    transition={{ duration: 0.3 }}
    className={`w-full bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-2xl hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 ${className}`}
  >
    {children}
  </motion.div>
);

export const CardHeader = ({ children, className = '' }: CardWrapperProps) => (
  <div className={`flex justify-between items-start gap-4 ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = '' }: CardWrapperProps) => (
  <div className={`space-y-3 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }: CardWrapperProps) => (
  <div className={`flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700 ${className}`}>
    {children}
  </div>
);

export const IconButton = ({ 
  icon: Icon, 
  onClick, 
  variant = 'default',
  disabled = false
}: {
  icon: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'danger' | 'primary';
  disabled?: boolean;
}) => {
  const variantStyles = {
    default: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50',
    primary: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-lg transition-all duration-200 ${variantStyles[variant]} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {Icon}
    </motion.button>
  );
};
