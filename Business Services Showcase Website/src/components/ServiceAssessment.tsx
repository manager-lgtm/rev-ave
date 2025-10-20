import React, { useState, useMemo } from 'react';
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Calendar, ArrowRight, ArrowLeft, CheckCircle, Target, Zap, Award, TrendingUp, Users, DollarSign, Clock, Brain, Lightbulb, Star, Package } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const assessmentQuestions = [
  {
    id: 'business-stage',
    title: 'What best describes your current business situation?',
    type: 'single',
    options: [
      { value: 'idea', label: 'I have a business idea but haven\'t started yet', icon: '💡' },
      { value: 'side-hustle', label: 'I have a side hustle earning some income', icon: '⚡' },
      { value: 'startup', label: 'I have a new business (0-2 years)', icon: '🚀' },
      { value: 'established', label: 'I have an established business (2+ years)', icon: '🏢' },
      { value: 'scaling', label: 'I\'m ready to scale significantly', icon: '📈' },
      { value: 'empire', label: 'I want to build a business empire', icon: '👑' }
    ]
  },
  {
    id: 'primary-goals',
    title: 'What are your primary business goals? (Select all that apply)',
    type: 'multiple',
    options: [
      { value: 'validate-idea', label: 'Validate my business idea', icon: '🎯' },
      { value: 'generate-revenue', label: 'Start generating revenue quickly', icon: '💰' },
      { value: 'legal-structure', label: 'Set up proper legal structure', icon: '📋' },
      { value: 'scale-revenue', label: 'Scale existing revenue streams', icon: '📊' },
      { value: 'build-team', label: 'Build and manage a team', icon: '👥' },
      { value: 'automate-systems', label: 'Automate business processes', icon: '🤖' },
      { value: 'get-funding', label: 'Access business funding', icon: '🏦' },
      { value: 'create-impact', label: 'Create lasting impact and legacy', icon: '🌟' }
    ]
  },
  {
    id: 'biggest-challenges',
    title: 'What are your biggest challenges right now? (Select up to 3)',
    type: 'multiple',
    maxSelections: 3,
    options: [
      { value: 'no-clarity', label: 'Lack of clarity on next steps', icon: '🤔' },
      { value: 'no-time', label: 'Not enough time to work on business', icon: '⏰' },
      { value: 'no-customers', label: 'Difficulty finding customers', icon: '🔍' },
      { value: 'inconsistent-revenue', label: 'Inconsistent revenue streams', icon: '📉' },
      { value: 'overwhelmed', label: 'Feeling overwhelmed by complexity', icon: '😵' },
      { value: 'no-systems', label: 'Lack of proper systems and processes', icon: '⚙️' },
      { value: 'cash-flow', label: 'Cash flow management issues', icon: '💸' },
      { value: 'competition', label: 'Standing out from competition', icon: '🥊' }
    ]
  },
  {
    id: 'timeline',
    title: 'What\'s your preferred timeline for seeing results?',
    type: 'single',
    options: [
      { value: 'immediate', label: '30-60 days (I need results fast)', icon: '⚡' },
      { value: 'short-term', label: '3-6 months (Quick wins with solid foundation)', icon: '🎯' },
      { value: 'medium-term', label: '6-12 months (Comprehensive transformation)', icon: '🚀' },
      { value: 'long-term', label: '1-2 years (Empire building approach)', icon: '🏗️' }
    ]
  },
  {
    id: 'investment-mindset',
    title: 'How do you view business investment?',
    type: 'single',
    options: [
      { value: 'cost-focused', label: 'I need to keep costs as low as possible', icon: '💰' },
      { value: 'value-focused', label: 'I focus on value and ROI over cost', icon: '📊' },
      { value: 'growth-focused', label: 'I invest heavily for accelerated growth', icon: '🚀' },
      { value: 'wealth-focused', label: 'I view it as wealth-building investment', icon: '💎' }
    ]
  },
  {
    id: 'support-preference',
    title: 'What type of support do you prefer?',
    type: 'single',
    options: [
      { value: 'diy', label: 'Give me the tools, I\'ll do it myself', icon: '🔧' },
      { value: 'guided', label: 'Guide me through the process step-by-step', icon: '🗺️' },
      { value: 'done-with-you', label: 'Work together to implement solutions', icon: '🤝' },
      { value: 'done-for-you', label: 'Handle everything for me', icon: '✨' }
    ]
  }
];

