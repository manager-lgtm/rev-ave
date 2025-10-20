import React, { useState, useEffect, useCallback } from "react";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Card, CardContent } from "./components/ui/card";
import { ErrorBoundary } from "./components/ErrorBoundary";
import {
  ExitIntentPopup,
  useExitIntent,
} from "./components/ExitIntentPopup";
import { MobileMenu } from "./components/MobileMenu";
import { BreadcrumbNav } from "./components/BreadcrumbNav";
import {
  ArrowLeft,
  Search,
  GitCompare,
  Brain,
  Package,
  HelpCircle,
  Award,
  ArrowRight,
  Zap,
  Star,
  Users,
  Trophy,
  Target,
  TrendingUp,
  Shield,
  CheckCircle2,
  Play,
  ChevronDown,
  Sparkles,
  Clock,
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  analyticsCache,
  userPreferences,
} from "./components/utils/storage";
// Remove problematic performance monitoring completely

// Enhanced imports with Analytics, A/B Testing, and SEO
import {
  AnalyticsProvider,
  useAnalytics,
} from "./components/Analytics";
import {
  ABTestProvider,
  useABTest,
  ABTestSwitch,
} from "./components/ABTesting";
import {
  HomepageSEO,
  ServiceSEO,
  PerformanceSEO,
} from "./components/SEO";

// Lazy-loaded components with proper error handling
import {
  ServicesListing,
  ServiceDetail,
  ContactForm,
  ServiceComparison,
  ServiceRecommender,
  ServiceBundles,
  ServiceAssessment,
  FAQSearch,
  SocialProof,
  usePreloadComponents,
} from "./components/LazyComponents";

