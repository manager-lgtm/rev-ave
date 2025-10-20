import React, { useState, useMemo } from 'react';
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Calendar, Calculator, Download, Share, CheckCircle, TrendingUp, DollarSign, ArrowRight, Target, Zap, Award } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const services = [
  { 
    id: 'side-hustle-accelerator', 
    title: 'Side Hustle Accelerator', 
    valueDrivers: ['Market Validation', 'Legal Structure', 'Revenue Model'],
    impactLevel: 'Foundation',
    duration: 90, 
    category: 'startup',
    businessSize: 'Individual',
    complexityScore: 2
  },
  { 
    id: 'income-igniter', 
    title: 'Starter+ Income Igniter', 
    valueDrivers: ['Fast Launch', 'Monetization Strategy', 'Content System'],
    impactLevel: 'Accelerator',
    duration: 60, 
    category: 'startup',
    businessSize: 'Individual',
    complexityScore: 2
  },
  { 
    id: 'core-foundation', 
    title: 'Core Business Foundation', 
    valueDrivers: ['Complete Setup', 'Professional Systems', 'Brand Identity'],
    impactLevel: 'Foundation',
    duration: 105, 
    category: 'foundation',
    businessSize: 'Small Business',
    complexityScore: 4
  },
  { 
    id: 'rapid-revenue-starter', 
    title: 'Rapid Revenue Starter', 
    valueDrivers: ['Revenue Systems', 'Automation', 'Scaling Framework'],
    impactLevel: 'Growth',
    duration: 90, 
    category: 'revenue',
    businessSize: 'Small Business',
    complexityScore: 3
  },
  { 
    id: 'profit-stream-pro', 
    title: 'Profit Stream Pro', 
    valueDrivers: ['Multiple Income Streams', 'High-Ticket Systems', 'Automation'],
    impactLevel: 'Empire',
    duration: 135, 
    category: 'income',
    businessSize: 'Medium Business',
    complexityScore: 5
  },
  { 
    id: 'legacy-epic-empire', 
    title: 'Legacy EPIC Empire', 
    valueDrivers: ['Massive Impact', 'Legacy Systems', 'Thought Leadership'],
    impactLevel: 'Legacy',
    duration: 330, 
    category: 'empire',
    businessSize: 'Enterprise',
    complexityScore: 6
  }
];

const bundleDiscounts = {
  2: 0.05,  // 5% discount for 2 services
  3: 0.10,  // 10% discount for 3 services
  4: 0.15,  // 15% discount for 4 services
  5: 0.20   // 20% discount for 5+ services
};

const complementaryServices = {
  'side-hustle-accelerator': ['income-igniter', 'core-foundation'],
  'income-igniter': ['core-foundation', 'rapid-revenue-starter'],
  'core-foundation': ['rapid-revenue-starter', 'scale-income-amplifier'],
  'rapid-revenue-starter': ['scale-income-amplifier', 'scale-ai-boost'],
  'scale-income-amplifier': ['social-media-domination', 'sales-customer-mastery'],
  'scale-ai-boost': ['social-media-domination', 'smarthire-suite'],
  'smarthire-suite': ['growth-success-bundle', 'scale-ai-boost'],
  'growth-success-bundle': ['impact-visibility-amplifier', 'profit-stream-pro'],
  'business-financial-power': ['impact-visibility-amplifier', 'legacy-epic-empire'],
  'profit-stream-pro': ['legacy-epic-empire', 'business-financial-power']
};