const serviceRecommendations = {
  // Side Hustle/Early Stage Recommendations
  'side-hustle-accelerator': {
    title: 'Side Hustle Accelerator',
    match: 95,
    description: 'Perfect for validating ideas and building foundation while keeping your day job',
    keyBenefits: ['Validate your idea with real market feedback', 'Legal structure setup', 'Step-by-step launch guidance'],
    idealFor: ['idea', 'side-hustle'],
    timeline: ['immediate', 'short-term'],
    investment: ['cost-focused', 'value-focused']
  },
  
  // Quick Launch Recommendations
  'income-igniter-package': {
    title: 'Income Igniter Package',
    match: 90,
    description: 'Fast-track business setup with immediate revenue generation focus',
    keyBenefits: ['30-45 day launch timeline', 'Complete monetization strategy', 'Content and marketing system'],
    idealFor: ['startup', 'side-hustle'],
    timeline: ['immediate', 'short-term'],
    investment: ['value-focused', 'growth-focused']
  },
  
  // Foundation Building
  'business-foundation-setup': {
    title: 'Business Foundation Setup',
    match: 88,
    description: 'Comprehensive business setup with professional systems and processes',
    keyBenefits: ['Complete legal and operational setup', 'Professional brand and systems', 'Financial tracking systems'],
    idealFor: ['startup', 'established'],
    timeline: ['short-term', 'medium-term'],
    investment: ['value-focused', 'growth-focused']
  },
  
  // Scaling Solutions
  'rapid-revenue-starter': {
    title: 'Rapid Revenue Starter',
    match: 85,
    description: 'Systematic revenue scaling with automation and team building',
    keyBenefits: ['Pre-funded structure setup', 'Automated revenue systems', 'Scaling framework'],
    idealFor: ['established', 'scaling'],
    timeline: ['short-term', 'medium-term'],
    investment: ['growth-focused', 'wealth-focused']
  },
  
  // Empire Building
  'legacy-epic-empire': {
    title: 'Legacy EPIC Empire',
    match: 92,
    description: 'Ultimate wealth-building system with legacy impact creation',
    keyBenefits: ['Multi-million revenue potential', 'Lasting community impact', 'Thought leadership platform'],
    idealFor: ['scaling', 'empire'],
    timeline: ['medium-term', 'long-term'],
    investment: ['wealth-focused', 'growth-focused']
  }
};