function AppContent() {
  const [currentPage, setCurrentPage] = useState("services");
  const [selectedService, setSelectedService] = useState(null);
  const [comparisonServices, setComparisonServices] = useState(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);
  const [showMobileSearch, setShowMobileSearch] =
    useState(false);
  const [appInitialized, setAppInitialized] = useState(false);

  // Simple startup time tracking (non-intrusive)
  const startTime = React.useRef(Date.now());

  // Analytics and A/B Testing hooks - optimized with error handling
  const analytics = useAnalytics();
  const preloadHook = usePreloadComponents();

  // Extract stable functions with fallbacks
  const trackEvent = React.useCallback(
    (event, data) => {
      try {
        analytics?.trackEvent?.(event, data);
        // Also track with analytics cache as fallback
        analyticsCache?.trackEvent?.(event, data);
      } catch (error) {
        console.warn("Analytics tracking error:", error);
      }
    },
    [analytics],
  );

  const trackPageView = React.useCallback(
    (page, data) => {
      try {
        analytics?.trackPageView?.(page, data);
      } catch (error) {
        console.warn("Page view tracking error:", error);
      }
    },
    [analytics],
  );

  const trackConversion = React.useCallback(
    (data) => {
      try {
        analytics?.trackConversion?.(data);
      } catch (error) {
        console.warn("Conversion tracking error:", error);
      }
    },
    [analytics],
  );

  // A/B Test for hero CTA - with error handling
  const heroCTATest = useABTest("hero-cta-variation") || {
    variant: "control",
    trackConversion: () => {},
  };
  const pricingTest = useABTest("pricing-display") || {
    variant: "control",
  };
  const exitIntentTest = useABTest("exit-intent-offer") || {
    variant: "control",
    trackConversion: () => {},
  };

  // Ultra-fast initialization - Critical Performance Fix
  useEffect(() => {
    try {
      // Set app as initialized immediately
      setAppInitialized(true);

      // Quick visitor count without analytics overhead
      const count = Math.floor(Math.random() * 1000) + 500; // Mock visitor count for performance
      setVisitorCount(count);

      // Skip expensive operations during initialization
      const initTimer = setTimeout(() => {
        try {
          // Load preferences in background
          const prefs = userPreferences.load();
          if (prefs?.comparisonServices) {
            setComparisonServices(prefs.comparisonServices);
          }

          // Track page view in background (non-blocking)
          trackPageView?.("services", { visit_count: count });
        } catch (bgError) {
          console.warn("Background init error:", bgError);
        }
      }, 100);

      return () => clearTimeout(initTimer);
    } catch (error) {
      console.warn("Init error:", error);
      setAppInitialized(true); // Always ensure app initializes
    }
  }, []);

  // Create stable exit intent callback with error handling
  const handleExitIntent = useCallback(() => {
    try {
      if (trackEvent) {
        trackEvent("exit_intent_shown", {
          page: currentPage,
          time_on_site: Date.now(),
        });
      }
      setShowExitIntent(true);
    } catch (error) {
      console.warn("Exit intent tracking error:", error);
      setShowExitIntent(true); // Still show popup even if tracking fails
    }
  }, [trackEvent, currentPage]);

  // Exit intent detection with A/B testing - only after app is initialized
  useExitIntent({
    enabled: appInitialized && visitorCount <= 3,
    onExitIntent: handleExitIntent,
  });

  const handleServiceSelect = async (serviceId) => {
    if (!serviceId) return;

    // Skip loading state for better performance
    try {
      // Track in background without blocking
      setTimeout(() => {
        trackEvent?.("service_select", {
          service_id: serviceId,
        });
      }, 0);

      // Immediate navigation
      setSelectedService(serviceId);
      setCurrentPage("service-detail");
    } catch (error) {
      console.warn("Service selection error:", error);
      setSelectedService(serviceId);
      setCurrentPage("service-detail");
    }
  };

  const handleBackToServices = () => {
    trackEvent("navigation", {
      action: "back_to_services",
      from_page: currentPage,
    });
    setCurrentPage("services");
    setSelectedService(null);
  };

  const handleBookingClick = () => {
    // Track conversion action with A/B test data
    trackEvent("booking_initiated", {
      source_page: currentPage,
      cta_variant: heroCTATest.variant,
      service_id: selectedService,
    });

    // Track A/B test conversion
    if (heroCTATest.variant) {
      heroCTATest.trackConversion();
    }

    setCurrentPage("contact");
  };

  const handleBackToHome = () => {
    setCurrentPage("services");
  };

  const handleComparisonToggle = (serviceId) => {
    setComparisonServices((prev) => {
      const isAlreadySelected = prev.includes(serviceId);
      let newServices;
      if (isAlreadySelected) {
        newServices = prev.filter((id) => id !== serviceId);
      } else if (prev.length < 3) {
        newServices = [...prev, serviceId];
      } else {
        newServices = prev;
      }

      // Save to user preferences
      userPreferences.update({
        comparisonServices: newServices,
      });
      return newServices;
    });
  };

  const handleViewComparison = () => {
    if (comparisonServices.length >= 2) {
      trackEvent("comparison_started", {
        services_count: comparisonServices.length,
        service_ids: comparisonServices,
      });
      setCurrentPage("comparison");
    }
  };

  const handleStartRecommender = () => {
    // Redirect to Service Assessment for consolidated experience
    trackEvent("service_discovery_started", {
      source_page: currentPage,
      method: "recommender_redirect",
    });
    setCurrentPage("service-assessment");
  };

  const handleRecommenderComplete = (recommendedServices) => {
    trackEvent("service_discovery_completed", {
      recommended_services: recommendedServices,
      recommendations_count: recommendedServices?.length || 0,
    });
    setCurrentPage("services");
  };

  const handleViewBundles = () => {
    trackEvent("bundle_viewed", {
      source_page: currentPage,
    });
    setCurrentPage("bundles");
  };

  const handleViewServiceAssessment = () => {
    trackEvent("service_discovery_started", {
      source_page: currentPage,
      method: "assessment",
    });
    setCurrentPage("service-assessment");
  };

  const handleViewFAQ = () => {
    trackEvent("faq_searched", {
      source_page: currentPage,
    });
    setCurrentPage("faq");
  };

  const handleViewSocialProof = () => {
    trackEvent("social_proof_viewed", {
      source_page: currentPage,
    });
    setCurrentPage("social-proof");
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case "services":
        return "All Services";
      case "service-detail":
        return selectedService
          ? String(selectedService)
              .replace("-", " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())
          : "Service Details";
      case "contact":
        return "Book Strategy Call";
      case "comparison":
        return "Service Comparison";
      case "recommender":
        return "Service Discovery";
      case "bundles":
        return "Service Bundles";
      case "service-assessment":
        return "Service Assessment";
      case "faq":
        return "FAQ & Support";
      case "social-proof":
        return "Success Stories";
      default:
        return "Services";
    }
  };

  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { label: "Home", onClick: handleBackToHome },
    ];

    switch (currentPage) {
      case "services":
        breadcrumbs.push({ label: "Services", current: true });
        break;
      case "service-detail":
        breadcrumbs.push(
          { label: "Services", onClick: handleBackToServices },
          { label: getPageTitle(), current: true },
        );
        break;
      case "contact":
        breadcrumbs.push({
          label: "Book Strategy Call",
          current: true,
        });
        break;
      case "comparison":
        breadcrumbs.push(
          { label: "Services", onClick: handleBackToServices },
          { label: "Compare Services", current: true },
        );
        break;
      case "recommender":
        breadcrumbs.push({
          label: "Service Discovery",
          current: true,
        });
        break;
      case "bundles":
        breadcrumbs.push({
          label: "Service Bundles",
          current: true,
        });
        break;
      case "service-assessment":
        breadcrumbs.push({
          label: "Service Assessment",
          current: true,
        });
        break;
      case "faq":
        breadcrumbs.push({
          label: "FAQ & Support",
          current: true,
        });
        break;
      case "social-proof":
        breadcrumbs.push({
          label: "Success Stories",
          current: true,
        });
        break;
    }

    return breadcrumbs;
  };

  return (
    <>
      {/* SEO Components */}
      {currentPage === "services" && <HomepageSEO />}
      {currentPage === "service-detail" && selectedService && (
        <ServiceSEO
          serviceId={selectedService as string}
          serviceName={`Service ${selectedService}`}
          serviceDescription="Professional business consulting service"
          serviceCategory="Business Consulting"
        />
      )}
      <PerformanceSEO />

      <div className="min-h-screen bg-white">
        {/* Exit Intent Popup with A/B Testing */}
        <AnimatePresence>
          {showExitIntent && (
            <ABTestSwitch
              testId="exit-intent-offer"
              variants={{
                "business-blueprint": (
                  <ExitIntentPopup
                    onClose={() => {
                      trackEvent("exit_intent_closed", {
                        variant: "business-blueprint",
                      });
                      setShowExitIntent(false);
                    }}
                    onBookCall={handleBookingClick}
                    onSubscribe={(email) => {
                      trackEvent("exit_intent_converted", {
                        variant: "business-blueprint",
                        lead_magnet: "blueprint",
                        email: email,
                      });
                      exitIntentTest.trackConversion();
                    }}
                  />
                ),
                "revenue-audit": (
                  <ExitIntentPopup
                    onClose={() => {
                      trackEvent("exit_intent_closed", {
                        variant: "revenue-audit",
                      });
                      setShowExitIntent(false);
                    }}
                    onBookCall={handleBookingClick}
                    onSubscribe={(email) => {
                      trackEvent("exit_intent_converted", {
                        variant: "revenue-audit",
                        lead_magnet: "audit",
                        email: email,
                      });
                      exitIntentTest.trackConversion();
                    }}
                  />
                ),
                consultation: (
                  <ExitIntentPopup
                    onClose={() => {
                      trackEvent("exit_intent_closed", {
                        variant: "consultation",
                      });
                      setShowExitIntent(false);
                    }}
                    onBookCall={handleBookingClick}
                    onSubscribe={(email) => {
                      trackEvent("exit_intent_converted", {
                        variant: "consultation",
                        lead_magnet: "session",
                        email: email,
                      });
                      exitIntentTest.trackConversion();
                    }}
                  />
                ),
              }}
              fallback={
                <ExitIntentPopup
                  onClose={() => setShowExitIntent(false)}
                  onBookCall={handleBookingClick}
                  onSubscribe={(email) => {
                    console.log(
                      "Lead magnet subscription:",
                      email,
                    );
                  }}
                />
              }
            />
          )}
        </AnimatePresence>

        {/* Navigation Header - Modern & Clean */}
        <nav className="ra-nav-modern sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              {/* Left Section - Logo & Back */}
              <div className="flex items-center space-x-4">
                {currentPage !== "services" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={
                      currentPage === "service-detail"
                        ? handleBackToServices
                        : handleBackToHome
                    }
                    className="ra-btn-ghost group"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                  </Button>
                )}
                <div className="flex items-center space-x-3">
                  <div className="ra-logo-modern">
                    <span className="font-black text-xl">
                      RA
                    </span>
                  </div>
                  <div className="hidden sm:flex flex-col">
                    <span className="font-black text-lg leading-none ra-text-primary">
                      Revenue Avenue
                    </span>
                    <span className="text-xs ra-text-muted">
                      Business Empire Builders
                    </span>
                  </div>
                </div>
              </div>

              {/* Center Section - Quick Actions (Desktop) */}
              {currentPage === "services" && (
                <div className="hidden lg:flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleViewServiceAssessment}
                    className="ra-nav-action group"
                  >
                    <Brain className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Find My Service
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleViewBundles}
                    className="ra-nav-action group"
                  >
                    <Package className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Bundles
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleViewSocialProof}
                    className="ra-nav-action group"
                  >
                    <Award className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Success Stories
                  </Button>

                  {comparisonServices.length >= 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleViewComparison}
                      className="ra-nav-action-highlight group"
                    >
                      <GitCompare className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      Compare ({comparisonServices.length})
                    </Button>
                  )}
                </div>
              )}

              {/* Right Section - Actions */}
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleViewFAQ}
                  className="ra-nav-action hidden sm:flex"
                >
                  <HelpCircle className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Help</span>
                </Button>

                <ABTestSwitch
                  testId="hero-cta-variation"
                  variants={{
                    control: (
                      <Button
                        onClick={handleBookingClick}
                        className="ra-btn-primary-modern"
                        data-analytics-cta="book-call-header-control"
                      >
                        <span className="hidden sm:inline">
                          Book Strategy Call
                        </span>
                        <span className="sm:hidden">
                          Book Call
                        </span>
                      </Button>
                    ),
                    urgency: (
                      <Button
                        onClick={handleBookingClick}
                        className="ra-btn-primary-modern ra-pulse"
                        data-analytics-cta="book-call-header-urgency"
                      >
                        <Zap className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">
                          Get Free Audit
                        </span>
                        <span className="sm:hidden">Audit</span>
                      </Button>
                    ),
                  }}
                  fallback={
                    <Button
                      onClick={handleBookingClick}
                      className="ra-btn-primary-modern"
                      data-analytics-cta="book-call-header-fallback"
                    >
                      <span className="hidden sm:inline">
                        Book Call
                      </span>
                      <span className="sm:hidden">Call</span>
                    </Button>
                  }
                />

                {/* Mobile Menu */}
                <MobileMenu
                  currentPage={currentPage}
                  comparisonCount={comparisonServices.length}
                  onStartRecommender={handleStartRecommender}
                  onViewBundles={handleViewBundles}
                  onViewServiceAssessment={
                    handleViewServiceAssessment
                  }
                  onViewComparison={handleViewComparison}
                  onViewFAQ={handleViewFAQ}
                  onViewSocialProof={handleViewSocialProof}
                  onBookCall={handleBookingClick}
                  visitorCount={visitorCount}
                />
              </div>
            </div>

            {/* Breadcrumb Navigation */}
            {currentPage !== "services" && (
              <div className="pb-3 border-t border-gray-100">
                <BreadcrumbNav breadcrumbs={getBreadcrumbs()} />
              </div>
            )}
          </div>
        </nav>

        {/* Simplified Hero Section - Performance Optimized */}
        {currentPage === "services" && (
          <section className="ra-hero-modern relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Column - Main Message */}
                <div className="space-y-8">
                  {/* Social Proof Badge */}
                  <div className="ra-social-badge inline-flex items-center space-x-2 px-4 py-2 rounded-full">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                        <Star className="w-3 h-3 text-white" />
                      </div>
                      <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                        <Trophy className="w-3 h-3 text-white" />
                      </div>
                      <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center">
                        <TrendingUp className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <span className="text-sm font-semibold ra-text-primary">
                      5,000+ businesses transformed • 98%
                      success rate
                    </span>
                  </div>

                  {/* Main Headline */}
                  <div className="space-y-6">
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight ra-text-primary">
                      Transform Your Business Into a{" "}
                      <span className="ra-gradient-text">
                        Revenue Empire
                      </span>
                    </h1>
                    <p className="text-xl sm:text-2xl leading-relaxed ra-text-secondary max-w-2xl">
                      From side hustle to multi-million dollar
                      empire with our proven systems,
                      <span className="font-bold ra-text-accent">
                        {" "}
                        98% success rate
                      </span>
                      , and comprehensive done-for-you services.
                    </p>
                  </div>

                  {/* CTAs */}
                  <div className="flex justify-center sm:justify-start">
                    <Button
                      onClick={handleBookingClick}
                      className="ra-btn-hero-main group"
                      data-analytics-cta="hero-main-cta"
                    >
                      <Zap className="w-5 h-5 mr-3" />
                      Get Your FREE Strategy Session
                      <ArrowRight className="w-5 h-5 ml-3" />
                    </Button>
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex flex-wrap gap-4">
                    <div className="ra-trust-modern">
                      <Shield className="w-4 h-4 mr-2" />
                      No Contracts
                    </div>
                    <div className="ra-trust-modern">
                      <Target className="w-4 h-4 mr-2" />
                      Results Guaranteed
                    </div>
                    <div className="ra-trust-modern">
                      <Clock className="w-4 h-4 mr-2" />
                      30-Day Support
                    </div>
                  </div>
                </div>

                {/* Right Column - Stats & Social Proof - Simplified */}
                <div className="space-y-6">
                  {/* Main Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="ra-stat-modern">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 ra-icon-modern mx-auto mb-3">
                          <Trophy className="w-6 h-6" />
                        </div>
                        <div className="text-3xl font-black ra-text-accent mb-1">
                          98%
                        </div>
                        <div className="text-sm ra-text-muted">
                          Success Rate
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="ra-stat-modern">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 ra-icon-modern mx-auto mb-3">
                          <Users className="w-6 h-6" />
                        </div>
                        <div className="text-3xl font-black ra-text-accent mb-1">
                          5K+
                        </div>
                        <div className="text-sm ra-text-muted">
                          Businesses
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="ra-stat-modern">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 ra-icon-modern mx-auto mb-3">
                          <TrendingUp className="w-6 h-6" />
                        </div>
                        <div className="text-3xl font-black ra-text-accent mb-1">
                          $100M+
                        </div>
                        <div className="text-sm ra-text-muted">
                          Generated
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="ra-stat-modern">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 ra-icon-modern mx-auto mb-3">
                          <Globe className="w-6 h-6" />
                        </div>
                        <div className="text-3xl font-black ra-text-accent mb-1">
                          50+
                        </div>
                        <div className="text-sm ra-text-muted">
                          Industries
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Featured Testimonial */}
                  <Card className="ra-testimonial-featured">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-current"
                            />
                          ))}
                        </div>
                        <span className="text-sm font-semibold ra-text-primary">
                          Verified Result
                        </span>
                      </div>
                      <blockquote className="text-lg font-semibold ra-text-primary mb-4">
                        "From $50K to $2.3M in 18 months using
                        their systems. The transformation was
                        incredible."
                      </blockquote>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            SJ
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold ra-text-primary">
                            Sarah Johnson
                          </div>
                          <div className="text-sm ra-text-muted">
                            Tech Startup Founder
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Urgency Banner */}
                  <div className="ra-urgency-banner">
                    <div className="flex items-center justify-center space-x-2">
                      <Sparkles className="w-5 h-5 text-yellow-500" />
                      <span className="font-bold">
                        Limited Time: Free $2,500 Business Audit
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Simplified Page Content - No Heavy Animations */}
        <div>
          {currentPage === "services" && (
            <ServicesListing
              onServiceSelect={handleServiceSelect}
              onBookingClick={handleBookingClick}
              comparisonServices={comparisonServices}
              onComparisonToggle={handleComparisonToggle}
              onViewComparison={handleViewComparison}
              onStartRecommender={handleStartRecommender}
              onViewBundles={handleViewBundles}
              onViewPricingCalculator={
                handleViewServiceAssessment
              }
            />
          )}

          {currentPage === "service-detail" &&
            selectedService && (
              <ServiceDetail
                serviceId={selectedService}
                onBackClick={handleBackToServices}
                onBookingClick={handleBookingClick}
                onServiceSelect={handleServiceSelect}
                onViewBundles={handleViewBundles}
                onViewPricingCalculator={
                  handleViewServiceAssessment
                }
                onViewSocialProof={handleViewSocialProof}
              />
            )}

          {currentPage === "contact" && (
            <ContactForm onBackClick={handleBackToHome} />
          )}

          {currentPage === "comparison" && (
            <ServiceComparison
              serviceIds={comparisonServices}
              onBackClick={handleBackToServices}
              onBookingClick={handleBookingClick}
              onServiceSelect={handleServiceSelect}
            />
          )}

          {currentPage === "recommender" && (
            <ServiceAssessment
              onBackClick={handleBackToHome}
              onServiceSelect={handleServiceSelect}
              onBookingClick={handleBookingClick}
              onViewBundles={handleViewBundles}
            />
          )}

          {currentPage === "bundles" && (
            <ServiceBundles
              onBackClick={handleBackToHome}
              onServiceSelect={handleServiceSelect}
              onBookingClick={handleBookingClick}
              onViewPricingCalculator={
                handleViewServiceAssessment
              }
            />
          )}

          {currentPage === "service-assessment" && (
            <ServiceAssessment
              onBackClick={handleBackToHome}
              onServiceSelect={handleServiceSelect}
              onBookingClick={handleBookingClick}
              onViewBundles={handleViewBundles}
            />
          )}

          {currentPage === "faq" && (
            <FAQSearch
              onBackClick={handleBackToHome}
              onServiceSelect={handleServiceSelect}
              onBookingClick={handleBookingClick}
            />
          )}

          {currentPage === "social-proof" && (
            <SocialProof
              onBackClick={handleBackToHome}
              onServiceSelect={handleServiceSelect}
              onBookingClick={handleBookingClick}
            />
          )}
        </div>

        {/* Footer - Modern & Clean */}
        <footer className="ra-footer-modern">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="ra-logo-modern">
                    <span className="font-black text-xl">
                      RA
                    </span>
                  </div>
                  <div>
                    <div className="font-black text-xl ra-text-primary">
                      Revenue Avenue
                    </div>
                    <div className="text-sm ra-text-muted">
                      Transforming businesses into empires
                    </div>
                  </div>
                </div>
                <p className="ra-text-secondary max-w-md">
                  From side hustles to multi-million dollar
                  empires. We provide the systems, strategies,
                  and support you need to build lasting wealth.
                </p>

                {/* Social Proof in Footer */}
                <div className="flex items-center space-x-6 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-black ra-text-accent">
                      5K+
                    </div>
                    <div className="text-xs ra-text-muted">
                      Clients
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black ra-text-accent">
                      98%
                    </div>
                    <div className="text-xs ra-text-muted">
                      Success
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black ra-text-accent">
                      $100M+
                    </div>
                    <div className="text-xs ra-text-muted">
                      Generated
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold ra-text-primary mb-4">
                  Support
                </h4>
                <ul className="space-y-2">
                  <li>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBookingClick}
                      className="ra-link-action p-0 h-auto font-normal justify-start"
                    >
                      Schedule Strategy Call
                    </Button>
                  </li>
                  <li>
                    <a href="#" className="ra-link-subtle">
                      Contact Support
                    </a>
                  </li>
                  <li>
                    <a href="#" className="ra-link-subtle">
                      FAQ & Help
                    </a>
                  </li>
                  <li>
                    <a href="#" className="ra-link-subtle">
                      Success Stories
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-12 pt-8 text-center">
              <p className="ra-text-muted">
                © 2024 Revenue Avenue. All rights reserved.
                <span className="ra-text-accent font-semibold">
                  {" "}
                  Empowering entrepreneurs worldwide.
                </span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

// Main App component with providers
export default function App() {
  return (
    <ErrorBoundary>
      <AnalyticsProvider>
        <ABTestProvider>
          <AppContent />
        </ABTestProvider>
      </AnalyticsProvider>
    </ErrorBoundary>
  );
}