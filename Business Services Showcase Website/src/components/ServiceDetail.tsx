import React from 'react';
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Calendar, CheckCircle, Clock, Users, Target, Star, ArrowRight, Plus, DollarSign, Zap, TrendingUp, Award, Shield, MapPin, User, Briefcase, Timer, BarChart, Quote, Rocket, Phone, Calculator, Brain } from "lucide-react";
import { serviceDetails } from "../data/serviceDetails";
import { colorClasses } from "../data/colorClasses";
import { motion } from "motion/react";
import { ABTestSwitch, useABTest } from "./ABTesting";

// Lazy load success stories to prevent blocking
const getSuccessStory = async (serviceId) => {
  try {
    const { successStoriesContent } = await import("../data/successStories");
    return successStoriesContent[serviceId] || null;
  } catch (error) {
    console.warn('Failed to load success stories:', error);
    return null;
  }
};

export function ServiceDetail({ serviceId, onBackClick, onBookingClick, onServiceSelect, onViewBundles, onViewPricingCalculator, onViewSocialProof }) {
  const service = serviceDetails[serviceId];
  const [successStory, setSuccessStory] = React.useState(null);
  const [loadingStory, setLoadingStory] = React.useState(false);
  
  // A/B Testing for Service Detail CTAs
  const heroCtaTest = useABTest('service-detail-hero-cta') || { variant: 'control', trackConversion: () => {} };
  const investmentCtaTest = useABTest('service-detail-investment-cta') || { variant: 'control', trackConversion: () => {} };
  
  // Load success story data lazily
  React.useEffect(() => {
    if (!serviceId) return;
    
    let isMounted = true;
    setLoadingStory(true);
    
    getSuccessStory(serviceId)
      .then(story => {
        if (isMounted) {
          setSuccessStory(story);
        }
      })
      .catch(error => {
        console.warn('Error loading success story:', error);
      })
      .finally(() => {
        if (isMounted) {
          setLoadingStory(false);
        }
      });
    
    return () => {
      isMounted = false;
    };
  }, [serviceId]);
  
  if (!service) {
    return (
      <div className="py-20 px-4 text-center">
        <h1 className="text-2xl font-bold ra-text-primary mb-4">Service Not Found</h1>
        <Button onClick={onBackClick} className="ra-btn-secondary-modern">Back to Services</Button>
      </div>
    );
  }

  // Fallback to emerald if the service color is not found in colorClasses
  const colors = colorClasses[service.color] || colorClasses.emerald;
  const isGradientService = service.color === 'gradient';

  return (
    <div className="min-h-screen bg-white">
      {/* Redesigned Compact Hero Section */}
      <section className="ra-hero-modern relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 ra-hero-background"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid lg:grid-cols-12 gap-8 items-center"
          >
            {/* Left Column - Service Info & CTAs (8 columns) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Service Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 ra-icon-modern text-2xl flex-shrink-0">
                    {service.icon}
                  </div>
                  <div>
                    <Badge className="ra-category-badge mb-2 text-xs">
                      {service.category}
                    </Badge>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight ra-text-primary">
                      {service.title}
                    </h1>
                  </div>
                </div>
                

              </div>

              {/* Subtitle & Key Benefits Row */}
              <div className="grid sm:grid-cols-2 gap-4 items-start">
                <div>
                  <p className="text-lg sm:text-xl font-bold ra-gradient-text mb-3">
                    Professional {service.category} Service
                  </p>
                  <p className="text-sm ra-text-secondary leading-relaxed">
                    {service.heroDescription || `Get expert ${service.category.toLowerCase()} guidance with our proven ${service.title} system. Fast results, personalized approach, guaranteed success.`}
                  </p>
                </div>
                
                {/* Trust Indicators - Compact Grid */}
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center text-sm ra-text-secondary">
                    <Clock className="w-4 h-4 mr-2 ra-text-accent" />
                    <span className="font-medium">{service.duration}</span>
                  </div>
                  <div className="flex items-center text-sm ra-text-secondary">
                    <Target className="w-4 h-4 mr-2 ra-text-accent" />
                    <span className="font-medium">{service.investmentTier || 'Professional Level'}</span>
                  </div>
                  <div className="flex items-center text-sm ra-text-secondary">
                    <Shield className="w-4 h-4 mr-2 ra-text-accent" />
                    <span className="font-medium">Results Guaranteed</span>
                  </div>
                </div>
              </div>

              {/* CTA Row */}
              <ABTestSwitch
                testId="service-detail-hero-cta"
                variants={{
                  'control': (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={() => {
                          heroCtaTest.trackConversion();
                          onViewPricingCalculator();
                        }}
                        className="ra-btn-primary-modern flex-1 sm:flex-none"
                      >
                        <Calculator className="w-4 h-4 mr-2" />
                        {service.strategicCTA || 'Discover My Investment Options'}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                      
                      <Button 
                        onClick={onBookingClick}
                        variant="outline"
                        className="ra-btn-secondary-modern flex-1 sm:flex-none"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Book Strategy Call
                      </Button>
                    </div>
                  ),
                  'urgency': (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={() => {
                          heroCtaTest.trackConversion();
                          onViewPricingCalculator();
                        }}
                        className="ra-btn-primary-modern ra-pulse flex-1 sm:flex-none"
                      >
                        <Rocket className="w-4 h-4 mr-2" />
                        Get FREE Analysis Now
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                      
                      <Button 
                        onClick={onBookingClick}
                        variant="outline"
                        className="ra-btn-secondary-modern flex-1 sm:flex-none"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Limited Spots Available
                      </Button>
                    </div>
                  ),
                  'value': (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={() => {
                          heroCtaTest.trackConversion();
                          onViewPricingCalculator();
                        }}
                        className="ra-btn-primary-modern flex-1 sm:flex-none"
                      >
                        <Calculator className="w-4 h-4 mr-2" />
                        {service.strategicCTA || 'Discover My Investment Options'}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                      
                      <Button 
                        onClick={onViewSocialProof || onBookingClick}
                        variant="outline"
                        className="ra-btn-secondary-modern flex-1 sm:flex-none"
                      >
                        <BarChart className="w-4 h-4 mr-2" />
                        View Success Stories
                      </Button>
                    </div>
                  )
                }}
                fallback={
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      onClick={onViewPricingCalculator}
                      className="ra-btn-primary-modern flex-1 sm:flex-none"
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      Discover My Investment Options
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    
                    <Button 
                      onClick={onBookingClick}
                      variant="outline"
                      className="ra-btn-secondary-modern flex-1 sm:flex-none"
                    >
                      Learn More
                    </Button>
                  </div>
                }
              />
            </div>

            {/* Right Column - Social Proof & Quick Stats (4 columns) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Featured Social Proof Card */}
              <Card className="ra-testimonial-featured">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs font-semibold ra-text-primary">Verified Result</span>
                  </div>
                  <blockquote className="text-sm font-semibold ra-text-primary mb-3 leading-relaxed">
                    "From $50K to $2.3M in 18 months using their {service.title} system."
                  </blockquote>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">SJ</span>
                    </div>
                    <div>
                      <div className="font-semibold ra-text-primary text-xs">Sarah Johnson</div>
                      <div className="text-xs ra-text-muted">Tech Founder</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Achievement Stats - Mobile Visible */}
              <div className="sm:hidden grid grid-cols-2 gap-3">
                <div className="text-center p-3 ra-bg-soft rounded-lg">
                  <div className="text-lg font-black ra-text-accent">98%</div>
                  <div className="text-xs ra-text-muted">Success Rate</div>
                </div>
                <div className="text-center p-3 ra-bg-soft rounded-lg">
                  <div className="text-lg font-black ra-text-accent">500+</div>
                  <div className="text-xs ra-text-muted">Clients Served</div>
                </div>
              </div>

              {/* Service Quality Badge */}
              <div className="ra-social-badge flex items-center space-x-2 px-3 py-2 text-xs">
                <div className="flex -space-x-1">
                  <div className="w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                    <Star className="w-2 h-2 text-white" />
                  </div>
                  <div className="w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                    <TrendingUp className="w-2 h-2 text-white" />
                  </div>
                  <div className="w-5 h-5 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center">
                    <Award className="w-2 h-2 text-white" />
                  </div>
                </div>
                <span className="font-semibold ra-text-primary">
                  ⚡ Quick Results • Expert Support
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className={`grid w-full ${service.tiers ? 'grid-cols-8' : 'grid-cols-7'} ra-bg-soft`}>
              <TabsTrigger value="overview" className="font-semibold">Overview</TabsTrigger>
              {service.tiers && <TabsTrigger value="pricing" className="font-semibold">Pricing</TabsTrigger>}
              <TabsTrigger value="commitment" className="font-semibold">Investment</TabsTrigger>
              <TabsTrigger value="process" className="font-semibold">Process</TabsTrigger>
              <TabsTrigger value="deliverables" className="font-semibold">Deliverables</TabsTrigger>
              <TabsTrigger value="addons" className="font-semibold">Add-Ons</TabsTrigger>
              <TabsTrigger value="testimonials" className="font-semibold">Success Stories</TabsTrigger>
              <TabsTrigger value="faq" className="font-semibold">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="ra-stat-modern">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <Users className={`w-6 h-6 ${isGradientService ? 'text-purple-600' : colors.text}`} />
                      <span className="ra-text-primary">Who This Is For</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {(service.whoItsFor || [
                        'Entrepreneurs ready for growth',
                        'Business owners seeking solutions',
                        'Anyone committed to success',
                        'Leaders wanting transformation'
                      ]).map((item, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <CheckCircle className={`w-5 h-5 ${isGradientService ? 'text-purple-600' : colors.text} mt-0.5 flex-shrink-0`} />
                          <span className="ra-text-secondary">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="ra-stat-modern">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <Target className={`w-6 h-6 ${isGradientService ? 'text-purple-600' : colors.text}`} />
                      <span className="ra-text-primary">Pain Points We Solve</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {(service.painPointsSolved || [
                        'Lack of clear direction and strategy',
                        'Inefficient processes and systems',
                        'Limited growth and scaling ability',
                        'Need for professional guidance'
                      ]).map((item, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-3 h-3 ra-bg-soft rounded-full mt-2 flex-shrink-0 border-2 border-ra-gold"></div>
                          <span className="ra-text-secondary">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card className="ra-stat-modern">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <Star className={`w-6 h-6 ${isGradientService ? 'text-purple-600' : colors.text}`} />
                    <span className="ra-text-primary">Expected Outcomes</span>
                  </CardTitle>
                  <CardDescription className="ra-text-secondary">
                    What you can expect to achieve by the end of this program
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {(service.expectedOutcomes || [
                      'Clear roadmap and strategic direction',
                      'Improved systems and processes',
                      'Enhanced growth capabilities',
                      'Measurable business results'
                    ]).map((outcome, index) => (
                      <div key={index} className="ra-outcome-item">
                        <CheckCircle className="ra-outcome-icon" />
                        <span>{outcome}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pricing Tab for Tiered Services */}
            {service.tiers && (
              <TabsContent value="pricing" className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-black ra-text-primary mb-4">Choose Your Investment Level</h2>
                  <p className="text-xl ra-text-secondary">Select the perfect tier for your business transformation</p>
                </div>
                
                <div className="ra-tiers-grid">
                  {service.tiers.map((tier, index) => (
                    <div key={index} className={`ra-pricing-tier ${tier.popular || index === 1 ? 'popular' : ''}`}>
                      <div className="ra-tier-header">
                        <h3 className="ra-tier-name">{tier.name}</h3>
                        
                        {/* Psychological Pricing Display */}
                        {tier.psychologicalPrice ? (
                          <>
                            <div className="ra-tier-price-display">{tier.psychologicalPrice.display}</div>
                            <div className="ra-tier-value-range">{tier.psychologicalPrice.range}</div>
                            <div className="ra-tier-callout">{tier.psychologicalPrice.callout}</div>
                            <div className="ra-tier-urgency">{tier.psychologicalPrice.urgency}</div>
                            <div className="ra-tier-value-statement">{tier.psychologicalPrice.valueStatement}</div>
                          </>
                        ) : (
                          <>
                            <div className="ra-tier-price-display">{tier.price}</div>
                            <div className="ra-tier-value-range">Professional Investment</div>
                          </>
                        )}
                      </div>
                      
                      <ul className="ra-tier-features">
                        {tier.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="ra-tier-feature">
                            <CheckCircle className="ra-tier-feature-icon" />
                            <span className="ra-tier-feature-text">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button 
                        onClick={onBookingClick}
                        className="ra-tier-cta"
                      >
                        {tier.popular || index === 1 ? 'Get Started Now' : 'Select This Plan'}
                      </Button>
                    </div>
                  ))}
                </div>

                {/* All Tiers Include Section */}
                {service.bonuses && (
                  <Card className="ra-cta-section">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-center justify-center">
                        <Star className="w-6 h-6 ra-text-accent" />
                        <span className="ra-text-primary text-2xl font-black">All Tiers Include</span>
                        <Star className="w-6 h-6 ra-text-accent" />
                      </CardTitle>
                      <CardDescription className="text-center ra-text-secondary">
                        Bonus features included with every plan at no additional cost
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        {service.bonuses.map((bonus, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <Star className="w-5 h-5 ra-text-accent mt-0.5 flex-shrink-0" />
                            <span className="ra-text-primary font-semibold">{bonus}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            )}

            <TabsContent value="commitment" className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black ra-text-primary mb-4">Your Investment in {service.title}</h2>
                <p className="text-xl ra-text-secondary max-w-3xl mx-auto">
                  Understanding the financial commitment and expected returns from investing in this service package
                </p>
              </div>

              {/* Service Investment Overview */}
              <Card className="ra-cta-section-premium">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-center justify-center">
                    <DollarSign className="w-6 h-6 ra-text-accent" />
                    <span className="ra-text-primary text-2xl font-black">Investment Overview</span>
                    <DollarSign className="w-6 h-6 ra-text-accent" />
                  </CardTitle>
                  <CardDescription className="text-center ra-text-secondary text-lg">
                    Why investing in {service.title} delivers exceptional business value
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="ra-result-highlight">
                        <h4 className="font-bold ra-text-primary mb-3 flex items-center">
                          <Target className="w-5 h-5 mr-2 ra-text-accent" />
                          Your Investment Range
                        </h4>
                        <div className="text-center">
                          {service.tiers ? (
                            <div className="space-y-2">
                              <div className="text-3xl font-black ra-gradient-text">
                                {service.tiers[0]?.price} - {service.tiers[service.tiers.length - 1]?.price}
                              </div>
                              <p className="text-sm ra-text-secondary">Based on selected tier and customizations</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="text-3xl font-black ra-gradient-text">Custom Pricing</div>
                              <p className="text-sm ra-text-secondary">Tailored to your specific business needs</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="ra-result-highlight">
                        <h4 className="font-bold ra-text-primary mb-3 flex items-center">
                          <TrendingUp className="w-5 h-5 mr-2 ra-text-accent" />
                          Expected ROI Timeline
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm ra-text-secondary">30-60 Days:</span>
                            <Badge className="bg-green-500 text-white">Initial Returns</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm ra-text-secondary">3-6 Months:</span>
                            <Badge className="bg-blue-500 text-white">200-400% ROI</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm ra-text-secondary">12+ Months:</span>
                            <Badge className="bg-purple-500 text-white">500-1000%+ ROI</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="ra-result-highlight">
                        <h4 className="font-bold ra-text-primary mb-3 flex items-center">
                          <Shield className="w-5 h-5 mr-2 ra-text-accent" />
                          Investment Protection
                        </h4>
                        <ul className="space-y-2">
                          <li className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 ra-text-accent mt-1 flex-shrink-0" />
                            <span className="ra-text-secondary text-sm">Money-back guarantee if no measurable results</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 ra-text-accent mt-1 flex-shrink-0" />
                            <span className="ra-text-secondary text-sm">Milestone-based payment structure available</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 ra-text-accent mt-1 flex-shrink-0" />
                            <span className="ra-text-secondary text-sm">90-day results tracking and optimization</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 ra-text-accent mt-1 flex-shrink-0" />
                            <span className="ra-text-secondary text-sm">Ongoing support included in investment</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="ra-result-highlight border-orange-200 bg-orange-50">
                        <h4 className="font-bold text-orange-800 mb-3 flex items-center">
                          <Clock className="w-5 h-5 mr-2 text-orange-600" />
                          Cost of Delayed Investment
                        </h4>
                        <p className="text-orange-700 text-sm leading-relaxed">
                          Every month without implementing {service.title} typically costs businesses 10-20% of potential revenue growth. 
                          Most clients recover their full investment within 60-90 days through improved performance.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Value-Based Investment Approach */}
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-3xl font-black ra-text-primary mb-4">Value-Based Investment Approach</h3>
                  <p className="text-lg ra-text-secondary max-w-2xl mx-auto">
                    Investment customized to your business goals, growth stage, and value delivered. No fixed pricing - every engagement is tailored to maximize your ROI.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Value Driver Focus */}
                  <Card className="ra-stat-modern">
                    <CardHeader className="text-center">
                      <Badge className="bg-green-500 text-white mx-auto mb-3">
                        <Zap className="w-4 h-4 mr-1" />
                        Value-Driven
                      </Badge>
                      <CardTitle className="text-2xl font-bold ra-text-primary">Business Impact Focus</CardTitle>
                      <p className="ra-text-secondary text-sm">Investment aligned with your business value and growth potential</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="ra-strategic-pricing-box">
                        <div className="text-center">
                          <div className="text-xl font-black ra-text-accent mb-2">Value-Based Investment</div>
                          <p className="text-xs ra-text-secondary">Tailored to your business goals</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm ra-text-secondary">Investment Model:</span>
                          <Badge variant="outline" className="ra-strategic-cta ra-strategic-cta-empathetic">
                            Value-Based
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm ra-text-secondary">Payment Options:</span>
                          <Badge variant="outline" className="ra-strategic-cta ra-strategic-cta-value">
                            Flexible Terms
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm ra-text-secondary">Value Delivered:</span>
                          <Badge variant="outline" className="ra-strategic-cta ra-strategic-cta-interactive">
                            Measurable ROI
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-200">
                        <h5 className="font-semibold ra-text-primary text-sm mb-2">Investment Factors:</h5>
                        <ul className="space-y-1">
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 ra-text-accent" />
                            <span className="text-xs ra-text-secondary">Current business size & revenue</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 ra-text-accent" />
                            <span className="text-xs ra-text-secondary">Growth potential & opportunity size</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 ra-text-accent" />
                            <span className="text-xs ra-text-secondary">Service complexity & customization</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Milestone Investment Option */}
                  <Card className="ra-stat-modern border-2 ra-border-accent transform scale-105 relative ra-performance-investment-card">
                    <div className="ra-performance-badge">
                      Most Popular
                    </div>
                    <CardHeader className="text-center">
                      <Badge className="bg-blue-500 text-white mx-auto mb-3">
                        <Target className="w-4 h-4 mr-1" />
                        Milestone-Based
                      </Badge>
                      <CardTitle className="text-2xl font-bold ra-text-primary">Performance Investment</CardTitle>
                      <p className="ra-text-secondary text-sm">Pay as we deliver results and hit milestones</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="ra-strategic-pricing-box">
                        <div className="text-center">
                          <div className="text-2xl font-black ra-text-accent mb-2">Pay on Results</div>
                          <p className="text-xs ra-text-secondary">Aligned with your success</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm ra-text-secondary">Initial Investment:</span>
                          <Badge variant="outline" className="ra-strategic-cta ra-strategic-cta-empathetic">
                            30% Upfront
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm ra-text-secondary">Milestone Payments:</span>
                          <Badge variant="outline" className="ra-strategic-cta ra-strategic-cta-value">
                            Results-Based
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm ra-text-secondary">Final Payment:</span>
                          <Badge variant="outline" className="ra-strategic-cta ra-strategic-cta-interactive">
                            On Completion
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-200">
                        <h5 className="font-semibold ra-text-primary text-sm mb-2">Protection:</h5>
                        <ul className="space-y-1">
                          <li className="flex items-center space-x-2">
                            <Shield className="w-3 h-3 ra-text-accent" />
                            <span className="text-xs ra-text-secondary">Performance guarantees</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <Shield className="w-3 h-3 ra-text-accent" />
                            <span className="text-xs ra-text-secondary">Milestone checkpoints</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <Shield className="w-3 h-3 ra-text-accent" />
                            <span className="text-xs ra-text-secondary">Progress tracking</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Unique Value Capture */}
                  <Card className="ra-stat-modern">
                    <CardHeader className="text-center">
                      <Badge className="bg-purple-500 text-white mx-auto mb-3">
                        <Award className="w-4 h-4 mr-1" />
                        Custom Approach
                      </Badge>
                      <CardTitle className="text-2xl font-bold ra-text-primary">Expertise Premium</CardTitle>
                      <p className="ra-text-secondary text-sm">Investment reflects unique expertise and custom solutions</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="ra-strategic-pricing-box">
                        <div className="text-center">
                          <div className="text-xl font-black ra-text-accent mb-2">Unique Expertise Value</div>
                          <p className="text-xs ra-text-secondary">No cookie-cutter solutions</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm ra-text-secondary">Customization Level:</span>
                          <Badge variant="outline" className="ra-strategic-cta ra-strategic-cta-empathetic">
                            100% Custom
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm ra-text-secondary">Expertise Premium:</span>
                          <Badge variant="outline" className="ra-strategic-cta ra-strategic-cta-value">
                            Specialist-Level
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm ra-text-secondary">Value Multiplier:</span>
                          <Badge variant="outline" className="ra-strategic-cta ra-strategic-cta-interactive">
                            Business-Specific
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-200">
                        <h5 className="font-semibold ra-text-primary text-sm mb-2">Expertise Factors:</h5>
                        <ul className="space-y-1">
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 ra-text-accent" />
                            <span className="text-xs ra-text-secondary">Years of specialized experience</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 ra-text-accent" />
                            <span className="text-xs ra-text-secondary">Proven track record in your industry</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 ra-text-accent" />
                            <span className="text-xs ra-text-secondary">Custom solutions avoiding constraints</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* ROI Calculator */}
              <Card className="ra-stat-modern">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-center justify-center">
                    <BarChart className="w-6 h-6 ra-text-accent" />
                    <span className="ra-text-primary text-2xl font-black">Investment ROI Metrics</span>
                    <BarChart className="w-6 h-6 ra-text-accent" />
                  </CardTitle>
                  <CardDescription className="text-center ra-text-secondary">
                    Expected return metrics based on typical client results for {service.title}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="ra-result-highlight">
                      <div className="text-center mb-4">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <DollarSign className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-bold ra-text-primary">Month 1-2</h4>
                        <p className="text-xs ra-text-muted">Quick Wins</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-black text-green-600 mb-1">25-50%</div>
                        <p className="text-sm ra-text-secondary">Investment recovered through immediate optimizations</p>
                      </div>
                    </div>
                    
                    <div className="ra-result-highlight">
                      <div className="text-center mb-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-bold ra-text-primary">Month 3-6</h4>
                        <p className="text-xs ra-text-muted">Foundation Build</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-black text-blue-600 mb-1">200-400%</div>
                        <p className="text-sm ra-text-secondary">ROI through systematic improvements and growth</p>
                      </div>
                    </div>
                    
                    <div className="ra-result-highlight">
                      <div className="text-center mb-4">
                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-bold ra-text-primary">Month 6-12</h4>
                        <p className="text-xs ra-text-muted">Acceleration</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-black text-purple-600 mb-1">500-800%</div>
                        <p className="text-sm ra-text-secondary">ROI through scaling and market expansion</p>
                      </div>
                    </div>
                    
                    <div className="ra-result-highlight">
                      <div className="text-center mb-4">
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-bold ra-text-primary">Year 2+</h4>
                        <p className="text-xs ra-text-muted">Long-term</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-black text-orange-600 mb-1">1000%+</div>
                        <p className="text-sm ra-text-secondary">Sustained growth and market leadership</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CROA Compliance Disclaimer */}
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-orange-800 mb-2">Investment Results Disclaimer</h4>
                      <p className="text-orange-700 text-sm leading-relaxed mb-3">
                        <strong>Individual results may vary based on effort, market conditions, and implementation consistency.</strong> 
                        ROI percentages represent typical outcomes from clients who fully implement our {service.title} methodology. 
                        Past performance does not guarantee future results. Success requires active participation and consistent execution of recommended strategies.
                      </p>
                      <p className="text-orange-700 text-xs">
                        Your investment in {service.title} is in proven processes and strategic guidance. Actual returns depend on your commitment to implementation, market variables, and business-specific factors beyond our control.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>


              {/* Enhanced Single CTA Section with A/B Testing */}
              <div className="text-center">
                <Card className="ra-cta-section-premium">

                </Card>
              </div>
            </TabsContent>

            <TabsContent value="process" className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black ra-text-primary mb-4">Our Proven Process</h2>
                <p className="text-xl ra-text-secondary">Strategic journey to your business transformation</p>
              </div>
              
              <div className="space-y-6">
                {(service.processSteps || [
                  { 
                     
                    title: "Discovery & Planning", 
                    description: "We analyze your current situation and create a customized strategy.", 
                    duration: "1-2 weeks" 
                  },
                  { 
                     
                    title: "Implementation", 
                    description: "Execute the plan with our proven systems and methodologies.", 
                    duration: "4-6 weeks" 
                  },
                  { 
                     
                    title: "Optimization", 
                    description: "Fine-tune and optimize for maximum results and efficiency.", 
                    duration: "2-3 weeks" 
                  },
                  { 
                     
                    title: "Results & Scaling", 
                    description: "Achieve results and prepare for sustainable growth.", 
                    duration: "Ongoing" 
                  }
                ]).map((step, index) => (
                  <Card key={index} className="ra-stat-modern relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-ra-lime to-ra-gold"></div>
                    <CardContent className="pt-6 pl-8">
                      <div className="flex items-start space-x-6">
                        <div className="w-14 h-14 ra-icon-modern text-lg font-black flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                            <h3 className="text-xl font-bold ra-text-primary">{step.title}</h3>
                            <Badge className="ra-category-badge">
                              {step.duration}
                            </Badge>
                          </div>
                          <p className="ra-text-secondary mb-4 leading-relaxed text-lg">
                            {step.description}
                          </p>
                          {step.deliverables && step.deliverables.length > 0 && (
                            <div>
                              <h4 className="font-semibold ra-text-primary mb-3">Key Deliverables:</h4>
                              <div className="grid md:grid-cols-2 gap-3">
                                {step.deliverables.map((deliverable, i) => (
                                  <div key={i} className="ra-outcome-item">
                                    <CheckCircle className="ra-outcome-icon" />
                                    <span>{deliverable}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="deliverables" className="space-y-8">
              <Card className="ra-stat-modern">
                <CardHeader>
                  <CardTitle className="ra-text-primary text-2xl">Complete Deliverables Package</CardTitle>
                  <CardDescription className="ra-text-secondary">
                    Everything you'll receive as part of this comprehensive program
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {(service.coreDeliverables || [
                      'Comprehensive strategy document',
                      'Implementation roadmap',
                      'Custom templates and tools',
                      'Training and documentation',
                      'Ongoing support and guidance',
                      'Results tracking and analytics'
                    ]).map((deliverable, index) => (
                      <div key={index} className="ra-outcome-item p-4 rounded-lg ra-bg-soft border ra-border-light">
                        <CheckCircle className="ra-outcome-icon" />
                        <span className="font-semibold">{deliverable}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {service.bonuses && (
                <Card className="ra-cta-section">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <Star className="w-6 h-6 ra-text-accent" />
                      <span className="ra-text-primary text-xl">Exclusive Bonuses</span>
                    </CardTitle>
                    <CardDescription className="ra-text-secondary">
                      Additional value included at no extra cost
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {service.bonuses.map((bonus, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Star className="w-5 h-5 ra-text-accent mt-0.5 flex-shrink-0" />
                          <span className="ra-text-primary font-semibold">{bonus}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="addons" className="space-y-8">
              <Card className="ra-stat-modern">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <Plus className="w-6 h-6 ra-text-accent" />
                    <span className="ra-text-primary text-2xl">Available Add-Ons</span>
                  </CardTitle>
                  <CardDescription className="ra-text-secondary">
                    Enhance your service package with these powerful add-ons
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {service.addOns && service.addOns.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      {service.addOns.map((addon, index) => (
                        <Card key={index} className="ra-stat-modern hover:ra-border-accent transition-colors duration-300">
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-4">
                              <h4 className="font-bold text-lg ra-text-primary">{addon.name}</h4>
                              <Badge className="ra-cta-badge font-bold">
                                ${addon.price}
                              </Badge>
                            </div>
                            <p className="ra-text-secondary leading-relaxed mb-6">{addon.description}</p>
                            <Button 
                              onClick={onBookingClick}
                              className="w-full ra-btn-secondary-modern"
                            >
                              Add to Package
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="ra-text-muted text-lg">No add-ons available for this service.</p>
                      <p className="ra-text-muted mt-2">Contact us to discuss custom enhancements.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="testimonials" className="space-y-8">
              {(() => {
                // Show loading state while success story loads
                if (loadingStory) {
                  return (
                    <div className="text-center py-12">
                      <div className="w-8 h-8 ra-spinner-modern mx-auto mb-4"></div>
                      <p className="ra-text-secondary">Loading success story...</p>
                    </div>
                  );
                }
                
                if (!successStory) {
                  // Fallback to basic testimonials if no success story exists
                  return (
                    <>
                      <div className="text-center mb-12">
                        <h2 className="text-4xl font-black ra-text-primary mb-4">Success Stories</h2>
                        <p className="text-xl ra-text-secondary">Real results from real entrepreneurs</p>
                      </div>
                      
                      <div className="grid lg:grid-cols-2 gap-8">
                        {(service.testimonials || [service.testimonial]).filter(Boolean).map((testimonial, index) => (
                          <Card key={index} className="ra-testimonial-featured">
                            <CardContent className="pt-6">
                              <div className="flex items-start space-x-4">
                                <div className="w-14 h-14 ra-icon-modern text-lg font-bold flex-shrink-0">
                                  {testimonial.author.split(',')[0].charAt(0)}
                                </div>
                                <div>
                                  <p className="ra-text-secondary italic mb-4 text-lg leading-relaxed">
                                    "{testimonial.text}"
                                  </p>
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <p className="ra-text-accent font-bold">– {testimonial.author}</p>
                                    {testimonial.result && (
                                      <Badge className="ra-category-badge">
                                        {testimonial.result}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </>
                  );
                }

                return (
                  <>
                    {/* HERO TESTIMONIAL - Emotional Hook at Top */}
                    <Card className="ra-cta-section-premium mb-12">
                      <CardContent className="pt-8 pb-8">
                        <div className="text-center max-w-5xl mx-auto">
                          {/* Trust Badge */}
                          <div className="inline-flex items-center space-x-2 px-6 py-3 ra-social-badge mb-8">
                            <Shield className="w-5 h-5 ra-text-accent" />
                            <span className="font-bold">Verified Case Study • Real Results</span>
                          </div>
                          
                          {/* Featured Quote - Maximum Impact */}
                          <Quote className="w-16 h-16 ra-text-accent mx-auto mb-8 opacity-30" />
                          <blockquote className="text-3xl sm:text-4xl font-black ra-text-primary mb-8 leading-tight">
                            "{successStory.quote}"
                          </blockquote>
                          
                          {/* Client Information with Enhanced Visual Appeal */}
                          <div className="flex items-center justify-center space-x-6 mb-8">
                            <div className="w-20 h-20 ra-icon-modern text-2xl font-bold shadow-xl">
                              {successStory.author.split(',')[0].charAt(0)}
                            </div>
                            <div className="text-left">
                              <p className="font-black ra-text-primary text-2xl">— {successStory.author}</p>
                              <p className="ra-text-secondary text-lg font-semibold">{successStory.credibilityMarkers.business_logo}</p>
                              <div className="flex items-center space-x-3 mt-2">
                                <Badge className="ra-cta-badge">
                                  {successStory.clientArchetype}
                                </Badge>
                                <Badge className="bg-green-100 text-green-800 border border-green-300">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Verified Client
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {/* Quick Results Highlight */}
                          <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <div className="p-6 bg-green-50 rounded-xl border-2 border-green-200">
                              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
                              <p className="font-black text-2xl text-green-800 mb-1">{successStory.measurableOutcomes.revenue_growth.split(' ')[0]}</p>
                              <p className="text-sm font-semibold text-green-700">Revenue Growth</p>
                            </div>
                            <div className="p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                              <p className="font-black text-2xl text-blue-800 mb-1">{successStory.credibilityMarkers.timeline.split(' ')[1]}</p>
                              <p className="text-sm font-semibold text-blue-700">Time to Results</p>
                            </div>
                            <div className="p-6 bg-purple-50 rounded-xl border-2 border-purple-200">
                              <Star className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                              <p className="font-black text-2xl text-purple-800 mb-1">Premium</p>
                              <p className="text-sm font-semibold text-purple-700">Market Position</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* CASE STUDY HEADER - Logic Decision Framework */}
                    <div className="text-center mb-12">
                      <h2 className="text-5xl font-black ra-text-primary mb-4">Complete Case Study</h2>
                      <p className="text-xl ra-text-secondary max-w-3xl mx-auto">
                        From {successStory.transformationStory.before.situation.split(' ').slice(0, 5).join(' ')}... to remarkable transformation. 
                        Here's exactly how we did it.
                      </p>
                    </div>

                    {/* LOGICAL DECISION FRAMEWORK - Pain → Solution → Proof */}
                    <div className="grid lg:grid-cols-3 gap-8 mb-16">
                      {/* 1. PAIN IDENTIFICATION */}
                      <Card className="ra-stat-modern border-l-4 border-l-red-500 transform hover:scale-105 transition-all duration-300">
                        <CardHeader className="pb-4">
                          <CardTitle className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                              <Target className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                              <span className="text-red-600 text-lg font-black">The Problem</span>
                              <p className="text-sm ra-text-secondary">What wasn't working</p>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                              <h4 className="font-bold text-red-800 mb-2">Business Situation</h4>
                              <p className="text-red-700 text-sm leading-relaxed">{successStory.transformationStory.before.situation}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <h4 className="font-bold ra-text-primary mb-2">Emotional Impact</h4>
                              <p className="ra-text-secondary text-sm leading-relaxed">{successStory.transformationStory.before.emotional_state}</p>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                              <h4 className="font-bold text-orange-800 mb-2">Financial Reality</h4>
                              <p className="text-orange-700 text-sm leading-relaxed">{successStory.transformationStory.before.financial_state}</p>
                            </div>
                            <div className="flex items-center justify-center p-3 bg-red-100 rounded-lg">
                              <Timer className="w-5 h-5 text-red-600 mr-2" />
                              <span className="font-bold text-red-800 text-sm">{successStory.transformationStory.before.timeframe}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* 2. SOLUTION PROCESS */}
                      <Card className="ra-stat-modern border-l-4 border-l-blue-500 transform hover:scale-105 transition-all duration-300">
                        <CardHeader className="pb-4">
                          <CardTitle className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                              <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <span className="text-blue-600 text-lg font-black">The Solution</span>
                              <p className="text-sm ra-text-secondary">Our strategic approach</p>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <h4 className="font-bold text-blue-800 mb-2">Why They Chose Us</h4>
                              <p className="text-blue-700 text-sm leading-relaxed">{successStory.transformationStory.journey.decision_point}</p>
                            </div>
                            <div>
                              <h4 className="font-bold ra-text-primary mb-3">Strategic Milestones</h4>
                              <div className="space-y-3">
                                {successStory.transformationStory.journey.process_highlights.map((highlight, index) => (
                                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-1">
                                      {index + 1}
                                    </div>
                                    <span className="ra-text-secondary text-sm leading-relaxed">{highlight}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                              <h4 className="font-bold text-yellow-800 mb-2">💡 Breakthrough Moment</h4>
                              <p className="text-yellow-700 text-sm leading-relaxed italic">"{successStory.transformationStory.journey.breakthrough_moment}"</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* 3. RESULTS PROOF */}
                      <Card className="ra-stat-modern border-l-4 border-l-green-500 transform hover:scale-105 transition-all duration-300">
                        <CardHeader className="pb-4">
                          <CardTitle className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                              <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <span className="text-green-600 text-lg font-black">The Results</span>
                              <p className="text-sm ra-text-secondary">Measurable outcomes</p>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <div>
                              <h4 className="font-bold ra-text-primary mb-3">Concrete Achievements</h4>
                              <div className="space-y-3">
                                {successStory.transformationStory.after.concrete_results.map((result, index) => (
                                  <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-green-800 text-sm font-semibold">{result}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                              <h4 className="font-bold text-purple-800 mb-2">Personal Growth</h4>
                              <p className="text-purple-700 text-sm leading-relaxed">{successStory.transformationStory.after.emotional_transformation}</p>
                            </div>
                            <div className="p-4 bg-green-100 rounded-lg border border-green-300 text-center">
                              <h4 className="font-bold text-green-800 mb-2">🚀 Future Vision</h4>
                              <p className="text-green-700 text-sm font-semibold leading-relaxed">{successStory.transformationStory.after.future_trajectory}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* CREDIBILITY & VERIFICATION SECTION */}
                    <Card className="ra-testimonial-featured mb-12">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-center space-x-3 text-2xl">
                          <Shield className="w-8 h-8 ra-text-accent" />
                          <span className="ra-text-primary">Verified Business Transformation</span>
                        </CardTitle>
                        <CardDescription className="text-center ra-text-secondary text-lg">
                          Independently verified results with full transparency
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-8">
                          {/* Quantified Results */}
                          <div>
                            <h3 className="font-bold ra-text-primary mb-4 text-lg">📊 Quantified Impact</h3>
                            <div className="space-y-4">
                              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <h4 className="font-bold text-green-800 mb-1">Revenue Growth</h4>
                                <p className="text-green-700 font-semibold text-lg">{successStory.measurableOutcomes.revenue_growth}</p>
                              </div>
                              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h4 className="font-bold text-blue-800 mb-1">Efficiency Gains</h4>
                                <p className="text-blue-700 font-semibold">{successStory.measurableOutcomes.efficiency_gains}</p>
                              </div>
                              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                <h4 className="font-bold text-purple-800 mb-1">Market Impact</h4>
                                <p className="text-purple-700 font-semibold">{successStory.measurableOutcomes.market_position}</p>
                              </div>
                              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                <h4 className="font-bold text-yellow-800 mb-1">Strategic Wins</h4>
                                <p className="text-yellow-700 font-semibold text-sm leading-relaxed">{successStory.measurableOutcomes.strategic_wins}</p>
                              </div>
                            </div>
                          </div>

                          {/* Business Verification */}
                          <div>
                            <h3 className="font-bold ra-text-primary mb-4 text-lg">🔍 Verification Details</h3>
                            <div className="space-y-4">
                              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <Briefcase className="w-6 h-6 ra-text-accent flex-shrink-0" />
                                <div>
                                  <p className="font-semibold ra-text-primary">{successStory.credibilityMarkers.business_logo}</p>
                                  <p className="text-sm ra-text-secondary">{successStory.credibilityMarkers.industry_context}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <Clock className="w-6 h-6 text-blue-600 flex-shrink-0" />
                                <div>
                                  <p className="font-semibold text-blue-800">Program Completion</p>
                                  <p className="text-sm text-blue-700">{successStory.credibilityMarkers.timeline}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                                <div>
                                  <p className="font-semibold text-green-800">Verification Status</p>
                                  <p className="text-sm text-green-700">{successStory.credibilityMarkers.verification_badge}</p>
                                </div>
                              </div>
                              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-center">
                                <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                                <p className="font-bold text-yellow-800">Featured Success Story</p>
                                <p className="text-xs text-yellow-700 mt-1">Results independently verified</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* SINGLE STRATEGIC CTA - Decision Point */}
                    <Card className="ra-cta-section-urgent">
                      <CardContent className="pt-10 pb-10 text-center">
                        <div className="max-w-4xl mx-auto space-y-8">
                          <div className="mb-8">
                            <h2 className="text-4xl sm:text-5xl font-black ra-text-primary mb-4">
                              Your Turn for This Level of Success
                            </h2>
                            <p className="text-xl ra-text-secondary leading-relaxed">
                              {successStory.author.split(',')[0]} went from {successStory.transformationStory.before.situation.split(' ').slice(0, 6).join(' ')}... 
                              to {successStory.transformationStory.after.concrete_results[0]}. 
                              <span className="font-bold ra-text-primary"> You could be next.</span>
                            </p>
                          </div>

                          {/* Decision Logic Framework */}
                          <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <div className="p-6 bg-white rounded-xl border-2 border-gray-200">
                              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">❌</span>
                              </div>
                              <h4 className="font-bold text-red-800 mb-2">Keep Struggling Alone</h4>
                              <p className="text-sm text-red-700">Stay stuck with the same problems for another {successStory.transformationStory.before.timeframe}</p>
                            </div>
                            <div className="p-6 bg-yellow-50 rounded-xl border-2 border-yellow-300">
                              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">⚠️</span>
                              </div>
                              <h4 className="font-bold text-yellow-800 mb-2">Try DIY Solutions</h4>
                              <p className="text-sm text-yellow-700">Spend months learning what we already perfected</p>
                            </div>
                            <div className="p-6 bg-green-50 rounded-xl border-2 border-green-300">
                              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">✅</span>
                              </div>
                              <h4 className="font-bold text-green-800 mb-2">Get Professional Results</h4>
                              <p className="text-sm text-green-700">Achieve {successStory.measurableOutcomes.revenue_growth.split(' ')[0]} growth like {successStory.author.split(',')[0]}</p>
                            </div>
                          </div>

                          {/* Single, Powerful CTA */}
                          <div className="space-y-6">
                            <Button 
                              onClick={onBookingClick}
                              className="ra-btn-hero-main group text-xl px-12 py-6"
                            >
                              <Calendar className="w-6 h-6 mr-4" />
                              Get Your FREE {service.title} Strategy Session
                              <ArrowRight className="w-6 h-6 ml-4 group-hover:translate-x-2 transition-transform" />
                            </Button>
                            
                            <div className="ra-urgency-banner max-w-2xl mx-auto">
                              <div className="flex items-center justify-center space-x-3">
                                <Star className="w-6 h-6 text-yellow-600" />
                                <span className="font-bold text-lg">Limited: Free $2,500 Business Audit + Strategy Session</span>
                              </div>
                            </div>

                            <p className="text-sm ra-text-muted">
                              💡 <strong>Just like {successStory.author.split(',')[0]}</strong>, you'll get a complete analysis of your situation 
                              and a custom roadmap to achieve similar results. No obligation, no pressure.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                );
              })()}
            </TabsContent>

            <TabsContent value="faq" className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black ra-text-primary mb-4">Frequently Asked Questions</h2>
                <p className="text-xl ra-text-secondary">Everything you need to know</p>
              </div>
              
              <div className="space-y-6">
                {(service.faqs || [
                  {
                    question: "How long does it take to see results?",
                    answer: `Results vary by service, but most clients see initial progress within the first ${service.duration.split(' ')[0]} of the program. Full results are typically achieved by completion.`
                  },
                  {
                    question: "What support is included?",
                    answer: "All our services include dedicated support throughout the program duration, regular check-ins, and access to our team of experts."
                  },
                  {
                    question: "Is there a guarantee?",
                    answer: service.guarantee || "We stand behind our work with a satisfaction guarantee. Contact us to discuss specific terms for your service."
                  }
                ]).map((faq, index) => (
                  <Card key={index} className="ra-stat-modern">
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-bold ra-text-primary mb-4">{faq.question}</h3>
                      <p className="ra-text-secondary leading-relaxed">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {service.guarantee && (
                <Card className="ra-cta-section">
                  <CardContent className="pt-8 text-center">
                    <h3 className="text-2xl font-bold ra-text-primary mb-4">Our Guarantee</h3>
                    <p className="ra-text-secondary text-lg">{service.guarantee}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Bottom CTA Section */}
          <div className="mt-20">
            <Card className="ra-cta-section-premium text-center">
              <CardContent className="pt-8 pb-8">
                <div className="max-w-3xl mx-auto space-y-6">
                  <h2 className="text-4xl font-black ra-text-primary">Ready to Transform Your Business?</h2>
                  <p className="text-xl ra-text-secondary">
                    Join hundreds of successful entrepreneurs who have transformed their businesses with this program.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Button 
                      onClick={onBookingClick}
                      className="ra-btn-hero-main group"
                    >
                      <Calendar className="w-5 h-5 mr-3" />
                      Schedule Your Free Strategy Call
                      <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    
                    <Button 
                      onClick={onBookingClick}
                      variant="outline"
                      className="ra-btn-secondary-modern"
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Get Instant Quote
                    </Button>
                  </div>

                  <div className="ra-urgency-banner mt-8">
                    <div className="flex items-center justify-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-ra-olive-dark" />
                      <span className="font-bold">Limited Time: Free $2,500 Business Audit with Every Strategy Call</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}