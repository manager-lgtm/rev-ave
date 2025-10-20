import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Calendar, ArrowRight, Package, Star, CheckCircle, TrendingUp, Calculator } from "lucide-react";
import { motion } from "motion/react";

const serviceBundles = [
  {
    id: 'startup-essentials',
    title: 'Startup Essentials Project',
    subtitle: 'Complete business launch with revenue generation',
    category: 'For New Entrepreneurs',
    services: ['income-igniter', 'core-foundation'],
    projectModel: 'comprehensive-launch',
    investmentApproach: 'project-based',
    projectScope: {
      legal: 'Complete business formation and compliance',
      brand: 'Professional identity and market presence', 
      revenue: 'Revenue-generating systems and launch',
      support: 'Implementation guidance and optimization'
    },
    projectValue: {
      timeToMarket: '45-60 days typical launch timeline',
      riskMitigation: 'Avoid $15,000+ in common startup mistakes',
      professionalWorth: '$25,000+ value in individual services',
      revenueImpact: 'Revenue-ready business from day one'
    },
    duration: '90-120 days',
    color: 'emerald',
    icon: '🚀',
    description: 'Comprehensive project delivering complete business launch with revenue generation capability.',
    benefits: [
      'Complete legal business setup in 7-14 days',
      'Professional brand and systems infrastructure worth $25,000+',
      'Revenue generation within 30-60 days',
      'Scalable foundation supporting 6-figure growth'
    ],
    timeline: [
      { phase: 'Foundation Setup', duration: '1-2 weeks', description: 'Legal entity, banking, compliance foundation' },
      { phase: 'Brand Development', duration: '4-8 weeks', description: 'Professional brand, systems, and infrastructure' },
      { phase: 'Revenue Launch', duration: '8-12 weeks', description: 'Market launch, revenue systems activation' }
    ],
    testimonial: {
      text: "The project approach was perfect. Professional business launch with revenue in 45 days. Worth every investment.",
      author: "Sarah Chen, Tech Startup Founder",
      result: "Launched and profitable in 45 days"
    }
  },
  {
    id: 'growth-accelerator',
    title: 'Revenue Scaling Project',
    subtitle: 'Systematic revenue growth with team building',
    category: 'For Growing Businesses',
    services: ['scale-income-amplifier', 'smarthire-suite'],
    projectModel: 'scaling-transformation',
    investmentApproach: 'project-based',
    projectScope: {
      revenue: 'Revenue optimization and funnel automation',
      systems: 'Scalable team hiring and management systems',
      performance: 'Team performance tracking and optimization',
      growth: 'Sustainable scaling framework implementation'
    },
    projectValue: {
      revenueMultiplier: '200-500% revenue increase typical',
      teamEfficiency: '$100,000+ saved in hiring mistakes',
      systemsWorth: '$50,000+ value in custom automation',
      timeToScale: '6 months vs 18+ months DIY approach'
    },
    duration: '120-180 days',
    color: 'blue',
    icon: '📈',
    description: 'Comprehensive scaling project combining revenue optimization with high-performing team building.',
    benefits: [
      '200-500% increase in customer lifetime value',
      'Automated hiring systems preventing $100K+ mistakes',
      '90%+ employee retention with performance systems',
      'Scalable infrastructure supporting multi-million growth'
    ],
    timeline: [
      { phase: 'Revenue Optimization', duration: '8 weeks', description: 'Advanced funnel systems and automation' },
      { phase: 'Hiring Infrastructure', duration: '4-8 weeks', description: 'Team recruitment and onboarding systems' },
      { phase: 'Scaling Implementation', duration: '8-12 weeks', description: 'Performance optimization and growth systems' }
    ],
    testimonial: {
      text: "This project transformed everything. 300% revenue growth with an incredible team. The investment paid for itself in month two.",
      author: "Marcus Rodriguez, Agency Owner",
      result: "300% revenue growth + 8 team members"
    }
  },
  {
    id: 'automation-mastery',
    title: 'Automation Mastery Bundle',
    subtitle: 'AI-powered business automation and social media domination',
    category: 'For Efficiency Seekers',
    services: ['scale-ai-boost', 'social-media-domination'],
    originalPrice: 7850,
    bundlePrice: 5997,
    savings: 1853,
    duration: '90-120 days',
    color: 'purple',
    icon: '🤖',
    description: 'Complete automation solution combining AI workflows with social media mastery.',
    benefits: [
      '50%+ reduction in manual tasks',
      'Professional presence on 5+ social platforms',
      'Automated lead generation from social media',
      'AI agents handling routine business operations'
    ],
    timeline: [
      { phase: 'AI Setup', duration: '4-6 weeks', description: 'AI agents and automation workflows' },
      { phase: 'Social Media Launch', duration: '4-6 weeks', description: 'Multi-platform setup and content creation' },
      { phase: 'Integration & Optimization', duration: '4-8 weeks', description: 'System integration and performance tuning' }
    ],
    testimonial: {
      text: "Our business runs itself now. AI handles 60% of customer work and social media generates 400% more leads.",
      author: "Lisa Park, Digital Marketing Agency",
      result: "60% automation + 400% lead increase"
    }
  },
  {
    id: 'funding-ready',
    title: 'Funding Ready Bundle',
    subtitle: 'Complete financial infrastructure for major funding',
    category: 'For Serious Growth',
    services: ['business-financial-power', 'impact-visibility-amplifier'],
    originalPrice: 14000,
    bundlePrice: 11997,
    savings: 2003,
    duration: '6-9 months',
    color: 'cyan',
    icon: '💰',
    description: 'Comprehensive package to secure major business funding and establish market credibility.',
    benefits: [
      '$500K+ business credit access capability',
      'Professional market credibility and visibility',
      'Grant opportunities worth $50K-$500K+',
      'Investor-ready financial documentation'
    ],
    timeline: [
      { phase: 'Credit Foundation', duration: '8-12 weeks', description: 'Business credit building and documentation' },
      { phase: 'Visibility & Credibility', duration: '12-16 weeks', description: 'Directory listings, SEO, accreditations' },
      { phase: 'Funding Applications', duration: '16-24 weeks', description: 'Grant applications and funding pursuit' }
    ],
    testimonial: {
      text: "Secured $750K in business credit plus $85K in grants. The credibility building was game-changing for partnerships.",
      author: "Robert Kim, Manufacturing Business",
      result: "$835K total funding secured"
    }
  },
  {
    id: 'empire-builder',
    title: 'Empire Builder Bundle',
    subtitle: 'Multiple income streams with legacy impact',
    category: 'For Visionary Leaders',
    services: ['profit-stream-pro', 'legacy-epic-empire'],
    originalPrice: 27000,
    bundlePrice: 22997,
    savings: 4003,
    duration: '12-18 months',
    color: 'gradient',
    icon: '👑',
    description: 'Ultimate wealth-building system combining multiple income streams with legacy empire creation.',
    benefits: [
      '7+ diversified income streams',
      '$500K-$5M+ annual revenue potential',
      'Automated high-ticket sales systems',
      'Measurable community impact and legacy'
    ],
    timeline: [
      { phase: 'MSI Foundation', duration: '12-16 weeks', description: 'Multiple income stream setup and systems' },
      { phase: 'Empire Architecture', duration: '16-24 weeks', description: 'High-ticket systems and automation' },
      { phase: 'Legacy Implementation', duration: '24-36 weeks', description: 'Community impact and thought leadership' }
    ],
    testimonial: {
      text: "From single consultant to multi-million empire with 7 income streams. The community impact gives everything meaning.",
      author: "Victoria Thompson, Business Empire",
      result: "Multi-million empire + 10K lives impacted"
    }
  }
];

