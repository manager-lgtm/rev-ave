import React from 'react';
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Calendar, Eye, CheckCircle, Clock, DollarSign, Users, X } from "lucide-react";
import { serviceDetails } from "../data/serviceDetails";
import { colorClasses } from "../data/colorClasses";
import { motion } from "motion/react";

export function ServiceComparison({ serviceIds, onBackClick, onBookingClick, onServiceSelect }) {
  // Map service IDs to service objects with IDs preserved
  const services = serviceIds
    .map(id => {
      const service = serviceDetails[id];
      return service ? { ...service, id } : null;
    })
    .filter(Boolean);

  if (services.length === 0) {
    return (
      <div className="py-20 px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">No Services Selected</h1>
        <p className="text-gray-600 mb-6">Select at least 2 services to compare them side by side.</p>
        <Button onClick={onBackClick}>Back to Services</Button>
      </div>
    );
  }

  const getComparisonRows = () => {
    const rows = [
      {
        title: 'Overview',
        items: [
          { label: 'Service Name', getValue: (service) => service.title },
          { label: 'Subtitle', getValue: (service) => service.subtitle },
          { label: 'Category', getValue: (service) => service.category },
          { label: 'Description', getValue: (service) => service.heroDescription }
        ]
      },
      {
        title: 'Investment & Timeline',
        items: [
          { label: 'Price Range', getValue: (service) => service.price },
          { label: 'Duration', getValue: (service) => service.duration },
          { label: 'Price per Day', getValue: (service) => {
            const avgPrice = (service.priceMin + service.priceMax) / 2;
            const daysMap = { 
              '90 days': 90, 
              '30-90 days': 60, 
              '90-120 days': 105, 
              '120-180 days': 150, 
              '180-210 days': 195, 
              '60 days': 60, 
              '60-90 days': 75, 
              '120-240 days': 180, 
              '90–180 days': 135, 
              '6–9 months': 225, 
              '9 months': 270, 
              '3–4 months': 105, 
              '2–3 months': 75, 
              '9–12 months': 330 
            };
            const days = daysMap[service.duration] || 90;
            return `$${Math.round(avgPrice / days)}/day`;
          }}
        ]
      },
      {
        title: 'Target Audience',
        items: [
          { label: 'Who This Is For', getValue: (service) => service.whoItsFor, isList: true }
        ]
      },
      {
        title: 'Problems Solved',
        items: [
          { label: 'Pain Points Addressed', getValue: (service) => service.painPointsSolved, isList: true }
        ]
      },
      {
        title: 'Deliverables',
        items: [
          { label: 'Core Deliverables', getValue: (service) => service.coreDeliverables, isList: true }
        ]
      },
      {
        title: 'Expected Outcomes',
        items: [
          { label: 'Results You Can Expect', getValue: (service) => service.expectedOutcomes, isList: true }
        ]
      },
      {
        title: 'Process',
        items: [
          { label: 'Number of Steps', getValue: (service) => `${service.processSteps.length} phases` },
          { label: 'Methodology', getValue: (service) => service.processSteps.map(step => step.title).join(' → ') }
        ]
      },
      {
        title: 'Bonuses & Guarantees',
        items: [
          { label: 'Included Bonuses', getValue: (service) => service.bonuses || ['No additional bonuses'], isList: true },
          { label: 'Guarantee', getValue: (service) => service.guarantee || 'Standard satisfaction guarantee' }
        ]
      }
    ];

    return rows;
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
            Service Comparison
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Compare services side-by-side to find the perfect fit for your business needs.
          </p>
        </div>

        {/* Services Header Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
          {services.map((service) => {
            const colors = colorClasses[service.color];
            const isGradientService = service.color === 'gradient';

            return (
              <motion.div
                key={`header-card-${service.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <Card className={`h-full ${isGradientService ? 'border-2 border-purple-300' : 'border-2'}`}>
                  <CardHeader className="text-center pb-4">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${colors.bg} rounded-2xl flex items-center justify-center text-2xl`}>
                        {service.icon}
                      </div>
                      <Badge variant="outline" className={colors.badge}>
                        {service.category.split(' ')[0]}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold">{service.title}</CardTitle>
                    <p className={`text-sm ${isGradientService ? colors.text : colors.text} font-semibold`}>
                      {service.subtitle}
                    </p>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <DollarSign className={`w-5 h-5 ${isGradientService ? 'text-purple-600' : colors.text} mx-auto mb-1`} />
                        <p className="text-xs text-gray-600">Price</p>
                        <p className="font-semibold text-sm">{service.price}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <Clock className={`w-5 h-5 ${isGradientService ? 'text-purple-600' : colors.text} mx-auto mb-1`} />
                        <p className="text-xs text-gray-600">Duration</p>
                        <p className="font-semibold text-sm">{service.duration}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => onServiceSelect(service.id)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        onClick={onBookingClick}
                        size="sm"
                        className={`w-full ${colors.button} text-white`}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Get Started
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Comparison Table */}
        <div className="space-y-8">
          {getComparisonRows().map((section, sectionIndex) => (
            <Card key={`section-${sectionIndex}`}>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <span>{section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {section.items.map((item, itemIndex) => (
                    <div key={`item-${sectionIndex}-${itemIndex}`} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                      <h4 className="font-semibold text-gray-900 mb-3">{item.label}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {services.map((service) => {
                          const colors = colorClasses[service.color];
                          const isGradientService = service.color === 'gradient';
                          const value = item.getValue(service);

                          return (
                            <div
                              key={`service-${service.id}-section-${sectionIndex}-item-${itemIndex}`}
                              className={`p-4 rounded-lg border-2 ${
                                isGradientService ? 'border-purple-200 bg-purple-50/30' : `border-${service.color}-200 bg-${service.color}-50/30`
                              }`}
                            >
                              <div className="flex items-center space-x-2 mb-2">
                                <div className={`w-6 h-6 bg-gradient-to-br ${colors.bg} rounded-lg flex items-center justify-center text-sm`}>
                                  {service.icon}
                                </div>
                                <span className="text-sm font-medium text-gray-700">{service.title.split(' ')[0]}</span>
                              </div>
                              
                              {item.isList && Array.isArray(value) ? (
                                <ul className="space-y-2">
                                  {value.slice(0, 3).map((listItem, idx) => (
                                    <li key={`list-item-${service.id}-${sectionIndex}-${itemIndex}-${idx}`} className="flex items-start space-x-2 text-sm text-gray-700">
                                      <CheckCircle className={`w-4 h-4 ${isGradientService ? 'text-purple-600' : colors.text} mt-0.5 flex-shrink-0`} />
                                      <span>{listItem}</span>
                                    </li>
                                  ))}
                                  {value.length > 3 && (
                                    <li key={`more-items-${service.id}-${sectionIndex}-${itemIndex}`} className="text-xs text-gray-500 italic">
                                      +{value.length - 3} more items
                                    </li>
                                  )}
                                </ul>
                              ) : (
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {typeof value === 'string' && value.length > 150 
                                    ? `${value.substring(0, 150)}...` 
                                    : value
                                  }
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modern CTA Section - Revenue Avenue Branding */}
        <div className="ra-cta-section ra-cta-section-premium mt-12">
          <div className="text-center">
            <h2 className="ra-cta-title">Ready to Choose Your Service?</h2>
            <p className="ra-cta-subtitle">
              Schedule a free strategy call to discuss which service is the best fit for your business and start your transformation today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                onClick={onBookingClick}
                className="ra-btn-hero-main group"
                data-analytics-cta="comparison-strategy-call"
              >
                <Calendar className="w-5 h-5 mr-3" />
                Schedule Free Strategy Call
                <span className="ml-3 group-hover:translate-x-1 transition-transform">→</span>
              </Button>
              <Button 
                onClick={onBackClick}
                className="ra-btn-secondary-modern"
              >
                Back to Services
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}