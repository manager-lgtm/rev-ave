import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { CheckCircle, ArrowRight, Calendar, Eye, Brain, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const questions = [
  {
    id: 'stage',
    title: 'What stage is your business currently in?',
    type: 'single',
    options: [
      { value: 'idea', label: 'Idea stage - I have a concept but haven\'t started yet', weight: { 'side-hustle-accelerator': 3, 'income-igniter': 2, 'core-foundation': 1 } },
      { value: 'startup', label: 'Early startup - I\'ve started but need structure', weight: { 'income-igniter': 3, 'core-foundation': 3, 'rapid-revenue-starter': 2 } },
      { value: 'revenue', label: 'Generating revenue - Making money but want to grow', weight: { 'scale-income-amplifier': 3, 'scale-ai-boost': 2, 'growth-success-bundle': 2 } },
      { value: 'scaling', label: 'Scaling - Ready for major growth and systems', weight: { 'growth-success-bundle': 3, 'smarthire-suite': 2, 'profit-stream-pro': 2 } },
      { value: 'established', label: 'Established - Building empire and legacy', weight: { 'legacy-epic-empire': 3, 'business-financial-power': 2, 'profit-stream-pro': 2 } }
    ]
  },
  {
    id: 'revenue',
    title: 'What\'s your current monthly revenue?',
    type: 'single',
    options: [
      { value: '0', label: '$0 - Pre-revenue', weight: { 'side-hustle-accelerator': 3, 'income-igniter': 3, 'core-foundation': 2 } },
      { value: '1-5k', label: '$1 - $5,000', weight: { 'income-igniter': 2, 'rapid-revenue-starter': 3, 'scale-income-amplifier': 2 } },
      { value: '5-15k', label: '$5,000 - $15,000', weight: { 'scale-income-amplifier': 3, 'scale-ai-boost': 2, 'growth-success-bundle': 2 } },
      { value: '15-50k', label: '$15,000 - $50,000', weight: { 'growth-success-bundle': 3, 'smarthire-suite': 3, 'profit-stream-pro': 2 } },
      { value: '50k+', label: '$50,000+', weight: { 'legacy-epic-empire': 3, 'business-financial-power': 3, 'profit-stream-pro': 3 } }
    ]
  },
  {
    id: 'priority',
    title: 'What\'s your biggest priority right now?',
    type: 'single',
    options: [
      { value: 'start', label: 'Getting started and launching quickly', weight: { 'side-hustle-accelerator': 3, 'income-igniter': 3 } },
      { value: 'structure', label: 'Building proper business structure', weight: { 'core-foundation': 3, 'rapid-revenue-starter': 2 } },
      { value: 'revenue', label: 'Increasing revenue and optimizing offers', weight: { 'scale-income-amplifier': 3, 'rapid-revenue-starter': 2 } },
      { value: 'automation', label: 'Automating processes and using AI', weight: { 'scale-ai-boost': 3, 'growth-success-bundle': 2 } },
      { value: 'team', label: 'Building and managing a team', weight: { 'smarthire-suite': 3, 'growth-success-bundle': 2 } },
      { value: 'funding', label: 'Access to funding and credit', weight: { 'business-financial-power': 3, 'impact-visibility-amplifier': 2 } },
      { value: 'legacy', label: 'Building a lasting business empire', weight: { 'legacy-epic-empire': 3, 'profit-stream-pro': 2 } }
    ]
  },
  {
    id: 'timeline',
    title: 'What\'s your preferred timeline for results?',
    type: 'single',
    options: [
      { value: '30-60', label: '30-60 days - I need results fast', weight: { 'side-hustle-accelerator': 2, 'income-igniter': 3, 'scale-income-amplifier': 3 } },
      { value: '90-120', label: '90-120 days - Steady progress is fine', weight: { 'core-foundation': 3, 'rapid-revenue-starter': 3, 'scale-ai-boost': 2 } },
      { value: '6-months', label: '6 months - I want comprehensive transformation', weight: { 'growth-success-bundle': 3, 'smarthire-suite': 2, 'impact-visibility-amplifier': 2 } },
      { value: '1-year', label: '1+ years - I\'m building for the long term', weight: { 'legacy-epic-empire': 3, 'business-financial-power': 2, 'profit-stream-pro': 2 } }
    ]
  },
  {
    id: 'budget',
    title: 'What\'s your investment budget?',
    type: 'single',
    options: [
      { value: 'under-2k', label: 'Under $2,000', weight: { 'side-hustle-accelerator': 3, 'income-igniter': 3, 'personal-financial-power': 2 } },
      { value: '2-5k', label: '$2,000 - $5,000', weight: { 'core-foundation': 3, 'rapid-revenue-starter': 3, 'scale-income-amplifier': 2, 'scale-ai-boost': 2, 'social-media-domination': 2, 'sales-customer-mastery': 2 } },
      { value: '5-10k', label: '$5,000 - $10,000', weight: { 'growth-success-bundle': 3, 'smarthire-suite': 2, 'impact-visibility-amplifier': 2, 'profit-stream-pro': 2, 'business-financial-power': 2 } },
      { value: '10k+', label: '$10,000+', weight: { 'legacy-epic-empire': 3, 'business-financial-power': 3, 'profit-stream-pro': 3 } }
    ]
  },
  {
    id: 'challenges',
    title: 'What challenges are you facing? (Select all that apply)',
    type: 'multiple',
    options: [
      { value: 'no-idea', label: 'I don\'t know where to start', weight: { 'side-hustle-accelerator': 2, 'income-igniter': 2 } },
      { value: 'no-structure', label: 'My business lacks structure', weight: { 'core-foundation': 3, 'rapid-revenue-starter': 2 } },
      { value: 'low-revenue', label: 'I\'m not making enough money', weight: { 'scale-income-amplifier': 3, 'rapid-revenue-starter': 2 } },
      { value: 'manual-work', label: 'Too much manual work', weight: { 'scale-ai-boost': 3, 'growth-success-bundle': 2 } },
      { value: 'team-issues', label: 'Hiring and team management problems', weight: { 'smarthire-suite': 3 } },
      { value: 'no-funding', label: 'Limited access to funding', weight: { 'business-financial-power': 3, 'impact-visibility-amplifier': 2 } },
      { value: 'poor-credit', label: 'Personal or business credit issues', weight: { 'personal-financial-power': 3, 'business-financial-power': 2 } },
      { value: 'no-visibility', label: 'Low online visibility and credibility', weight: { 'impact-visibility-amplifier': 3, 'social-media-domination': 2 } },
      { value: 'sales-issues', label: 'Poor sales conversion rates', weight: { 'sales-customer-mastery': 3, 'scale-income-amplifier': 2 } }
    ]
  }
];

const serviceData = {
  'side-hustle-accelerator': { title: 'Side Hustle Accelerator', price: '$1,200–$1,800', duration: '90 days', color: 'emerald', icon: '⚡' },
  'income-igniter': { title: 'Income Igniter Package', price: '$997–$1,497', duration: '30-90 days', color: 'orange', icon: '🚀' },
  'core-foundation': { title: 'Core Business Foundation', price: '$1,997–$2,997', duration: '90-120 days', color: 'teal', icon: '🏗️' },
  'rapid-revenue-starter': { title: 'Rapid Revenue Starter', price: '$2,500–$3,500', duration: '90 days', color: 'indigo', icon: '💼' },
  'smarthire-suite': { title: 'SmartHire Suite', price: '$2,997–$4,997', duration: '120-180 days', color: 'purple', icon: '👥' },
  'growth-success-bundle': { title: 'Growth+ Success Bundle', price: '$4,500–$6,500', duration: '180-210 days', color: 'emerald', icon: '📈' },
  'scale-income-amplifier': { title: 'Scale+ Income Amplifier', price: '$1,997–$3,500', duration: '60 days', color: 'rose', icon: '💰' },
  'scale-ai-boost': { title: 'Scale AI Business Boost', price: '$2,500–$5,000', duration: '60-90 days', color: 'blue', icon: '🤖' },
  'impact-visibility-amplifier': { title: 'Impact Visibility Amplifier', price: '$4,500–$6,500', duration: '120-240 days', color: 'amber', icon: '🌟' },
  'profit-stream-pro': { title: 'Profit Stream Pro', price: '$3,000–$9,500+', duration: '90-180 days', color: 'green', icon: '💸' },
  'business-financial-power': { title: 'Business Financial Power', price: '$9,500', duration: '6-9 months', color: 'cyan', icon: '🚀' },
  'personal-financial-power': { title: 'Personal Financial Power', price: '$1,250', duration: '9 months', color: 'emerald', icon: '💳' },
  'social-media-domination': { title: 'Social Media Domination', price: '$2,850', duration: '3-4 months', color: 'pink', icon: '📱' },
  'sales-customer-mastery': { title: 'Sales & Customer Mastery', price: '$2,000', duration: '2-3 months', color: 'red', icon: '💼' },
  'legacy-epic-empire': { title: 'Legacy EPIC Empire', price: '$17,500+', duration: '9-12 months', color: 'gradient', icon: '👑' }
};

const colorClasses = {
  emerald: { bg: 'from-emerald-500 to-emerald-600', text: 'text-emerald-600', button: 'bg-emerald-600 hover:bg-emerald-700' },
  orange: { bg: 'from-orange-500 to-orange-600', text: 'text-orange-500', button: 'bg-orange-500 hover:bg-orange-600' },
  teal: { bg: 'from-teal-500 to-teal-600', text: 'text-teal-600', button: 'bg-teal-600 hover:bg-teal-700' },
  indigo: { bg: 'from-indigo-500 to-indigo-600', text: 'text-indigo-600', button: 'bg-indigo-600 hover:bg-indigo-700' },
  purple: { bg: 'from-purple-500 to-purple-600', text: 'text-purple-600', button: 'bg-purple-600 hover:bg-purple-700' },
  rose: { bg: 'from-rose-500 to-rose-600', text: 'text-rose-600', button: 'bg-rose-600 hover:bg-rose-700' },
  blue: { bg: 'from-blue-500 to-blue-600', text: 'text-blue-600', button: 'bg-blue-600 hover:bg-blue-700' },
  amber: { bg: 'from-amber-500 to-amber-600', text: 'text-amber-600', button: 'bg-amber-600 hover:bg-amber-700' },
  green: { bg: 'from-green-500 to-green-600', text: 'text-green-600', button: 'bg-green-600 hover:bg-green-700' },
  cyan: { bg: 'from-cyan-500 to-cyan-600', text: 'text-cyan-600', button: 'bg-cyan-600 hover:bg-cyan-700' },
  pink: { bg: 'from-pink-500 to-pink-600', text: 'text-pink-600', button: 'bg-pink-600 hover:bg-pink-700' },
  red: { bg: 'from-red-500 to-red-600', text: 'text-red-600', button: 'bg-red-600 hover:bg-red-700' },
  gradient: { bg: 'from-purple-600 to-yellow-500', text: 'bg-gradient-to-r from-purple-600 to-yellow-500 bg-clip-text text-transparent', button: 'bg-gradient-to-r from-purple-600 to-yellow-500 hover:from-purple-700 hover:to-yellow-600' }
};

export function ServiceRecommender({ onComplete, onBackClick, onServiceSelect, onBookingClick }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [recommendations, setRecommendations] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleAnswer = (questionId, value) => {
    const question = questions[currentQuestion];
    
    if (question.type === 'multiple') {
      const currentAnswers = answers[questionId] || [];
      const newAnswers = currentAnswers.includes(value)
        ? currentAnswers.filter(v => v !== value)
        : [...currentAnswers, value];
      
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

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateRecommendations();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateRecommendations = async () => {
    setIsCalculating(true);
    
    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const scores = {};
    
    // Calculate scores based on answers
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = questions.find(q => q.id === questionId);
      if (!question) return;
      
      const answerArray = Array.isArray(answer) ? answer : [answer];
      
      answerArray.forEach(answerValue => {
        const option = question.options.find(opt => opt.value === answerValue);
        if (option && option.weight) {
          Object.entries(option.weight).forEach(([serviceId, weight]) => {
            scores[serviceId] = (scores[serviceId] || 0) + weight;
          });
        }
      });
    });
    
    // Sort services by score and get top 3
    const sortedServices = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([serviceId, score]) => ({
        id: serviceId,
        score,
        ...serviceData[serviceId],
        matchPercentage: Math.min(Math.round((score / 15) * 100), 98) // Max 98% to be realistic
      }));
    
    setRecommendations(sortedServices);
    setIsCalculating(false);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];
  const currentAnswer = answers[question?.id];
  const canProceed = question?.type === 'multiple' ? 
    (currentAnswer && currentAnswer.length > 0) : 
    currentAnswer;

  if (isCalculating) {
    return (
      <div className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <Brain className="w-12 h-12 text-white animate-pulse" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Analyzing Your Answers...</h2>
          <p className="text-xl text-gray-600 mb-8">
            Our AI is finding the perfect services for your business needs.
          </p>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2 }}
            ></motion.div>
          </div>
          <p className="text-gray-500">This will just take a moment...</p>
        </div>
      </div>
    );
  }

  if (recommendations) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
              Your Perfect Services
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Based on your answers, here are the services that best match your business needs and goals.
            </p>
          </div>

          {/* Recommendations */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {recommendations.map((service, index) => {
              const colors = colorClasses[service.color];
              const isGradientService = service.color === 'gradient';
              
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="relative"
                >
                  {index === 0 && (
                    <div className="absolute -top-4 -right-4 z-10">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold px-3 py-1">
                        <Star className="w-4 h-4 mr-1" />
                        Best Match
                      </Badge>
                    </div>
                  )}
                  
                  <Card className={`h-full transition-all duration-300 hover:shadow-xl ${index === 0 ? 'ring-2 ring-yellow-400' : ''}`}>
                    <CardHeader className="text-center">
                      <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className={`w-16 h-16 bg-gradient-to-br ${colors.bg} rounded-2xl flex items-center justify-center text-3xl`}>
                          {service.icon}
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${isGradientService ? colors.text : colors.text}`}>
                            {service.matchPercentage}%
                          </div>
                          <div className="text-sm text-gray-500">Match</div>
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold mb-2">{service.title}</CardTitle>
                      <div className="flex justify-center space-x-4 text-sm text-gray-600">
                        <span>{service.price}</span>
                        <span>•</span>
                        <span>{service.duration}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`bg-gradient-to-r ${colors.bg} h-2 rounded-full transition-all duration-1000`}
                            style={{ width: `${service.matchPercentage}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                          <Button
                            onClick={() => onServiceSelect(service.id)}
                            variant="outline"
                            className="w-full border-2 hover:bg-gray-50"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Full Details
                          </Button>
                          <Button
                            onClick={onBookingClick}
                            className={`w-full ${colors.button} text-white shadow-lg hover:shadow-xl`}
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Get Started
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                onClick={onBookingClick}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Free Strategy Call
              </Button>
              <Button
                onClick={() => {
                  setCurrentQuestion(0);
                  setAnswers({});
                  setRecommendations(null);
                }}
                variant="outline"
                size="lg"
              >
                Retake Quiz
              </Button>
              <Button
                onClick={onBackClick}
                variant="ghost"
                size="lg"
              >
                Back to Services
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
            Service Recommender
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Answer a few questions to get personalized service recommendations based on your business needs.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center text-gray-900">
                  {question.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {question.options.map((option) => {
                    const isSelected = question.type === 'multiple' 
                      ? currentAnswer?.includes(option.value)
                      : currentAnswer === option.value;

                    return (
                      <motion.button
                        key={option.value}
                        onClick={() => handleAnswer(question.id, option.value)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 text-blue-900'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                          }`}>
                            {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                          </div>
                          <span className="font-medium">{option.label}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {question.type === 'multiple' && (
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    Select all that apply to your situation
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={prevQuestion}
            variant="outline"
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>

          <div className="flex space-x-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentQuestion
                    ? 'bg-blue-600'
                    : index < currentQuestion
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextQuestion}
            disabled={!canProceed}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {currentQuestion === questions.length - 1 ? 'Get Recommendations' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}