const colorClasses = {
  emerald: { bg: 'from-emerald-500 to-emerald-600', text: 'text-emerald-600', button: 'bg-emerald-600 hover:bg-emerald-700', accent: 'bg-emerald-50 border-emerald-200' },
  blue: { bg: 'from-blue-500 to-blue-600', text: 'text-blue-600', button: 'bg-blue-600 hover:bg-blue-700', accent: 'bg-blue-50 border-blue-200' },
  purple: { bg: 'from-purple-500 to-purple-600', text: 'text-purple-600', button: 'bg-purple-600 hover:bg-purple-700', accent: 'bg-purple-50 border-purple-200' },
  cyan: { bg: 'from-cyan-500 to-cyan-600', text: 'text-cyan-600', button: 'bg-cyan-600 hover:bg-cyan-700', accent: 'bg-cyan-50 border-cyan-200' },
  gradient: { bg: 'from-purple-600 to-yellow-500', text: 'bg-gradient-to-r from-purple-600 to-yellow-500 bg-clip-text text-transparent', button: 'bg-gradient-to-r from-purple-600 to-yellow-500 hover:from-purple-700 hover:to-yellow-600', accent: 'bg-gradient-to-r from-purple-50 to-yellow-50 border-purple-200' }
};

export function ServiceBundles({ onBackClick, onServiceSelect, onBookingClick, onViewPricingCalculator }) {
  const [selectedBundle, setSelectedBundle] = useState(null);

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
              <Package className="w-10 h-10 text-[var(--ra-cta-wealth-primary)]" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: 'var(--ra-red-deeper)' }}>
              Service Bundles & Packages
            </h1>
            <p className="text-xl max-w-4xl mx-auto mb-8" style={{ color: 'var(--ra-orange-dark)', opacity: 0.9 }}>
              Save money and accelerate your growth with our carefully curated service combinations designed for maximum impact at every business stage.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                onClick={onViewPricingCalculator}
                variant="outline"
                className="px-8 py-4 rounded-2xl text-lg font-semibold border-2 border-[var(--ra-orange-dark)] text-[var(--ra-orange-dark)] hover:bg-[var(--ra-orange-dark)] hover:text-white transition-all duration-300"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Custom Pricing Calculator
              </Button>
              <Button 
                onClick={onBookingClick}
                className="ra-btn-cta px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Bundle Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Project-Based Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-700 mb-2">Value-Based Investment</h3>
              <p className="text-green-600">Investment scales with project scope and business impact</p>
            </Card>
            
            <Card className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-blue-700 mb-2">Proven Outcomes</h3>
              <p className="text-blue-600">Project success measured by real business results</p>
            </Card>
            
            <Card className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-purple-700 mb-2">5 Strategic Projects</h3>
              <p className="text-purple-600">Comprehensive solutions for every growth stage</p>
            </Card>
          </div>

          {/* Bundle Cards */}
          <div className="space-y-12">
            {serviceBundles.map((bundle, index) => {
              const colors = colorClasses[bundle.color];
              const isGradientBundle = bundle.color === 'gradient';
              
              return (
                <motion.div
                  key={bundle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`relative overflow-hidden hover:shadow-xl transition-all duration-300 ${
                    isGradientBundle ? 'border-2 border-purple-300' : ''
                  }`}>
                    {/* Project Value Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-purple-500 text-white font-bold">
                        {bundle.investmentApproach === 'project-based' ? 'Custom Project' : 'Bundle Package'}
                      </Badge>
                    </div>

                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 ${
                      isGradientBundle 
                        ? 'bg-gradient-to-br from-purple-50/30 via-transparent to-yellow-50/30' 
                        : `bg-gradient-to-br from-${bundle.color}-50/20 via-transparent to-${bundle.color}-100/30`
                    } opacity-0 hover:opacity-100 transition-opacity duration-500`}></div>

                    <div className="grid lg:grid-cols-2 gap-8 p-8 relative z-10">
                      {/* Left Column - Main Info */}
                      <div>
                        <div className="flex items-center space-x-3 mb-6">
                          <div className={`w-16 h-16 bg-gradient-to-br ${colors.bg} rounded-2xl flex items-center justify-center text-3xl`}>
                            {bundle.icon}
                          </div>
                          <div>
                            <Badge variant="outline" className={colors.accent}>
                              {bundle.category}
                            </Badge>
                            <p className="text-sm text-gray-600 mt-1">{bundle.duration}</p>
                          </div>
                        </div>
                        
                        <h2 className="text-3xl font-bold mb-2">{bundle.title}</h2>
                        <p className={`text-xl ${isGradientBundle ? colors.text : colors.text} font-semibold mb-4`}>
                          {bundle.subtitle}
                        </p>
                        
                        {/* Project Value Display */}
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center space-x-3">
                            <Badge className="bg-blue-100 text-blue-800 font-semibold">
                              PROJECT-BASED INVESTMENT
                            </Badge>
                          </div>
                          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-200">
                            <p className="text-lg font-semibold text-blue-900 mb-2">
                              Value-Based Project Investment
                            </p>
                            <p className="text-blue-700 text-sm leading-relaxed">
                              Investment customized based on project scope, business size, and value delivered. 
                              {bundle.projectValue && (
                                <span className="font-medium"> {bundle.projectValue.professionalWorth}</span>
                              )}
                            </p>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                          {bundle.description}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                          <Button
                            onClick={() => setSelectedBundle(selectedBundle === bundle.id ? null : bundle.id)}
                            variant="outline"
                            className="flex-1"
                          >
                            {selectedBundle === bundle.id ? 'Hide Timeline' : 'View Implementation Timeline'}
                          </Button>
                          <Button
                            onClick={onBookingClick}
                            className={`flex-1 ${colors.button} text-white`}
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Get Started
                          </Button>
                        </div>
                      </div>

                      {/* Right Column - Benefits & Testimonial */}
                      <div>
                        {/* Key Benefits */}
                        <div className="mb-8">
                          <h3 className="text-xl font-bold text-gray-900 mb-4">What's Included:</h3>
                          <div className="space-y-3">
                            {bundle.benefits.map((benefit, i) => (
                              <div key={i} className="flex items-start space-x-3">
                                <CheckCircle className={`w-5 h-5 ${isGradientBundle ? 'text-purple-600' : colors.text} mt-0.5 flex-shrink-0`} />
                                <span className="text-gray-700">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Testimonial */}
                        <div className={`p-6 rounded-lg ${colors.accent}`}>
                          <div className="flex items-start space-x-3 mb-4">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-2xl">⭐</span>
                            </div>
                            <div>
                              <p className="text-gray-700 italic mb-3">"{bundle.testimonial.text}"</p>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <p className={`${isGradientBundle ? 'text-purple-600' : colors.text} font-semibold`}>
                                  – {bundle.testimonial.author}
                                </p>
                                <Badge variant="outline" className="bg-white">
                                  {bundle.testimonial.result}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Timeline */}
                    {selectedBundle === bundle.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-8 pb-8 pt-4 border-t border-gray-200 relative z-10"
                      >
                        <h4 className="text-xl font-bold text-gray-900 mb-6">Implementation Timeline:</h4>
                        <div className="grid md:grid-cols-3 gap-6">
                          {bundle.timeline.map((phase, i) => (
                            <div key={i} className="text-center">
                              <div className={`w-12 h-12 bg-gradient-to-br ${colors.bg} rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4`}>
                                {i + 1}
                              </div>
                              <h5 className="font-bold text-gray-900 mb-2">{phase.phase}</h5>
                              <p className="text-sm text-gray-600 mb-2">{phase.duration}</p>
                              <p className="text-sm text-gray-700">{phase.description}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Why Choose Bundles Section */}
          <div className="mt-20 mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Service Bundles?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our bundles are strategically designed combinations that work together to maximize your business growth and save you money.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Significant Savings</h3>
                <p className="text-gray-600 text-sm">Save up to $4,000+ compared to individual service pricing</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Strategic Combinations</h3>
                <p className="text-gray-600 text-sm">Services carefully paired for maximum synergy and results</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Faster Results</h3>
                <p className="text-gray-600 text-sm">Comprehensive approach delivers results faster than piecemeal solutions</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Proven Success</h3>
                <p className="text-gray-600 text-sm">Bundle clients see 2-3x better results than single-service clients</p>
              </div>
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
          <div className="text-center bg-white rounded-xl p-8">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--ra-burgundy)' }}>Ready to Transform Your Business?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto" style={{ color: 'var(--ra-red-dark)', opacity: 0.9 }}>
              Choose the bundle that matches your business stage and goals. Not sure which one is right for you? 
              Schedule a free consultation and we'll help you find the perfect fit.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-8">
              <Button 
                onClick={onBookingClick}
                className="ra-btn-cta px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Free Bundle Consultation
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                onClick={onViewPricingCalculator}
                variant="outline"
                className="px-8 py-4 text-lg font-semibold border-2 border-[var(--ra-copper)] text-[var(--ra-copper)] hover:bg-[var(--ra-copper)] hover:text-white transition-all duration-300"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Try Pricing Calculator
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-[var(--ra-cta-wealth-secondary)]/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--ra-red-crimson)]">$4K+</div>
                <div className="text-[var(--ra-orange-muted)] opacity-80">Max Savings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--ra-red-crimson)]">98%</div>
                <div className="text-[var(--ra-orange-muted)] opacity-80">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--ra-red-crimson)]">5</div>
                <div className="text-[var(--ra-orange-muted)] opacity-80">Bundle Options</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}