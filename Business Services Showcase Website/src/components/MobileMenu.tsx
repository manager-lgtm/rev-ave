import React, { useState, useRef, useEffect } from 'react';
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Badge } from "./ui/badge";
import { 
  Menu, 
  X, 
  Search, 
  GitCompare, 
  Brain, 
  Package, 
  HelpCircle, 
  Award, 
  Phone,
  ChevronRight,
  Zap,
  TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MobileMenuProps {
  currentPage: string;
  comparisonCount: number;
  onStartRecommender: () => void;
  onViewBundles: () => void;
  onViewServiceAssessment: () => void;
  onViewComparison: () => void;
  onViewFAQ: () => void;
  onViewSocialProof: () => void;
  onBookCall: () => void;
  visitorCount?: number;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  currentPage,
  comparisonCount,
  onStartRecommender,
  onViewBundles,
  onViewServiceAssessment,
  onViewComparison,
  onViewFAQ,
  onViewSocialProof,
  onBookCall,
  visitorCount = 0
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'main' | 'tools' | 'help'>('main');
  
  // Touch handling for swipe gestures
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current || !touchStartY.current) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchStartX.current - touchEndX;
    const deltaY = touchStartY.current - touchEndY;

    // Only handle horizontal swipes with minimal vertical movement
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Swipe left - close menu
        setIsOpen(false);
      }
      // Swipe right would open menu, but that's handled by the Sheet component
    }

    touchStartX.current = 0;
    touchStartY.current = 0;
  };

  const menuItems = {
    main: [
      {
        icon: Brain,
        label: 'Find My Service',
        description: 'Personalized service assessment',
        action: () => { onViewServiceAssessment(); setIsOpen(false); },
        badge: 'Smart',
        badgeColor: 'bg-blue-100 text-blue-700'
      },
      {
        icon: Package,
        label: 'Service Bundles',
        description: 'Save with combo deals',
        action: () => { onViewBundles(); setIsOpen(false); },
        badge: 'Save 25%',
        badgeColor: 'bg-green-100 text-green-700'
      }
    ],
    tools: [
      {
        icon: GitCompare,
        label: 'Compare Services',
        description: `${comparisonCount} services selected`,
        action: () => { onViewComparison(); setIsOpen(false); },
        badge: comparisonCount > 0 ? `${comparisonCount}` : null,
        badgeColor: 'bg-orange-100 text-orange-700',
        disabled: comparisonCount < 2
      },
      {
        icon: Search,
        label: 'Search Services',
        description: 'Find exactly what you need',
        action: () => {
          // In a real app, this would open a search modal
          setIsOpen(false);
        }
      }
    ],
    help: [
      {
        icon: HelpCircle,
        label: 'FAQ & Support',
        description: 'Get instant answers',
        action: () => { onViewFAQ(); setIsOpen(false); }
      },
      {
        icon: Award,
        label: 'Success Stories',
        description: 'See client results',
        action: () => { onViewSocialProof(); setIsOpen(false); }
      }
    ]
  };

  const handleItemClick = (item: any) => {
    if (!item.disabled) {
      item.action();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="ra-btn-outline lg:hidden p-2 relative"
        >
          <Menu className="w-5 h-5" />
          {comparisonCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--ra-gold)] text-[var(--ra-olive)] text-xs rounded-full flex items-center justify-center font-bold">
              {comparisonCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        side="right" 
        className="w-full sm:w-80 p-0"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header */}
        <SheetHeader className="p-6 pb-4 border-b bg-gradient-to-r from-[var(--ra-cream)] to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 ra-logo rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">RA</span>
              </div>
              <SheetTitle className="text-[var(--ra-olive)]">Revenue Avenue</SheetTitle>
            </div>
            
            {visitorCount > 0 && (
              <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                Visit #{visitorCount}
              </Badge>
            )}
          </div>
          
          {/* Live visitor count */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>{Math.floor(Math.random() * 20) + 30} people viewing now</span>
          </div>
        </SheetHeader>

        {/* Primary CTA - Thumb-friendly positioning */}
        <div className="p-6 pb-4">
          <Button 
            onClick={() => { onBookCall(); setIsOpen(false); }}
            className="w-full ra-btn-primary h-12 text-lg font-semibold flex items-center justify-center space-x-2"
            style={{ minHeight: '48px' }} // Ensure thumb-friendly size
          >
            <Phone className="w-5 h-5" />
            <span>Book Strategy Call</span>
            <Zap className="w-4 h-4" />
          </Button>
          <p className="text-center text-xs text-gray-500 mt-2">
            ⚡ Free 30-min consultation • No commitment
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pb-4">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {[
              { id: 'main', label: 'Services', icon: TrendingUp },
              { id: 'tools', label: 'Tools', icon: Search },
              { id: 'help', label: 'Help', icon: HelpCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all min-h-[44px] ${
                  activeSection === tab.id
                    ? 'bg-white text-[var(--ra-olive)] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Menu Content */}
        <div className="flex-1 px-6 pb-6 space-y-2 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              {menuItems[activeSection].map((item, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleItemClick(item)}
                  disabled={item.disabled}
                  className={`w-full p-4 rounded-xl bg-white border border-gray-200 hover:border-[var(--ra-gold)] transition-all text-left min-h-[64px] flex items-center space-x-4 ${
                    item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md active:scale-98'
                  }`}
                  style={{ minHeight: '64px' }} // Thumb-friendly touch target
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-[var(--ra-cream)] to-[var(--ra-gold)] rounded-lg flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-[var(--ra-olive)]" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">{item.label}</h4>
                      {item.badge && (
                        <Badge className={`text-xs ${item.badgeColor}`}>
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{item.description}</p>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </motion.button>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Swipe Indicator */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            <span>←</span>
            <span>Swipe left to close</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Hook for mobile-specific interactions
export const useMobileInteractions = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Enhanced touch handling for mobile
  const createTouchHandler = (onTap: () => void, onHold?: () => void) => {
    let touchStartTime = 0;
    let holdTimeout: NodeJS.Timeout;

    return {
      onTouchStart: (e: React.TouchEvent) => {
        touchStartTime = Date.now();
        
        if (onHold) {
          holdTimeout = setTimeout(() => {
            onHold();
          }, 500); // 500ms hold time
        }
      },
      onTouchEnd: (e: React.TouchEvent) => {
        clearTimeout(holdTimeout);
        
        const touchDuration = Date.now() - touchStartTime;
        if (touchDuration < 500) { // Quick tap
          onTap();
        }
      },
      onTouchCancel: () => {
        clearTimeout(holdTimeout);
      }
    };
  };

  return { isMobile, createTouchHandler };
};