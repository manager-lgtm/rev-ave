import React, { useState, useMemo } from 'react';
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent } from "./ui/card";
import { ArrowRight, Calendar, Eye, Search, SlidersHorizontal, GitCompare, Brain, X, Gift, Star, Trophy, Zap, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { serviceDetails } from "../data/serviceDetails";
import { colorClasses } from "../data/colorClasses";

// Helper function to clean category text from emoji characters
const cleanCategoryText = (category) => {
  // Remove common emoji prefixes
  return category
    .replace('💸 ', '')
    .replace('🚀 ', '')
    .replace('📱 ', '')
    .replace('💼 ', '')
    .replace('🏠 ', '')
    .trim();
};

// Helper function to get category emoji
const getCategoryEmoji = (category) => {
  if (category.includes('💸')) return '💸';
  if (category.includes('🚀')) return '🚀';
  if (category.includes('📱')) return '📱';
  if (category.includes('💼')) return '💼';
  if (category.includes('🏠')) return '🏠';
  return '⭐';
};

// Convert serviceDetails object to array format
const services = Object.entries(serviceDetails).map(([id, service]) => ({
  id,
  ...service, // ✅ This spreads ALL properties including strategicCTA & ctaStyle
  description: service.heroDescription, // Keep this override for description
  outcomes: service.expectedOutcomes || service.coreDeliverables?.slice(0, 3) || [],
  tags: [
    service.category.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(' ').filter(Boolean).join('-'),
    service.color,
    service.duration.includes('month') ? 'long-term' : 'short-term',
    service.priceMin < 2000 ? 'budget' : service.priceMin > 10000 ? 'premium' : 'mid-range'
  ]
}));

export function ServicesListing({ 
  onServiceSelect, 
  onBookingClick, 
  comparisonServices = [], 
  onComparisonToggle, 
  onViewComparison, 
  onStartRecommender,
  onViewBundles,
  onViewPricingCalculator 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedServices = useMemo(() => {
    let filtered = services.filter(service => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          service.title.toLowerCase().includes(searchLower) ||
          service.subtitle.toLowerCase().includes(searchLower) ||
          service.description.toLowerCase().includes(searchLower) ||
          service.category.toLowerCase().includes(searchLower) ||
          service.tags.some(tag => tag.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Price filter
      if (priceRange !== 'all') {
        const [minRange, maxRange] = priceRange.split('-').map(Number);
        if (maxRange) {
          if (service.priceMax < minRange || service.priceMin > maxRange) return false;
        } else {
          if (service.priceMin < minRange) return false;
        }
      }

      // Duration filter
      if (durationFilter !== 'all') {
        const maxDays = parseInt(durationFilter);
        if (service.durationDays > maxDays) return false;
      }

      // Category filter
      if (categoryFilter !== 'all') {
        if (!service.category.toLowerCase().includes(categoryFilter.toLowerCase())) return false;
      }

      return true;
    });

    // Sort results
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.priceMin - b.priceMin);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.priceMin - a.priceMin);
        break;
      case 'duration-short':
        filtered.sort((a, b) => a.durationDays - b.durationDays);
        break;
      case 'duration-long':
        filtered.sort((a, b) => b.durationDays - a.durationDays);
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Keep original order for 'recommended'
        break;
    }

    return filtered;
  }, [searchTerm, priceRange, durationFilter, categoryFilter, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setPriceRange('all');
    setDurationFilter('all');
    setCategoryFilter('all');
    setSortBy('recommended');
  };

  const hasActiveFilters = searchTerm || priceRange !== 'all' || durationFilter !== 'all' || categoryFilter !== 'all' || sortBy !== 'recommended';

  return (
    <>
      {/* Services Grid Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filter Section */}
          <Card className="mb-12 shadow-lg border-2 border-ra-gold-light bg-white">
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search services, features, or business stage..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 text-lg py-4 border-2 border-ra-gold-light focus:border-ra-gold rounded-xl"
                  />
                </div>

                {/* Filter Toggle and Comparison Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center space-x-2 border-ra-gold-light hover:border-ra-gold"
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                      <span>Filters</span>
                      {hasActiveFilters && (
                        <Badge className="ml-2 bg-ra-lime text-ra-olive">
                          Active
                        </Badge>
                      )}
                    </Button>
                    
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        onClick={clearFilters}
                        className="text-sm text-gray-500 hover:text-ra-olive"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Clear all
                      </Button>
                    )}
                  </div>

                  {/* Comparison Bar */}
                  {comparisonServices.length > 0 && (
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-ra-lime-soft rounded-xl border-2 border-ra-gold-light">
                      <GitCompare className="w-5 h-5 text-ra-olive" />
                      <span className="text-sm font-semibold ra-text-primary">
                        {comparisonServices.length} service{comparisonServices.length > 1 ? 's' : ''} selected
                      </span>
                      {comparisonServices.length >= 2 && (
                        <Button
                          onClick={onViewComparison}
                          size="sm"
                          className="ra-btn-primary-modern"
                        >
                          Compare Now
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Advanced Filters */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 border-t border-ra-gold-light">
                        <div>
                          <label className="block text-sm font-semibold mb-2 ra-text-primary">Price Range</label>
                          <Select value={priceRange} onValueChange={setPriceRange}>
                            <SelectTrigger className="border-ra-gold-light focus:border-ra-gold">
                              <SelectValue placeholder="All prices" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All prices</SelectItem>
                              <SelectItem value="0-2000">Under $2,000</SelectItem>
                              <SelectItem value="2000-5000">$2,000 - $5,000</SelectItem>
                              <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                              <SelectItem value="10000-25000">$10,000 - $25,000</SelectItem>
                              <SelectItem value="25000">$25,000+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2 ra-text-primary">Duration</label>
                          <Select value={durationFilter} onValueChange={setDurationFilter}>
                            <SelectTrigger className="border-ra-gold-light focus:border-ra-gold">
                              <SelectValue placeholder="All durations" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All durations</SelectItem>
                              <SelectItem value="90">3 months or less</SelectItem>
                              <SelectItem value="180">6 months or less</SelectItem>
                              <SelectItem value="365">12 months or less</SelectItem>
                              <SelectItem value="730">24 months or less</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2 ra-text-primary">Category</label>
                          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="border-ra-gold-light focus:border-ra-gold">
                              <SelectValue placeholder="All categories" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All categories</SelectItem>
                              <SelectItem value="bootstrap">Bootstrapped Entrepreneurs</SelectItem>
                              <SelectItem value="scaling">Scaling Businesses</SelectItem>
                              <SelectItem value="empire">Empire Builders</SelectItem>
                              <SelectItem value="legacy">Legacy Entrepreneurs</SelectItem>
                              <SelectItem value="tech">Tech Entrepreneurs</SelectItem>
                              <SelectItem value="real-estate">Real Estate</SelectItem>
                              <SelectItem value="franchise">Franchise</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2 ra-text-primary">Sort By</label>
                          <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="border-ra-gold-light focus:border-ra-gold">
                              <SelectValue placeholder="Recommended" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="recommended">Recommended</SelectItem>
                              <SelectItem value="price-low">Price: Low to High</SelectItem>
                              <SelectItem value="price-high">Price: High to Low</SelectItem>
                              <SelectItem value="duration-short">Duration: Shortest First</SelectItem>
                              <SelectItem value="duration-long">Duration: Longest First</SelectItem>
                              <SelectItem value="name">Name: A to Z</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-black ra-text-primary">
                {searchTerm ? 'Search Results' : 'All Services'}
              </h2>
              <p className="ra-text-secondary mt-1">
                {filteredAndSortedServices.length} service{filteredAndSortedServices.length !== 1 ? 's' : ''} found
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onViewPricingCalculator}
                className="ra-btn-secondary-modern"
              >
                <Brain className="w-4 h-4 mr-2" />
                Find My Service
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onViewBundles}
                className="ra-btn-secondary-modern"
              >
                <Gift className="w-4 h-4 mr-2" />
                View Bundles
              </Button>
            </div>
          </div>

          {/* Services Grid */}
          <div className="ra-services-grid">
            <AnimatePresence>
              {filteredAndSortedServices.map((service, index) => {
                const colors = colorClasses[service.color] || colorClasses.emerald;
                const isCompared = comparisonServices.includes(service.id);
                
                // Strategic Badge Distribution System - Alternating Pattern
                const getBadgeInfo = (idx) => {
                  // Only show badges on certain cards for strategic placement
                  const badgePosition = idx % 6; // Cycle every 6 cards for even distribution
                  
                  switch (badgePosition) {
                    case 0: // First card of each row typically
                      return { type: 'popular', label: 'Popular', icon: Star, color: 'bg-yellow-500' };
                    case 2: // Third card - offset for visual balance
                      return { type: 'value', label: 'Most Value', icon: Trophy, color: 'bg-green-500' };
                    case 4: // Fifth card - create visual rhythm
                      return { type: 'hot', label: 'Hot', icon: Zap, color: 'bg-red-500' };
                    default:
                      return null;
                  }
                };
                
                const badgeInfo = getBadgeInfo(index);
                
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="ra-service-card"
                  >
                    <Card className="h-full border-2 border-gray-200 hover:border-ra-gold-light transition-all duration-300 shadow-md hover:shadow-xl">
                      {/* Service Header */}
                      <div className={`ra-service-header ra-service-header-${service.color} relative`}>
                        {badgeInfo && (
                          <div className={`ra-strategy-badge ${badgeInfo.color}`}>
                            <badgeInfo.icon className="w-3 h-3" />
                            {badgeInfo.label}
                          </div>
                        )}
                        
                        <div className="flex items-start justify-between mb-4">
                          <div className="text-4xl">{service.icon}</div>
                          <Badge className="ra-category-badge bg-white/20 text-white border-white/30">
                            {cleanCategoryText(service.category)}
                          </Badge>
                        </div>
                        
                        <h3 className="text-xl font-bold mb-2 text-white">{service.title}</h3>
                        <p className="text-white/90 text-sm leading-relaxed mb-4">{service.subtitle}</p>
                        
                        {/* Strategic Pricing Integration */}
                        <div className="space-y-3">
                          {/* Benefit Statement */}
                          <p className="text-white/95 text-sm font-medium leading-relaxed">
                            {service.benefitStatement || 'Customized solution for your business goals.'}
                          </p>
                          
                          {/* Strategic CTA & Duration */}
                          <div className="flex justify-between items-center">
                            <button className={`ra-strategic-cta ra-strategic-cta-${service.ctaStyle || 'empathetic'}`}>
                              {service.strategicCTA || 'Get My Custom Quote'}
                            </button>
                            <div className="text-white/80 text-sm font-medium">{service.duration}</div>
                          </div>
                          
                          {/* Investment Tier Badge */}
                          {service.investmentTier && (
                            <div className="inline-flex items-center px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-semibold text-white/90 border border-white/20">
                              {service.investmentTier}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Service Content */}
                      <div className="ra-service-content">
                        {/* Compare Section - Always Visible */}
                        <div className="ra-compare-section">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold ra-text-primary">
                              {isCompared ? 'Added to comparison' : 'Compare with other services'}
                            </span>
                            <Button
                              variant={isCompared ? "default" : "outline"}
                              size="sm"
                              onClick={() => onComparisonToggle(service.id)}
                              disabled={!isCompared && comparisonServices.length >= 3}
                              className={`ra-compare-btn ${
                                isCompared 
                                  ? 'bg-ra-lime text-ra-olive hover:bg-ra-lime-dark' 
                                  : 'border-ra-gold-light hover:border-ra-gold'
                              }`}
                            >
                              <GitCompare className="w-3 h-3 mr-1" />
                              {isCompared ? 'Added' : 'Compare'}
                            </Button>
                          </div>
                        </div>

                        <p className="ra-text-secondary text-sm leading-relaxed mb-4">
                          {service.description}
                        </p>

                        {/* Strategic Pricing Information */}
                        {(service.valueProposition || service.roiAnchor || service.valueStatement || service.impactMetrics?.typicalROI) && (
                          <div className="ra-strategic-pricing-box mb-4">
                            {(service.valueProposition || service.valueStatement) && (
                              <p className="text-xs text-gray-600 mb-2 font-medium">
                                💡 {service.valueProposition || service.valueStatement}
                              </p>
                            )}
                            {(service.roiAnchor || service.impactMetrics?.typicalROI) && (
                              <p className="text-xs text-green-700 font-semibold">
                                📈 {service.roiAnchor || `ROI: ${service.impactMetrics.typicalROI}`}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Key Outcomes */}
                        <div className="ra-outcomes-list">
                          <h4 className="ra-outcomes-title">Key Outcomes:</h4>
                          <div className="space-y-1">
                            {service.outcomes.slice(0, 3).map((outcome, i) => (
                              <div key={i} className="ra-outcome-item">
                                <CheckCircle2 className="ra-outcome-icon" />
                                <span>{outcome}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Testimonial */}
                        {service.testimonial && (
                          <div className="ra-testimonial-box">
                            <p className="ra-testimonial-text">"{service.testimonial.text}"</p>
                            <p className="ra-testimonial-author">— {service.testimonial.author}</p>
                          </div>
                        )}

                        {/* Social Proof & Urgency Bar */}
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-3 mb-4">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="font-semibold text-green-700">
                                {Math.floor(Math.random() * 15) + 8} people viewing this service
                              </span>
                            </div>
                            <div className="text-gray-600 font-medium">
                              ⚡ Free consultation available
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="ra-service-actions">
                          <div className="space-y-3">
                            {/* Primary Actions Row */}
                            <div className="grid grid-cols-2 gap-3">
                              <Button
                                variant="outline"
                                onClick={() => onServiceSelect(service.id)}
                                className="ra-service-btn-view"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                              <Button
                                onClick={onBookingClick}
                                className="ra-service-btn-book"
                              >
                                <Calendar className="w-4 h-4 mr-2" />
                                Book Call
                              </Button>
                            </div>
                            

                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* No Results State */}
          {filteredAndSortedServices.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 ra-icon-modern mx-auto mb-6">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold ra-text-primary mb-4">No services found</h3>
              <p className="ra-text-secondary mb-8 max-w-md mx-auto">
                We couldn't find any services matching your criteria. Try adjusting your filters or search terms.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={clearFilters}
                  className="ra-btn-primary-modern"
                >
                  Clear All Filters
                </Button>
                <Button
                  variant="outline"
                  onClick={onViewPricingCalculator}
                  className="ra-btn-secondary-modern"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Get Recommendations
                </Button>
              </div>
            </motion.div>
          )}

          {/* Bottom CTA Section */}
          <div className="mt-20">
            <Card className="ra-cta-section text-center">
              <CardContent className="pt-8 pb-8">
                <div className="max-w-3xl mx-auto space-y-6">
                  <h2 className="text-4xl font-black ra-text-primary">Ready to Transform Your Business?</h2>
                  <p className="text-xl ra-text-secondary">
                    Still not sure which service is right for you? Let's have a conversation about your goals.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      onClick={onBookingClick}
                      className="ra-btn-hero-main group"
                    >
                      <Calendar className="w-5 h-5 mr-3" />
                      Schedule Free Strategy Call
                      <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    
                    <Button 
                      onClick={onStartRecommender}
                      variant="outline"
                      className="ra-btn-secondary-modern"
                    >
                      <Brain className="w-5 h-5 mr-2" />
                      Find My Perfect Service
                    </Button>
                  </div>

                  <div className="ra-urgency-banner mt-8">
                    <div className="flex items-center justify-center space-x-2">
                      <Trophy className="w-5 h-5 text-ra-olive-dark" />
                      <span className="font-bold">Limited Time: Free $2,500 Business Audit with Every Strategy Call</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}