export function PricingCalculator({ onBackClick, onServiceSelect, onBookingClick, onViewBundles }) {
  const [selectedServices, setSelectedServices] = useState([]);
  const [pricingTier, setPricingTier] = useState('mid'); // low, mid, high
  const [businessStage, setBusinessStage] = useState('startup');
  const [timeline, setTimeline] = useState(90);
  const [showROI, setShowROI] = useState(false);

  const handleServiceToggle = (serviceId) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      if (businessStage === 'all') return true;
      return service.category === businessStage;
    });
  }, [businessStage]);

  const calculations = useMemo(() => {
    if (selectedServices.length === 0) {
      return {
        subtotal: 0,
        bundleDiscount: 0,
        total: 0,
        totalDuration: 0,
        avgMonthlyInvestment: 0,
        savings: 0,
        selectedServiceObjects: []
      };
    }

    const selectedServiceObjects = services.filter(s => selectedServices.includes(s.id));
    
    let subtotal = 0;
    let totalDuration = 0;
    
    selectedServiceObjects.forEach(service => {
      let price = service.priceMin;
      if (pricingTier === 'mid') {
        price = (service.priceMin + service.priceMax) / 2;
      } else if (pricingTier === 'high') {
        price = service.priceMax;
      }
      subtotal += price;
      totalDuration = Math.max(totalDuration, service.duration);
    });

    const discountRate = bundleDiscounts[Math.min(selectedServices.length, 5)] || 0;
    const bundleDiscount = subtotal * discountRate;
    const total = subtotal - bundleDiscount;
    const avgMonthlyInvestment = total / (totalDuration / 30);

    return {
      subtotal,
      bundleDiscount,
      total,
      totalDuration,
      avgMonthlyInvestment,
      savings: bundleDiscount,
      selectedServiceObjects,
      discountRate: discountRate * 100
    };
  }, [selectedServices, pricingTier]);

  const roiCalculations = useMemo(() => {
    if (!showROI) return null;

    // Conservative ROI estimates based on service type
    const roiMultipliers = {
      'startup': 3,
      'revenue': 5,
      'automation': 4,
      'marketing': 6,
      'sales': 7,
      'funding': 10,
      'empire': 20
    };

    const avgMultiplier = calculations.selectedServiceObjects.reduce((acc, service) => {
      return acc + (roiMultipliers[service.category] || 3);
    }, 0) / (calculations.selectedServiceObjects.length || 1);

    const projectedRevenue = calculations.total * avgMultiplier;
    const netROI = projectedRevenue - calculations.total;
    const roiPercentage = ((projectedRevenue - calculations.total) / calculations.total) * 100;

    return {
      projectedRevenue,
      netROI,
      roiPercentage,
      paybackMonths: Math.ceil((calculations.total / (netROI / 12)))
    };
  }, [calculations, showROI]);

  const recommendedServices = useMemo(() => {
    if (selectedServices.length === 0) return [];
    
    const allRecommended = selectedServices.reduce((acc, serviceId) => {
      const recommended = complementaryServices[serviceId] || [];
      return [...acc, ...recommended];
    }, []);

    // Remove duplicates and already selected services
    const unique = [...new Set(allRecommended)];
    return unique.filter(id => !selectedServices.includes(id)).slice(0, 3);
  }, [selectedServices]);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Premium Wealth Theme */}
      <section className="ra-cta-wealth py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute top-0 left-0 w-full h-full" 
            style={{
              backgroundImage: 'radial-gradient(circle at 25% 25%, #fdcb6e 1px, transparent 1px), radial-gradient(circle at 75% 75%, #e17055 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}
          ></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-[var(--ra-cta-wealth-secondary)] to-[var(--ra-cta-wealth-highlight)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Calculator className="w-10 h-10 text-[var(--ra-cta-wealth-primary)]" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: 'var(--ra-cta-wealth-secondary)' }}>
              Interactive Pricing Calculator
            </h1>
            <p className="text-xl max-w-4xl mx-auto mb-8" style={{ color: 'var(--ra-cta-wealth-accent)', opacity: 0.9 }}>
              Configure your perfect service combination and see real-time pricing with bundle discounts and ROI projections.
            </p>
            
            <Button 
              onClick={onBookingClick}
              className="ra-btn-cta px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Strategy Call
            </Button>
          </div>
        </div>
      </section>

      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Configuration Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Business Stage Filter */}
              <Card>
                <CardHeader>
                  <CardTitle>Configure Your Needs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block font-medium text-gray-900 mb-3">Business Stage</label>
                    <Select value={businessStage} onValueChange={setBusinessStage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your business stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Services</SelectItem>
                        <SelectItem value="startup">Startup & Launch</SelectItem>
                        <SelectItem value="foundation">Foundation & Structure</SelectItem>
                        <SelectItem value="revenue">Revenue & Growth</SelectItem>
                        <SelectItem value="automation">Automation & AI</SelectItem>
                        <SelectItem value="marketing">Marketing & Visibility</SelectItem>
                        <SelectItem value="team">Team & Management</SelectItem>
                        <SelectItem value="funding">Funding & Credit</SelectItem>
                        <SelectItem value="empire">Empire & Legacy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block font-medium text-gray-900 mb-3">Pricing Tier</label>
                    <Select value={pricingTier} onValueChange={setPricingTier}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Basic Package (Lower Pricing)</SelectItem>
                        <SelectItem value="mid">Standard Package (Mid-Range)</SelectItem>
                        <SelectItem value="high">Premium Package (Full Features)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block font-medium text-gray-900 mb-3">
                      Desired Timeline: {timeline} days
                    </label>
                    <Slider
                      value={[timeline]}
                      onValueChange={(value) => setTimeline(value[0])}
                      max={365}
                      min={30}
                      step={30}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>30 days</span>
                      <span>6 months</span>
                      <span>12 months</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Service Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Services</CardTitle>
                  <p className="text-gray-600">Choose the services that match your business needs</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredServices.map((service) => {
                      const isSelected = selectedServices.includes(service.id);
                      let price = service.priceMin;
                      if (pricingTier === 'mid') price = (service.priceMin + service.priceMax) / 2;
                      else if (pricingTier === 'high') price = service.priceMax;

                      return (
                        <div 
                          key={service.id}
                          className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all ${
                            isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleServiceToggle(service.id)}
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-gray-900">{service.title}</h3>
                                <p className="text-sm text-gray-600">{service.duration} days</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">
                                  ${Math.round(price).toLocaleString()}
                                </p>
                                <Badge variant="outline" className="text-xs">
                                  {service.category}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Services */}
              {recommendedServices.length > 0 && (
                <Card className="bg-amber-50 border-amber-200">
                  <CardHeader>
                    <CardTitle className="text-amber-800">Recommended Add-Ons</CardTitle>
                    <p className="text-amber-700">These services work great with your current selection</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recommendedServices.map(serviceId => {
                        const service = services.find(s => s.id === serviceId);
                        if (!service) return null;
                        
                        return (
                          <div key={serviceId} className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div>
                              <h4 className="font-medium text-gray-900">{service.title}</h4>
                              <p className="text-sm text-gray-600">Perfect complement to your selection</p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleServiceToggle(serviceId)}
                            >
                              Add Service
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Pricing Summary */}
            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Pricing Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedServices.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>Select services to see pricing</p>
                    </div>
                  ) : (
                    <>
                      {/* Selected Services */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Selected Services:</h4>
                        {calculations.selectedServiceObjects.map(service => (
                          <div key={service.id} className="flex justify-between text-sm">
                            <span className="text-gray-700">{service.title}</span>
                            <span className="font-medium">
                              ${Math.round(
                                pricingTier === 'low' ? service.priceMin :
                                pricingTier === 'mid' ? (service.priceMin + service.priceMax) / 2 :
                                service.priceMax
                              ).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      <hr />

                      {/* Pricing Breakdown */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>${calculations.subtotal.toLocaleString()}</span>
                        </div>
                        {calculations.bundleDiscount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Bundle Discount ({calculations.discountRate}%):</span>
                            <span>-${Math.round(calculations.bundleDiscount).toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                          <span>Total Investment:</span>
                          <span>${Math.round(calculations.total).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Additional Details */}
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total Duration:</span>
                          <span>{calculations.totalDuration} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg. Monthly Investment:</span>
                          <span>${Math.round(calculations.avgMonthlyInvestment).toLocaleString()}</span>
                        </div>
                        {calculations.savings > 0 && (
                          <div className="flex justify-between text-green-600 font-medium">
                            <span>Total Savings:</span>
                            <span>${Math.round(calculations.savings).toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      {/* ROI Toggle */}
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={showROI}
                          onCheckedChange={setShowROI}
                        />
                        <label className="text-sm font-medium">Show ROI Projections</label>
                      </div>

                      {/* ROI Projections */}
                      <AnimatePresence>
                        {showROI && roiCalculations && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-green-50 p-4 rounded-lg border border-green-200"
                          >
                            <h4 className="font-medium text-green-800 mb-3 flex items-center">
                              <TrendingUp className="w-4 h-4 mr-2" />
                              ROI Projections
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Projected Revenue:</span>
                                <span className="font-semibold text-green-600">
                                  ${Math.round(roiCalculations.projectedRevenue).toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Net ROI:</span>
                                <span className="font-semibold text-green-600">
                                  ${Math.round(roiCalculations.netROI).toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>ROI Percentage:</span>
                                <span className="font-semibold text-green-600">
                                  {Math.round(roiCalculations.roiPercentage)}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Payback Period:</span>
                                <span className="font-semibold">
                                  {roiCalculations.paybackMonths} months
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-green-700 mt-3">
                              *Projections based on historical client results and industry averages
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <Button 
                          onClick={onBookingClick}
                          className="w-full bg-gradient-to-r from-[var(--ra-cta-wealth-secondary)] to-[var(--ra-cta-wealth-highlight)] hover:from-[var(--ra-cta-wealth-highlight)] hover:to-[var(--ra-cta-wealth-secondary)] text-[var(--ra-cta-wealth-primary)]"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Schedule Consultation
                        </Button>
                        <Button 
                          onClick={onViewBundles}
                          variant="outline"
                          className="w-full"
                        >
                          View Pre-Built Bundles
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA with Premium Wealth Theme */}
      <section className="ra-cta-wealth py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute top-0 left-0 w-full h-full" 
            style={{
              backgroundImage: 'radial-gradient(circle at 25% 25%, #fdcb6e 1px, transparent 1px), radial-gradient(circle at 75% 75%, #e17055 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}
          ></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--ra-cta-wealth-secondary)' }}>Ready to Get Started?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto" style={{ color: 'var(--ra-cta-wealth-accent)', opacity: 0.9 }}>
              Schedule your free strategy call to discuss your custom solution and pricing. Our experts will help you choose the perfect combination for your business goals.
            </p>
            
            <Button 
              onClick={onBookingClick}
              className="ra-btn-cta px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Your Free Strategy Call
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}