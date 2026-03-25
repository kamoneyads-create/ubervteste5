import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SkeletonLoaderProps {
  children: React.ReactNode;
  show?: boolean;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ children, show = true }) => {
  const [loading, setLoading] = useState(show);

  useEffect(() => {
    if (!show) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600); // 600ms is enough for a snappy feel
    return () => clearTimeout(timer);
  }, [show]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-white z-[9999] flex flex-col"
          >
            <div className="p-4 space-y-6">
              {/* Card Skeleton */}
              <div className="w-full h-48 bg-gray-50 rounded-2xl animate-pulse" />
              
              {/* Title Skeleton */}
              <div className="space-y-2">
                <div className="w-2/3 h-6 bg-gray-100 rounded animate-pulse" />
                <div className="w-1/2 h-4 bg-gray-50 rounded animate-pulse" />
              </div>

              {/* List items Skeleton */}
              <div className="space-y-4 pt-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="w-3/4 h-4 bg-gray-100 rounded animate-pulse" />
                      <div className="w-1/2 h-3 bg-gray-50 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Nav Skeleton if needed, but usually it's static */}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={show ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ duration: show ? 0.3 : 0 }}
            className="h-full w-full"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkeletonLoader;
