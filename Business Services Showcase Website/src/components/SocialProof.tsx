import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Calendar, Play, Star, TrendingUp, Users, DollarSign, Award, Building, ArrowRight, Quote, ChevronLeft, ChevronRight, ArrowLeft, Cloud, Cog, Heart, Megaphone, Bot, Home, Scale, PiggyBank, Coffee, GraduationCap, HardHat, ShoppingCart, Truck, Zap, Activity, Store, Lightbulb, Target } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const successMetrics = [
  { label: 'Total Revenue Generated', value: '$500M+', icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-50' },
  { label: 'Businesses Transformed', value: '10,000+', icon: Building, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { label: 'Success Rate', value: '98%', icon: TrendingUp, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  { label: 'Client Satisfaction', value: '4.9/5', icon: Star, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  { label: 'Average ROI', value: '750%', icon: Award, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  { label: 'Jobs Created', value: '25,000+', icon: Users, color: 'text-cyan-600', bgColor: 'bg-cyan-50' }
];



const detailedCaseStudies = [
  {
    id: 1,
    company: 'TechFlow Solutions',
    industry: 'Software Development',
    founder: 'Sarah Chen',
    service: 'Growth+ Success Bundle',
    timeline: '18 months',
    challenge: 'Struggling startup with great product but no systems, funding, or scalable processes',
    solution: 'Complete business infrastructure overhaul with automation, funding access, and team building',
    results: {
      revenue: { before: '$50K', after: '$2.5M', growth: '4900%' },
      team: { before: '2', after: '15', growth: '650%' },
      funding: { secured: '$750K', credit: '$200K' },
      automation: '80% of operations automated',
      time: 'Reduced working hours from 80/week to 40/week'
    },
    testimonial: 'Revenue Avenue didn\'t just help us grow - they completely transformed how we think about business. The systems they built scale effortlessly.',
    tags: ['Startup', 'Tech', 'Scaling', 'Automation']
  },
  {
    id: 2,
    company: 'Green Valley Manufacturing',
    industry: 'Manufacturing',
    founder: 'Robert Kim',
    service: 'Business Financial Power + Impact Visibility',
    timeline: '12 months',
    challenge: 'Established business needing major funding for equipment and expansion',
    solution: 'Complete credit profile rebuild, grant applications, and market visibility enhancement',
    results: {
      funding: { credit: '$750K', grants: '$85K', total: '$835K' },
      visibility: '30+ directory listings, BBB accreditation',
      revenue: { before: '$500K', after: '$1.8M', growth: '260%' },
      contracts: '5 major corporate contracts secured',
      employees: { before: '8', after: '24', growth: '200%' }
    },
    testimonial: 'The funding we secured through Revenue Avenue completely transformed our business. We went from struggling to industry leader.',
    tags: ['Manufacturing', 'Funding', 'B2B', 'Growth']
  },
  {
    id: 3,
    company: 'Wellness Empire Co.',
    industry: 'Health & Wellness',
    founder: 'Victoria Thompson',
    service: 'Legacy EPIC Empire Program',
    timeline: '24 months',
    challenge: 'Successful coach wanting to build lasting impact and multiple income streams',
    solution: 'Multi-stream income system, high-ticket sales automation, and community impact programs',
    results: {
      streams: '7 active income streams',
      revenue: { before: '$200K', after: '$3.2M', growth: '1500%' },
      impact: '10,000+ lives transformed',
      automation: 'Fully automated high-ticket sales',
      team: { coaches: '12', support: '8' },
      community: '5,000 active members'
    },
    testimonial: 'This isn\'t just about money - it\'s about creating a legacy. Revenue Avenue helped me build something that truly matters.',
    tags: ['Coaching', 'Legacy', 'Empire', 'Impact']
  }
];

const companyLogos = [
  { name: 'CloudSync Technologies', industry: 'SaaS' },
  { name: 'Precision Steel Works', industry: 'Manufacturing' },
  { name: 'MedCare Partners', industry: 'Healthcare' },
  { name: 'BrandBoost Agency', industry: 'Digital Marketing' },
  { name: 'RoboTech Industries', industry: 'Automation' },
  { name: 'Prime Realty Group', industry: 'Real Estate' },
  { name: 'Meridian Law Firm', industry: 'Legal Services' },
  { name: 'Capital Growth Advisors', industry: 'Financial Services' },
  { name: 'Artisan Coffee Co.', industry: 'Food & Beverage' },
  { name: 'EduTech Solutions', industry: 'Education' },
  { name: 'BuildRight Construction', industry: 'Construction' },
  { name: 'OnlineMarket Pro', industry: 'E-commerce' },
  { name: 'FleetLogistics Corp', industry: 'Transportation' },
  { name: 'GreenEnergy Systems', industry: 'Renewable Energy' },
  { name: 'FitLife Wellness', industry: 'Fitness & Wellness' },
  { name: 'RetailPlus Stores', industry: 'Retail' },
  { name: 'TechForward Labs', industry: 'Technology R&D' },
  { name: 'Executive Strategy Group', industry: 'Management Consulting' }
];

// Industry-specific icon and color mapping
const getIndustryIconAndColors = (industry) => {
  const industryMap = {
    'SaaS': { 
      icon: Cloud, 
      bgColor: 'from-blue-500 to-blue-600',
      iconColor: 'text-white'
    },
    'Manufacturing': { 
      icon: Cog, 
      bgColor: 'from-gray-600 to-gray-700',
      iconColor: 'text-white'
    },
    'Healthcare': { 
      icon: Heart, 
      bgColor: 'from-red-500 to-pink-600',
      iconColor: 'text-white'
    },
    'Digital Marketing': { 
      icon: Megaphone, 
      bgColor: 'from-purple-500 to-purple-600',
      iconColor: 'text-white'
    },
    'Automation': { 
      icon: Bot, 
      bgColor: 'from-indigo-500 to-indigo-600',
      iconColor: 'text-white'
    },
    'Real Estate': { 
      icon: Home, 
      bgColor: 'from-green-500 to-green-600',
      iconColor: 'text-white'
    },
    'Legal Services': { 
      icon: Scale, 
      bgColor: 'from-slate-600 to-slate-700',
      iconColor: 'text-white'
    },
    'Financial Services': { 
      icon: PiggyBank, 
      bgColor: 'from-emerald-500 to-emerald-600',
      iconColor: 'text-white'
    },
    'Food & Beverage': { 
      icon: Coffee, 
      bgColor: 'from-amber-600 to-orange-600',
      iconColor: 'text-white'
    },
    'Education': { 
      icon: GraduationCap, 
      bgColor: 'from-blue-600 to-indigo-600',
      iconColor: 'text-white'
    },
    'Construction': { 
      icon: HardHat, 
      bgColor: 'from-yellow-600 to-orange-600',
      iconColor: 'text-white'
    },
    'E-commerce': { 
      icon: ShoppingCart, 
      bgColor: 'from-cyan-500 to-blue-500',
      iconColor: 'text-white'
    },
    'Transportation': { 
      icon: Truck, 
      bgColor: 'from-stone-600 to-stone-700',
      iconColor: 'text-white'
    },
    'Renewable Energy': { 
      icon: Zap, 
      bgColor: 'from-lime-500 to-green-500',
      iconColor: 'text-white'
    },
    'Fitness & Wellness': { 
      icon: Activity, 
      bgColor: 'from-pink-500 to-rose-500',
      iconColor: 'text-white'
    },
    'Retail': { 
      icon: Store, 
      bgColor: 'from-violet-500 to-purple-500',
      iconColor: 'text-white'
    },
    'Technology R&D': { 
      icon: Lightbulb, 
      bgColor: 'from-yellow-500 to-amber-500',
      iconColor: 'text-white'
    },
    'Management Consulting': { 
      icon: Target, 
      bgColor: 'from-teal-500 to-teal-600',
      iconColor: 'text-white'
    }
  };

  return industryMap[industry] || { 
    icon: Building, 
    bgColor: 'from-blue-500 to-purple-600',
    iconColor: 'text-white'
  };
};

// Industry-specific stock images and styling for case studies
const getCaseStudyImageAndIcon = (industry) => {
  const caseStudyMap = {
    'Software Development': {
      image: 'https://images.unsplash.com/photo-1582138825658-fb952c08b282?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGRldmVsb3BtZW50JTIwdGVhbSUyMGNvZGluZ3xlbnwxfHx8fDE3NTc3NzU4NzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      icon: Cloud,
      overlayColor: 'from-blue-900/80 to-indigo-900/80',
      iconBg: 'bg-blue-500'
    },
    'Manufacturing': {
      image: 'https://images.unsplash.com/photo-1757578097654-fdae0f7cf008?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW51ZmFjdHVyaW5nJTIwaW5kdXN0cmlhbCUyMGZhY2lsaXR5fGVufDF8fHx8MTc1NzgxOTE2Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      icon: Cog,
      overlayColor: 'from-gray-900/80 to-slate-900/80',
      iconBg: 'bg-gray-600'
    },
    'Health & Wellness': {
      image: 'https://images.unsplash.com/photo-1729105137317-6b4bb32c7b6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMGNvYWNoJTIwaGVhbHRoJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzU3ODE5MTY2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      icon: Heart,
      overlayColor: 'from-rose-900/80 to-pink-900/80',
      iconBg: 'bg-rose-500'
    }
  };

  return caseStudyMap[industry] || {
    image: null,
    icon: Building,
    overlayColor: 'from-blue-900/80 to-purple-900/80',
    iconBg: 'bg-blue-500'
  };
};

// Simple testimonial data without video complexity
const textTestimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    title: 'CEO, TechFlow Solutions',
    service: 'Growth+ Success Bundle',
    result: '$2.5M Revenue in 18 months',
    quote: 'Revenue Avenue transformed our startup from an idea to a $2.5M business. The systems and automation they built are incredible.',
    industry: 'Software Development',
    avatar: 'SC'
  },
  {
    id: 2,
    name: 'Marcus Rodriguez',
    title: 'Founder, Digital Marketing Agency',
    service: 'Scale+ Income Amplifier',
    result: '300% Revenue Growth',
    quote: 'The funnel optimization and upsell automation tripled our revenue. Our customer lifetime value went from $500 to $2,100.',
    industry: 'Digital Marketing',
    avatar: 'MR'
  },
  {
    id: 3,
    name: 'Jennifer Park',
    title: 'Business Empire Builder',
    service: 'Legacy EPIC Empire',
    result: 'Multi-Million Empire',
    quote: 'From single consultant to running a multi-million dollar empire with 7 income streams. The community impact gives everything meaning.',
    industry: 'Business Empire',
    avatar: 'JP'
  }
];

const testimonials = [
  {
    name: 'Alex Martinez',
    title: 'CEO, Digital Dynasty',
    service: 'Social Media Domination Suite',
    quote: 'Our social media presence went from 500 followers to 25K across all platforms in 4 months. Lead generation increased 400%.',
    rating: 5,
    result: '400% lead increase'
  },
  {
    name: 'Lisa Park',
    title: 'Owner, Smart Systems',
    service: 'Scale AI Business Boost',
    quote: 'AI agents handle 60% of our customer work now. We tripled productivity while reducing overhead costs.',
    rating: 5,
    result: '60% automation achieved'
  },
  {
    name: 'David Chen',
    title: 'Founder, Elite Consulting',
    service: 'Sales & Customer Mastery',
    quote: 'Conversion rate went from 15% to 65%. The scripts and frameworks are pure gold.',
    rating: 5,
    result: '65% conversion rate'
  },
  {
    name: 'Amanda Torres',
    title: 'CEO, Innovation Labs',
    service: 'Personal Financial Power',
    quote: 'Credit score jumped from 520 to 750 in 8 months. This investment paid for itself 10x over.',
    rating: 5,
    result: '230-point credit increase'
  },
  {
    name: 'Michael Rodriguez',
    title: 'Owner, Growth Partners',
    service: 'Profit Stream Pro',
    quote: 'Built 3 automated income streams generating $28K monthly. The MSI dashboard keeps everything organized.',
    rating: 5,
    result: '$28K monthly recurring'
  },
  {
    name: 'Rachel Kim',
    title: 'Founder, Future Ventures',
    service: 'SmartHire Workforce Suite',
    quote: 'Went from solo entrepreneur to leading an 8-person team in 6 months with 95% retention rate.',
    rating: 5,
    result: '95% team retention'
  }
];

// Simple Static Testimonial Card - No Video Complexity
const StaticTestimonialCard = ({ testimonial, index }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-bold">
              {testimonial.avatar}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold text-lg">{testimonial.name}</h3>
            <p className="text-gray-600 text-sm">{testimonial.title}</p>
            <Badge variant="outline" className="text-xs mt-1">
              {testimonial.industry}
            </Badge>
          </div>
        </div>
        
        <blockquote className="text-gray-700 italic mb-4">
          "{testimonial.quote}"
        </blockquote>
        
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-semibold text-sm">{testimonial.service}</p>
            </div>
            <div className="text-right">
              <div className="font-bold text-green-600">{testimonial.result}</div>
              <div className="text-xs text-gray-600">Achievement</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function SocialProof({ onBackClick, onServiceSelect, onBookingClick }) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 bg-white rounded-xl p-8 shadow-lg border border-gray-100">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: 'var(--ra-orange-dark)' }}>
            Success Stories & Social Proof
          </h1>
          <p className="text-xl max-w-4xl mx-auto mb-8" style={{ color: 'var(--ra-red-deeper)', opacity: 0.9 }}>
            See how Revenue Avenue has transformed thousands of businesses across every industry, generating over <span className="font-semibold" style={{ color: 'var(--ra-burgundy)' }}>$500M in client revenue</span>.
          </p>
        </div>

        {/* Success Metrics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
          {successMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className={`w-12 h-12 ${metric.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`w-6 h-6 ${metric.color}`} />
                    </div>
                    <div className={`text-2xl font-bold ${metric.color} mb-2`}>
                      {metric.value}
                    </div>
                    <p className="text-sm text-gray-600">{metric.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="testimonials" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="videos">Success Stories</TabsTrigger>
            <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
          </TabsList>

          {/* Testimonials Carousel */}
          <TabsContent value="testimonials">
            <div className="relative">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Client Testimonials</h2>
              
              <div className="relative overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="w-full flex-shrink-0 px-4">
                      <Card className="max-w-4xl mx-auto">
                        <CardContent className="pt-8">
                          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                            <div className="flex-shrink-0">
                              <Avatar className="w-24 h-24">
                                <AvatarFallback className="bg-blue-100 text-blue-600 text-xl font-bold">
                                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            
                            <div className="flex-1 text-center md:text-left">
                              <Quote className="w-8 h-8 text-blue-500 mb-4 mx-auto md:mx-0" />
                              <blockquote className="text-lg text-gray-700 mb-6 italic">
                                "{testimonial.quote}"
                              </blockquote>
                              
                              <div className="flex flex-col md:flex-row items-center justify-between">
                                <div>
                                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                  <div className="text-gray-600">{testimonial.title}</div>
                                  <div className="text-sm text-blue-600 font-medium">{testimonial.service}</div>
                                </div>
                                
                                <div className="mt-4 md:mt-0 text-center">
                                  <div className="flex items-center justify-center space-x-1 mb-2">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                  </div>
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                                    {testimonial.result}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-center items-center space-x-4 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentTestimonial(Math.max(0, currentTestimonial - 1))}
                  disabled={currentTestimonial === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentTestimonial(Math.min(testimonials.length - 1, currentTestimonial + 1))}
                  disabled={currentTestimonial === testimonials.length - 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Client Stories - Simple Static Implementation */}
          <TabsContent value="videos">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Client Success Stories</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Read real transformation stories from our clients across different industries
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {textTestimonials.map((testimonial, index) => (
                  <StaticTestimonialCard 
                    key={testimonial.id} 
                    testimonial={testimonial} 
                    index={index} 
                  />
                ))}
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to Write Your Success Story?</h3>
                <p className="text-gray-600 mb-6">
                  Join thousands of businesses that have transformed their operations with Revenue Avenue's proven systems.
                </p>
                <Button 
                  onClick={onBookingClick}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-semibold"
                >
                  Start Your Transformation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Detailed Case Studies */}
          <TabsContent value="case-studies">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900 text-center">Detailed Case Studies</h2>
              
              <div className="space-y-8">
                {detailedCaseStudies.map((study, index) => (
                  <motion.div
                    key={study.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden">
                      <div className="md:flex">
                        <div className="md:w-1/3">
                          {(() => {
                            const { image, icon: IconComponent, overlayColor, iconBg } = getCaseStudyImageAndIcon(study.industry);
                            
                            if (image) {
                              return (
                                <div className="h-64 md:h-full relative overflow-hidden">
                                  <img 
                                    src={image} 
                                    alt={`${study.industry} business environment`}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className={`absolute inset-0 bg-gradient-to-br ${overlayColor}`} />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center text-white p-6">
                                      <div className={`w-16 h-16 ${iconBg} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                                        <IconComponent className="w-8 h-8 text-white" />
                                      </div>
                                      <h3 className="text-xl font-bold mb-2">{study.company}</h3>
                                      <p className="text-white/90 font-medium bg-black/20 px-3 py-1 rounded-full text-sm">{study.industry}</p>
                                    </div>
                                  </div>
                                </div>
                              );
                            } else {
                              return (
                                <div className="h-64 md:h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                  <div className="text-center text-white p-6">
                                    <IconComponent className="w-16 h-16 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold">{study.company}</h3>
                                    <p className="text-blue-100">{study.industry}</p>
                                  </div>
                                </div>
                              );
                            }
                          })()}
                        </div>
                        
                        <div className="md:w-2/3 p-6">
                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            {study.tags.map(tag => (
                              <Badge key={tag} variant="outline">{tag}</Badge>
                            ))}
                          </div>
                          
                          <h3 className="text-2xl font-bold mb-4">{study.company} Success Story</h3>
                          
                          <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">The Challenge</h4>
                              <p className="text-gray-700 text-sm">{study.challenge}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Our Solution</h4>
                              <p className="text-gray-700 text-sm">{study.solution}</p>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <h4 className="font-semibold text-gray-900 mb-4">Key Results</h4>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>Revenue Growth:</span>
                                  <span className="font-semibold text-green-600">{study.results.revenue?.growth}</span>
                                </div>
                                {study.results.team && (
                                  <div className="flex justify-between">
                                    <span>Team Growth:</span>
                                    <span className="font-semibold text-blue-600">{study.results.team.growth}</span>
                                  </div>
                                )}
                                {study.results.funding && (
                                  <div className="flex justify-between">
                                    <span>Funding Secured:</span>
                                    <span className="font-semibold text-purple-600">{study.results.funding.total || study.results.funding.credit}</span>
                                  </div>
                                )}
                              </div>
                              <div className="space-y-2">
                                {study.results.automation && (
                                  <div className="flex justify-between">
                                    <span>Automation:</span>
                                    <span className="font-semibold text-orange-600">{study.results.automation}</span>
                                  </div>
                                )}
                                {study.results.streams && (
                                  <div className="flex justify-between">
                                    <span>Income Streams:</span>
                                    <span className="font-semibold text-cyan-600">{study.results.streams}</span>
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <span>Timeline:</span>
                                  <span className="font-semibold text-gray-600">{study.timeline}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 mb-4">
                            "{study.testimonial}"
                            <cite className="block mt-2 text-sm font-semibold text-gray-900">
                              — {study.founder}, {study.company}
                            </cite>
                          </blockquote>
                          
                          <div className="flex items-center justify-between">
                            <Badge className="bg-blue-100 text-blue-800">{study.service}</Badge>
                            <Button
                              onClick={onBookingClick}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Get Similar Results
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Company Logos */}
          <TabsContent value="companies">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Industry Leaders</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  From startups to established enterprises across 18+ industries, thousands of businesses trust Revenue Avenue to accelerate their growth.
                </p>
              </div>

              {/* Company Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {companyLogos.map((company, index) => {
                  const { icon: IconComponent, bgColor, iconColor } = getIndustryIconAndColors(company.industry);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6 text-center hover:shadow-lg transition-shadow bg-gray-50 hover:bg-white group">
                        <div className={`w-16 h-16 bg-gradient-to-br ${bgColor} rounded-lg flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                          <IconComponent className={`w-8 h-8 ${iconColor}`} />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">{company.name}</h3>
                        <p className="text-sm text-gray-600 group-hover:text-gray-500 transition-colors">{company.industry}</p>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA Section */}
              <div className="text-center pt-12">
                <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ color: 'var(--ra-orange-dark)' }}>
                    Ready to Join These Success Stories?
                  </h3>
                  <p className="text-lg mb-6" style={{ color: 'var(--ra-red-deeper)', opacity: 0.9 }}>
                    Book your <span className="font-bold" style={{ color: 'var(--ra-burgundy)' }}>FREE strategy call</span> and discover how we can transform your business like we did for these industry leaders.
                  </p>
                  <Button
                    onClick={onBookingClick}
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Book Your FREE Strategy Call
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}