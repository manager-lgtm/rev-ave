import React, { useState, useMemo } from 'react';
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Search, HelpCircle, Calendar, MessageCircle, Phone, Mail, ChevronRight, Star, Clock, Tag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const faqCategories = [
  { id: 'all', label: 'All Questions', count: 45 },
  { id: 'services', label: 'Services & Pricing', count: 12 },
  { id: 'process', label: 'Process & Timeline', count: 8 },
  { id: 'payment', label: 'Payment & Billing', count: 6 },
  { id: 'results', label: 'Results & Guarantees', count: 7 },
  { id: 'support', label: 'Support & Communication', count: 5 },
  { id: 'technical', label: 'Technical & Setup', count: 4 },
  { id: 'custom', label: 'Custom Solutions', count: 3 }
];

const faqData = [
  {
    id: 1,
    question: 'How quickly can I see results from your services?',
    answer: 'Results vary by service, but most clients see initial improvements within 30-60 days. Our Side Hustle Accelerator can generate first revenue in 30 days, while comprehensive transformations like our Growth+ Bundle typically show significant results within 90-120 days. We provide detailed timelines for each service during consultation.',
    category: 'results',
    tags: ['timeline', 'results', 'expectations'],
    popularity: 5,
    serviceSpecific: ['side-hustle-accelerator', 'growth-success-bundle'],
    lastUpdated: '2024-01-15'
  },
  {
    id: 2,
    question: 'What is your success rate and do you offer guarantees?',
    answer: 'We maintain a 98% client success rate across all services. We offer specific guarantees depending on the service - for example, our Side Hustle Accelerator guarantees first revenue within 90 days, and our Business Financial Power service guarantees business credit establishment. All guarantees are detailed in our service agreements.',
    category: 'results',
    tags: ['guarantee', 'success-rate', 'refund'],
    popularity: 5,
    serviceSpecific: ['all'],
    lastUpdated: '2024-01-20'
  },
  {
    id: 3,
    question: 'How much do your services cost and are payment plans available?',
    answer: 'Our services range from $997 to $50,000+ depending on scope and customization. We offer flexible payment plans for all services, including monthly installments and milestone-based payments. Bundle discounts up to 20% are available when combining multiple services. Schedule a consultation for detailed pricing.',
    category: 'payment',
    tags: ['pricing', 'payment-plans', 'cost'],
    popularity: 5,
    serviceSpecific: ['all'],
    lastUpdated: '2024-01-18'
  },
  {
    id: 4,
    question: 'What makes Revenue Avenue different from other business consultants?',
    answer: 'Unlike traditional consultants, we provide complete done-for-you systems, not just advice. We handle legal setup, build your systems, secure funding, implement automation, and even provide ongoing support. Our clients get tangible deliverables and measurable results, backed by our 98% success rate.',
    category: 'services',
    tags: ['differentiation', 'value-proposition', 'done-for-you'],
    popularity: 4,
    serviceSpecific: ['all'],
    lastUpdated: '2024-01-12'
  },
  {
    id: 5,
    question: 'Do you work with businesses in my industry?',
    answer: 'Yes! We\'ve successfully worked with businesses across 50+ industries including technology, manufacturing, healthcare, e-commerce, consulting, coaching, real estate, and more. Our frameworks are industry-agnostic and we customize our approach based on your specific market and business model.',
    category: 'services',
    tags: ['industry', 'customization', 'experience'],
    popularity: 4,
    serviceSpecific: ['all'],
    lastUpdated: '2024-01-10'
  },
  {
    id: 6,
    question: 'What is the typical timeline for completing a service?',
    answer: 'Timelines vary by service complexity: Quick services like Income Igniter take 30-90 days, comprehensive solutions like Growth+ Bundle take 180-210 days, and our Legacy EPIC Empire program runs 9-12 months. Each service has detailed milestone schedules provided during onboarding.',
    category: 'process',
    tags: ['timeline', 'duration', 'milestones'],
    popularity: 4,
    serviceSpecific: ['income-igniter', 'growth-success-bundle', 'legacy-epic-empire'],
    lastUpdated: '2024-01-14'
  },
  {
    id: 7,
    question: 'Do I need to have an existing business to work with you?',
    answer: 'Not at all! We work with entrepreneurs at every stage - from idea to multi-million dollar enterprises. Our Side Hustle Accelerator and Income Igniter services are perfect for starting from scratch, while our scaling services help established businesses grow. We meet you where you are.',
    category: 'services',
    tags: ['startup', 'existing-business', 'all-stages'],
    popularity: 4,
    serviceSpecific: ['side-hustle-accelerator', 'income-igniter'],
    lastUpdated: '2024-01-16'
  },
  {
    id: 8,
    question: 'What kind of support do you provide during the process?',
    answer: 'You get dedicated support throughout your entire journey including: weekly check-ins with your strategist, 24/7 email support, access to our client portal with resources and progress tracking, group coaching calls, and emergency support for urgent issues. Support level varies by service tier.',
    category: 'support',
    tags: ['support', 'communication', 'check-ins'],
    popularity: 4,
    serviceSpecific: ['all'],
    lastUpdated: '2024-01-13'
  },
  {
    id: 9,
    question: 'Can you help me get business funding or credit?',
    answer: 'Absolutely! Our Business Financial Power service specializes in securing $500K+ in business credit and funding. We help with business credit building, EIN-only funding strategies, vendor credit relationships, and grant applications. Our clients have secured over $100M in funding to date.',
    category: 'services',
    tags: ['funding', 'credit', 'loans'],
    popularity: 4,
    serviceSpecific: ['business-financial-power', 'impact-visibility-amplifier'],
    lastUpdated: '2024-01-17'
  },
  {
    id: 10,
    question: 'What if I\'m not satisfied with the results?',
    answer: 'We stand behind our work with service-specific guarantees and a satisfaction commitment. If you follow our proven process and don\'t achieve the guaranteed results, we\'ll work with you until you do or provide a refund per our terms. Our 98% success rate speaks to our commitment to client success.',
    category: 'results',
    tags: ['satisfaction', 'refund', 'commitment'],
    popularity: 3,
    serviceSpecific: ['all'],
    lastUpdated: '2024-01-11'
  },
  {
    id: 11,
    question: 'Do you provide the legal documents and business setup?',
    answer: 'Yes! Our services include complete legal business formation - LLC/Corporation setup, EIN registration, operating agreements, business banking setup, compliance documentation, and all necessary filings. We handle the paperwork so you can focus on growing your business.',
    category: 'technical',
    tags: ['legal', 'business-formation', 'documentation'],
    popularity: 4,
    serviceSpecific: ['core-foundation', 'rapid-revenue-starter', 'income-igniter'],
    lastUpdated: '2024-01-19'
  },
  {
    id: 12,
    question: 'How do you help with marketing and lead generation?',
    answer: 'Our marketing approach includes: professional website and funnel creation, SEO optimization, social media setup and content creation, email marketing automation, paid advertising setup, and lead nurturing systems. Our Social Media Domination service specifically focuses on multi-platform marketing mastery.',
    category: 'services',
    tags: ['marketing', 'lead-generation', 'digital-marketing'],
    popularity: 4,
    serviceSpecific: ['social-media-domination', 'scale-income-amplifier', 'impact-visibility-amplifier'],
    lastUpdated: '2024-01-21'
  },
  {
    id: 13,
    question: 'Can you help me build and manage a team?',
    answer: 'Our SmartHire Workforce Excellence Suite specializes in team building with automated hiring systems, onboarding processes, performance management, and HR compliance. We help you go from solo entrepreneur to team leader with 90%+ retention rates.',
    category: 'services',
    tags: ['hiring', 'team-building', 'hr'],
    popularity: 3,
    serviceSpecific: ['smarthire-suite', 'growth-success-bundle'],
    lastUpdated: '2024-01-22'
  },
  {
    id: 14,
    question: 'What automation tools and AI do you implement?',
    answer: 'We implement cutting-edge automation including: AI chatbots and agents, CRM automation, Zapier workflows, automated email sequences, social media scheduling, invoicing and payment automation, and custom integrations. Our Scale AI Business Boost service focuses specifically on AI implementation.',
    category: 'technical',
    tags: ['automation', 'ai', 'technology'],
    popularity: 4,
    serviceSpecific: ['scale-ai-boost', 'growth-success-bundle', 'scale-income-amplifier'],
    lastUpdated: '2024-01-23'
  },
  {
    id: 15,
    question: 'How do I know which service is right for my business?',
    answer: 'We offer a free Service Recommender quiz on our website, plus free strategy consultations where we assess your current situation, goals, and budget to recommend the perfect service combination. Our Bundle packages also provide pre-configured solutions for common business stages.',
    category: 'services',
    tags: ['service-selection', 'consultation', 'recommendations'],
    popularity: 5,
    serviceSpecific: ['all'],
    lastUpdated: '2024-01-24'
  }
];

