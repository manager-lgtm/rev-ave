import React, { useState } from 'react';
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp, Eye, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProgressiveDisclosureProps {
  children: React.ReactNode;
  previewLines?: number;
  className?: string;
  showReadTime?: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;
}

export const ProgressiveDisclosure: React.FC<ProgressiveDisclosureProps> = ({
  children,
  previewLines = 3,
  className = '',
  showReadTime = false,
  onExpand,
  onCollapse
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate estimated read time (assuming ~200 words per minute)
  const getReadTime = (text: string): number => {
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / 200);
  };

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    
    if (newState) {
      onExpand?.();
    } else {
      onCollapse?.();
    }
  };

  // Extract text content for read time calculation
  const textContent = typeof children === 'string' ? children : '';
  const readTime = showReadTime && textContent ? getReadTime(textContent) : 0;

  return (
    <div className={`relative ${className}`}>
      <div className={`overflow-hidden transition-all duration-300 ${
        !isExpanded ? `line-clamp-${previewLines}` : ''
      }`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={isExpanded ? 'expanded' : 'collapsed'}
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Gradient Fade for Preview */}
      {!isExpanded && (
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      )}

      {/* Toggle Button */}
      <div className="mt-3 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggle}
          className="text-[var(--ra-olive)] hover:text-[var(--ra-olive-hover)] p-0 h-auto font-medium flex items-center space-x-2"
        >
          <span>{isExpanded ? 'Show Less' : 'Read More'}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>

        {showReadTime && readTime > 0 && !isExpanded && (
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{readTime} min read</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Specific version for service cards
interface ServiceProgressiveDisclosureProps {
  description: string;
  features?: string[];
  benefits?: string[];
  previewLength?: number;
  className?: string;
}

export const ServiceProgressiveDisclosure: React.FC<ServiceProgressiveDisclosureProps> = ({
  description,
  features = [],
  benefits = [],
  previewLength = 150,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'features' | 'benefits'>('description');

  const shouldTruncate = description.length > previewLength;
  const previewText = shouldTruncate ? description.slice(0, previewLength) + '...' : description;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Preview/Full Description */}
      <div>
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Tabs for expanded content */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {[
                  { id: 'description', label: 'Overview', count: null },
                  { id: 'features', label: 'Features', count: features.length },
                  { id: 'benefits', label: 'Benefits', count: benefits.length }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                      activeTab === tab.id
                        ? 'bg-white text-[var(--ra-olive)] shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                    {tab.count !== null && tab.count > 0 && (
                      <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                        activeTab === tab.id
                          ? 'bg-[var(--ra-olive)] text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'description' && (
                    <p className="text-gray-600 leading-relaxed">{description}</p>
                  )}

                  {activeTab === 'features' && (
                    <div className="space-y-2">
                      {features.length > 0 ? (
                        <ul className="space-y-2">
                          {features.map((feature, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start space-x-2 text-gray-600"
                            >
                              <span className="text-[var(--ra-gold)] mt-1">✓</span>
                              <span>{feature}</span>
                            </motion.li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 italic">Features will be detailed during consultation.</p>
                      )}
                    </div>
                  )}

                  {activeTab === 'benefits' && (
                    <div className="space-y-2">
                      {benefits.length > 0 ? (
                        <ul className="space-y-2">
                          {benefits.map((benefit, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start space-x-2 text-gray-600"
                            >
                              <span className="text-green-500 mt-1">→</span>
                              <span>{benefit}</span>
                            </motion.li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 italic">Benefits will be customized to your business needs.</p>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.p
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-gray-600 leading-relaxed"
            >
              {previewText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle Button */}
      {shouldTruncate && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[var(--ra-olive)] hover:text-[var(--ra-olive-hover)] p-0 h-auto font-medium flex items-center space-x-2"
        >
          <Eye className="w-4 h-4" />
          <span>{isExpanded ? 'Show Less' : 'Learn More'}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>
      )}
    </div>
  );
};

// Hook for tracking progressive disclosure analytics
export const useProgressiveDisclosureAnalytics = () => {
  const trackExpansion = (contentId: string, contentType: 'service' | 'feature' | 'faq') => {
    // In production, this would send to your analytics service
    console.log(`Progressive disclosure expanded: ${contentType}/${contentId}`);
    
    // Store in localStorage for now
    const expansions = JSON.parse(localStorage.getItem('ra_content_expansions') || '[]');
    expansions.push({
      contentId,
      contentType,
      timestamp: Date.now()
    });
    localStorage.setItem('ra_content_expansions', JSON.stringify(expansions.slice(-100))); // Keep last 100
  };

  const trackCollapse = (contentId: string, timeSpentExpanded: number) => {
    console.log(`Progressive disclosure collapsed: ${contentId}, time spent: ${timeSpentExpanded}ms`);
  };

  return { trackExpansion, trackCollapse };
};