export function ServiceAssessment({ onBackClick, onServiceSelect, onBookingClick, onViewBundles }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = assessmentQuestions[currentStep];
  const totalSteps = assessmentQuestions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleAnswer = (questionId, value) => {
    if (currentQuestion.type === 'multiple') {
      const currentAnswers = answers[questionId] || [];
      const maxSelections = currentQuestion.maxSelections || Infinity;
      
      let newAnswers;
      if (currentAnswers.includes(value)) {
        newAnswers = currentAnswers.filter(v => v !== value);
      } else if (currentAnswers.length < maxSelections) {
        newAnswers = [...currentAnswers, value];
      } else {
        return; // Max selections reached
      }
      
      setAnswers(prev => ({
        ...prev,
        [questionId]: newAnswers
      }));
    } else {
      setAnswers(prev => ({
        ...prev,
        [questionId]: value
      }));
    }
  };

  const canProceed = () => {
    const answer = answers[currentQuestion.id];
    if (currentQuestion.type === 'multiple') {
      return answer && answer.length > 0;
    }
    return !!answer;
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getRecommendations = useMemo(() => {
    if (!isComplete) return [];

    const businessStage = answers['business-stage'];
    const timeline = answers['timeline'];
    const investment = answers['investment-mindset'];
    const goals = answers['primary-goals'] || [];
    const challenges = answers['biggest-challenges'] || [];

    // Score each service based on answers
    const scoredServices = Object.entries(serviceRecommendations).map(([id, service]) => {
      let score = service.match;

      // Business stage matching
      if (service.idealFor.includes(businessStage)) {
        score += 15;
      }

      // Timeline matching
      if (service.timeline.includes(timeline)) {
        score += 10;
      }

      // Investment mindset matching
      if (service.investment.includes(investment)) {
        score += 10;
      }

      // Goal alignment
      const goalMatches = goals.filter(goal => {
        if (id === 'side-hustle-accelerator' && ['validate-idea', 'generate-revenue', 'legal-structure'].includes(goal)) return true;
        if (id === 'income-igniter-package' && ['generate-revenue', 'scale-revenue'].includes(goal)) return true;
        if (id === 'business-foundation-setup' && ['legal-structure', 'automate-systems'].includes(goal)) return true;
        if (id === 'rapid-revenue-starter' && ['scale-revenue', 'automate-systems', 'build-team'].includes(goal)) return true;
        if (id === 'legacy-epic-empire' && ['create-impact', 'get-funding', 'scale-revenue'].includes(goal)) return true;
        return false;
      });
      score += goalMatches.length * 5;

      return {
        id,
        ...service,
        finalScore: Math.min(score, 100)
      };
    });

    // Return top 3 recommendations
    return scoredServices
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, 3);
  }, [answers, isComplete]);

  const resetAssessment = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
    setIsComplete(false);
  };

  if (showResults) {
    return (
      <div className="min-h-screen">
        {/* Results Hero Section */}
        <section className="ra-cta-wealth py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div 
              className="absolute top-0 left-0 w-full h-full" 
              style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, rgba(253, 203, 110, 0.3) 0%, transparent 50%),
                                 radial-gradient(circle at 75% 75%, rgba(255, 234, 167, 0.3) 0%, transparent 50%)`
              }}
            />
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center space-x-3 mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl sm:text-5xl font-black mb-2" style={{ color: 'var(--ra-red-crimson)' }}>
                    Your Personalized Business Roadmap
                  </h1>
                  <p className="text-xl opacity-90" style={{ color: 'var(--ra-orange-deeper)' }}>
                    Based on your assessment, here are your top service recommendations
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                <Button 
                  onClick={onBookingClick}
                  className="ra-btn-primary-modern"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Get Your Free Strategy Session
                </Button>
                <Button 
                  onClick={resetAssessment}
                  variant="outline"
                  className="border-2 border-[var(--ra-copper)] text-[var(--ra-copper)] hover:bg-[var(--ra-copper)] hover:text-white"
                >
                  Retake Assessment
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Recommendations Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-8">
              {getRecommendations.map((recommendation, index) => (
                <motion.div
                  key={recommendation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Card className={`relative overflow-hidden hover:shadow-xl transition-all duration-300 ${
                    index === 0 ? 'border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50' : ''
                  }`}>
                    {index === 0 && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-green-500 text-white font-bold">
                          <Star className="w-4 h-4 mr-1" />
                          Best Match
                        </Badge>
                      </div>
                    )}

                    <div className="grid lg:grid-cols-3 gap-8 p-8">
                      {/* Service Info */}
                      <div className="lg:col-span-2">
                        <div className="flex items-center space-x-4 mb-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                            <Target className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                              {recommendation.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="bg-green-100 text-green-800">
                                {recommendation.finalScore}% Match
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                          {recommendation.description}
                        </p>

                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900">Key Benefits:</h4>
                          {recommendation.keyBenefits.map((benefit, i) => (
                            <div key={i} className="flex items-start space-x-3">
                              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col justify-center space-y-4">
                        <div className="text-center p-6 bg-white rounded-lg border-2 border-gray-200">
                          <div className="text-2xl font-bold text-green-600 mb-2">
                            Perfect Fit
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            This service aligns perfectly with your goals and timeline
                          </p>
                          <div className="space-y-3">
                            <Button
                              onClick={() => onServiceSelect(recommendation.id)}
                              className="w-full bg-green-600 hover:bg-green-700 text-white"
                            >
                              <ArrowRight className="w-4 h-4 mr-2" />
                              Learn More
                            </Button>
                            <Button
                              onClick={onBookingClick}
                              variant="outline"
                              className="w-full"
                            >
                              <Calendar className="w-4 h-4 mr-2" />
                              Discuss This Option
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Additional Actions */}
            <div className="mt-16 text-center">
              <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Want to Explore More Options?
                </h3>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  These recommendations are based on your assessment. We also offer service bundles 
                  and can create custom solutions tailored to your unique situation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={onViewBundles}
                    variant="outline"
                    className="px-8"
                  >
                    <Package className="w-5 h-5 mr-2" />
                    View Service Bundles
                  </Button>
                  <Button 
                    onClick={onBookingClick}
                    className="ra-btn-primary-modern px-8"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Get Custom Consultation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Assessment Hero */}
      <section className="ra-hero-modern py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-black mb-2" style={{ color: 'var(--ra-burgundy)' }}>
                  Find Your Perfect Service Match
                </h1>
                <p className="text-xl" style={{ color: 'var(--ra-orange-dark)' }}>
                  Get personalized recommendations based on your business goals and situation
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="ra-trust-modern">
                <Clock className="w-4 h-4 mr-2" />
                2 Minutes
              </div>
              <div className="ra-trust-modern">
                <Target className="w-4 h-4 mr-2" />
                Personalized
              </div>
              <div className="ra-trust-modern">
                <Lightbulb className="w-4 h-4 mr-2" />
                Actionable
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Assessment Progress */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-600">
                Question {currentStep + 1} of {totalSteps}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-2 border-gray-200">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold text-gray-900 leading-tight">
                    {currentQuestion.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentQuestion.type === 'single' ? (
                    <RadioGroup
                      value={answers[currentQuestion.id] || ''}
                      onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
                      className="space-y-4"
                    >
                      {currentQuestion.options.map((option) => (
                        <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Label
                            htmlFor={option.value}
                            className="flex items-center space-x-3 cursor-pointer flex-1"
                          >
                            <span className="text-2xl">{option.icon}</span>
                            <span className="text-lg font-medium">{option.label}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <div className="space-y-4">
                      {currentQuestion.maxSelections && (
                        <p className="text-sm text-gray-600 mb-4">
                          Select up to {currentQuestion.maxSelections} options
                        </p>
                      )}
                      {currentQuestion.options.map((option) => {
                        const isSelected = (answers[currentQuestion.id] || []).includes(option.value);
                        const selectedCount = (answers[currentQuestion.id] || []).length;
                        const maxReached = currentQuestion.maxSelections && selectedCount >= currentQuestion.maxSelections;
                        
                        return (
                          <div 
                            key={option.value} 
                            className={`flex items-center space-x-3 p-4 rounded-lg transition-colors cursor-pointer ${
                              isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                            } ${maxReached && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => {
                              if (!maxReached || isSelected) {
                                handleAnswer(currentQuestion.id, option.value);
                              }
                            }}
                          >
                            <Checkbox
                              checked={isSelected}
                              readOnly
                              className="pointer-events-none"
                            />
                            <div className="flex items-center space-x-3 flex-1">
                              <span className="text-2xl">{option.icon}</span>
                              <span className="text-lg font-medium">{option.label}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                    <Button
                      onClick={handlePrevious}
                      variant="outline"
                      disabled={currentStep === 0}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>

                    <Button
                      onClick={handleNext}
                      disabled={!canProceed()}
                      className="ra-btn-primary-modern"
                    >
                      {currentStep === totalSteps - 1 ? 'Get My Recommendations' : 'Next Question'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}