const popularSearches = [
  'pricing', 'timeline', 'guarantees', 'funding', 'automation', 'team building', 'marketing', 'legal setup'
];

const quickAnswers = [
  { question: 'How much does it cost?', answer: 'Services range from $997 to $50,000+ with payment plans available.' },
  { question: 'How long does it take?', answer: 'Timeline varies from 30 days to 12 months depending on service complexity.' },
  { question: 'Do you guarantee results?', answer: 'Yes, we offer specific guarantees with a 98% client success rate.' },
  { question: 'Do you work in my industry?', answer: 'We work across 50+ industries with customized approaches.' }
];

export function FAQSearch({ onBackClick, onServiceSelect, onBookingClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredFAQs = useMemo(() => {
    let filtered = faqData;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(searchLower) ||
        faq.answer.toLowerCase().includes(searchLower) ||
        faq.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort results
    switch (sortBy) {
      case 'popularity':
        filtered.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'recent':
        filtered.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.question.localeCompare(b.question));
        break;
    }

    return filtered;
  }, [searchTerm, selectedCategory, sortBy]);

  const searchSuggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const suggestions = faqData
      .filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .slice(0, 5)
      .map(faq => faq.question);
    
    return suggestions;
  }, [searchTerm]);

  const handleSearchSelect = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  const handleQuickSearch = (term) => {
    setSearchTerm(term);
    setShowSuggestions(false);
  };

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
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-[var(--ra-cta-wealth-secondary)] to-[var(--ra-cta-wealth-highlight)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <HelpCircle className="w-10 h-10 text-[var(--ra-cta-wealth-primary)]" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: 'var(--ra-orange-deeper)' }}>
              FAQ & Support Center
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-8" style={{ color: 'var(--ra-rust)', opacity: 0.9 }}>
              Find answers to common questions about our services, process, and results. Can't find what you're looking for? We're here to help.
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
        <div className="max-w-6xl mx-auto">
          {/* Search Section */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search FAQs, services, or topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="pl-10 text-lg py-6"
                  />
                </div>

                {/* Search Suggestions */}
                <AnimatePresence>
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg"
                    >
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearchSelect(suggestion)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center space-x-2">
                            <Search className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{suggestion}</span>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Popular Searches */}
              {!searchTerm && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-3">Popular searches:</p>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleQuickSearch(term)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Answers */}
              {!searchTerm && (
                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  {quickAnswers.map((qa, index) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">{qa.question}</h4>
                      <p className="text-sm text-blue-700">{qa.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Filters and Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex flex-wrap items-center gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {faqCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.label} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Most Popular</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="alphabetical">A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredFAQs.length} of {faqData.length} questions
            </div>
          </div>

          {/* FAQ Results */}
          <div className="space-y-6">
            {filteredFAQs.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search terms or browse by category.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button onClick={() => setSearchTerm('')} variant="outline">
                      Clear Search
                    </Button>
                    <Button onClick={onBookingClick} className="bg-blue-600 hover:bg-blue-700">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Ask Our Team
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <AccordionItem value={faq.id.toString()} className="border rounded-lg px-6">
                      <AccordionTrigger className="text-left hover:no-underline py-6">
                        <div className="flex items-start justify-between w-full pr-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4" />
                                <span>Popularity: {faq.popularity}/5</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>Updated: {new Date(faq.lastUpdated).toLocaleDateString()}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {faqCategories.find(cat => cat.id === faq.category)?.label}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6">
                        <div className="prose prose-sm max-w-none">
                          <p className="text-gray-700 leading-relaxed mb-4">{faq.answer}</p>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {faq.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          {/* Related Services */}
                          {faq.serviceSpecific.length > 0 && faq.serviceSpecific[0] !== 'all' && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-gray-900 mb-2">Related Services:</h4>
                              <div className="flex flex-wrap gap-2">
                                {faq.serviceSpecific.map(serviceId => (
                                  <Button
                                    key={serviceId}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onServiceSelect(serviceId)}
                                    className="text-xs"
                                  >
                                    View Service
                                    <ChevronRight className="w-3 h-3 ml-1" />
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            )}
          </div>
        </div>
      </div>

      {/* Contact Support Section with Premium Wealth Theme */}
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
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--ra-red-dark)' }}>Still Need Help?</h2>
            <p className="text-xl mb-8" style={{ color: 'var(--ra-copper)', opacity: 0.9 }}>
              Our expert team is standing by to answer your questions and help you choose the perfect solution.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--ra-cta-wealth-secondary)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-[var(--ra-cta-wealth-secondary)]" />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--ra-orange-dark)' }}>Schedule a Call</h3>
              <p className="mb-4" style={{ color: 'var(--ra-rust)', opacity: 0.8 }}>Free 30-minute strategy session</p>
              <Button 
                onClick={onBookingClick}
                variant="outline" 
                className="border-[var(--ra-cta-wealth-secondary)] text-[var(--ra-cta-wealth-secondary)] hover:bg-[var(--ra-cta-wealth-secondary)] hover:text-[var(--ra-cta-wealth-primary)]"
              >
                Book Now
              </Button>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--ra-cta-wealth-secondary)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-[var(--ra-cta-wealth-secondary)]" />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--ra-orange-dark)' }}>Live Chat</h3>
              <p className="mb-4" style={{ color: 'var(--ra-rust)', opacity: 0.8 }}>Get instant answers 24/7</p>
              <Button 
                variant="outline" 
                className="border-[var(--ra-cta-wealth-secondary)] text-[var(--ra-cta-wealth-secondary)] hover:bg-[var(--ra-cta-wealth-secondary)] hover:text-[var(--ra-cta-wealth-primary)]"
              >
                Start Chat
              </Button>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--ra-cta-wealth-secondary)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-[var(--ra-cta-wealth-secondary)]" />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--ra-orange-dark)' }}>Email Support</h3>
              <p className="mb-4" style={{ color: 'var(--ra-rust)', opacity: 0.8 }}>Detailed responses within 24h</p>
              <Button 
                variant="outline" 
                className="border-[var(--ra-cta-wealth-secondary)] text-[var(--ra-cta-wealth-secondary)] hover:bg-[var(--ra-cta-wealth-secondary)] hover:text-[var(--ra-cta-wealth-primary)]"
              >
                Send Email
              </Button>
            </div>
          </div>
          
          <div className="pt-6 border-t border-[var(--ra-cta-wealth-secondary)]/20 text-center">
            <p style={{ color: 'var(--ra-orange-dark)', opacity: 0.9 }}>
              Average response time: <span className="font-semibold" style={{ color: 'var(--ra-red-deeper)' }}>Under 2 hours</span> • 
              Customer satisfaction: <span className="font-semibold" style={{ color: 'var(--ra-red-deeper)' }}>4.9/5</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}