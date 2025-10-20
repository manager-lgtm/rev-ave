import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { X, Gift, ArrowRight, Clock, Users } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { storage } from './utils/storage';

interface ExitIntentPopupProps {
  onClose: () => void;
  onBookCall: () => void;
  onSubscribe?: (email: string) => void;
}

export const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({ 
  onClose, 
  onBookCall,
  onSubscribe 
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Social proof data
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [visitorCount] = useState(Math.floor(Math.random() * 50) + 150); // Mock visitor count

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "E-commerce Entrepreneur", 
      text: "Revenue Avenue helped me scale from $10K to $100K monthly in 8 months!",
      result: "+900% Growth"
    },
    {
      name: "Marcus Rodriguez",
      role: "SaaS Founder",
      text: "Their systems approach transformed my chaotic startup into a profitable machine.",
      result: "$2M Valuation"
    },
    {
      name: "Jennifer Kim",
      role: "Service Business Owner",
      text: "Finally found the missing piece - now I work ON my business, not IN it.",
      result: "40hrs → 20hrs"
    }
  ];

  // Rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleEmailSubmit = async () => {
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (onSubscribe) {
      onSubscribe(email);
    }

    // Save lead magnet request
    storage.set('lead_magnet_requested', {
      email,
      timestamp: Date.now(),
      source: 'exit_intent'
    });

    setHasSubmitted(true);
    setIsSubmitting(false);

    // Auto-close after success
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  const handleBookCall = () => {
    // Track conversion
    storage.set('exit_intent_conversion', {
      type: 'booking',
      timestamp: Date.now()
    });
    
    onBookCall();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-2xl"
      >
        <Card className="relative overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm transition-all hover:scale-105"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>

          {/* Success State */}
          {hasSubmitted ? (
            <div className="p-8 text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center"
              >
                <Gift className="w-8 h-8 text-white" />
              </motion.div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-gray-900">
                  Success! Check Your Email 📧
                </h3>
                <p className="text-gray-600">
                  Your Business Growth Blueprint is on its way! Plus, you'll get exclusive access to our weekly revenue optimization tips.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Header with urgency */}
              <div className="ra-cta-wealth p-6 pb-4">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Clock className="w-5 h-5 text-[var(--ra-cta-wealth-secondary)]" />
                  <span className="text-sm font-medium text-[var(--ra-cta-wealth-secondary)]">
                    ⚡ Wait! Don't Miss This
                  </span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
                  Get Your FREE Business Growth Blueprint
                </h2>
                
                <p className="text-center text-[var(--ra-cta-wealth-accent)] opacity-90">
                  The exact 5-step system our clients use to scale from side hustles to 7-figure empires
                </p>
              </div>

              {/* Main Content */}
              <div className="p-6 pt-2 space-y-6">
                {/* Social Proof with Live Updates */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        {visitorCount} people viewed this today
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-600">Live</span>
                    </div>
                  </div>
                  
                  {/* Rotating Testimonials */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentTestimonial}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-2"
                    >
                      <p className="text-sm italic text-green-700">
                        "{testimonials[currentTestimonial].text}"
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-green-800">
                          — {testimonials[currentTestimonial].name}, {testimonials[currentTestimonial].role}
                        </span>
                        <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                          {testimonials[currentTestimonial].result}
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* What They Get */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                      <Gift className="w-4 h-4 text-[var(--ra-cta-wealth-secondary)]" />
                      <span>Inside Your Blueprint:</span>
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start space-x-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>5-Phase Revenue Scaling System</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>Profit Optimization Checklist</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>Empire-Building Templates</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>Weekly Revenue Tips (Email Series)</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Perfect If You're:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start space-x-2">
                        <span className="text-[var(--ra-cta-wealth-secondary)] mt-0.5">→</span>
                        <span>Stuck at $10K-50K monthly</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-[var(--ra-cta-wealth-secondary)] mt-0.5">→</span>
                        <span>Ready to scale systematically</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-[var(--ra-cta-wealth-secondary)] mt-0.5">→</span>
                        <span>Want proven frameworks</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Email Capture */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && handleEmailSubmit()}
                      disabled={isSubmitting}
                    />
                    <Button
                      onClick={handleEmailSubmit}
                      disabled={!email || isSubmitting}
                      className="ra-btn-primary px-6 flex items-center space-x-2"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Gift className="w-4 h-4" />
                          <span>Get FREE Blueprint</span>
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <span>✓ 100% Free</span>
                    <span>✓ No Spam</span>
                    <span>✓ Unsubscribe Anytime</span>
                  </div>
                </div>

                {/* Alternative CTA */}
                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-3">
                    Or skip the wait and get <span className="font-semibold">personalized guidance</span>:
                  </p>
                  <Button
                    onClick={handleBookCall}
                    variant="outline"
                    className="ra-btn-outline flex items-center space-x-2"
                  >
                    <span>Book Free Strategy Call</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
};

// Hook to manage exit intent detection with stable references
export const useExitIntent = (options: {
  enabled?: boolean;
  delay?: number;
  showOnMobile?: boolean;
  onExitIntent?: () => void;
}) => {
  const {
    enabled = true,
    delay = 1000,
    showOnMobile = false,
    onExitIntent
  } = options;

  // Create stable callback reference
  const stableOnExitIntent = useCallback(() => {
    onExitIntent?.();
  }, [onExitIntent]);

  useEffect(() => {
    if (!enabled) return;

    // Check if already shown
    const hasShown = storage.get<boolean>('exit_intent_shown');
    if (hasShown) return;

    // Don't show on mobile unless explicitly enabled
    const isMobile = window.innerWidth < 768;
    if (isMobile && !showOnMobile) return;

    let timeoutId: NodeJS.Timeout;
    
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves from the top
      if (e.clientY <= 0) {
        timeoutId = setTimeout(() => {
          stableOnExitIntent();
          storage.set('exit_intent_shown', true, { expiry: 24 * 60 * 60 * 1000 }); // 24 hours
        }, delay);
      }
    };

    const handleMouseEnter = () => {
      clearTimeout(timeoutId);
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      clearTimeout(timeoutId);
    };
  }, [enabled, delay, showOnMobile, stableOnExitIntent]); // Use stable callback in dependencies
};