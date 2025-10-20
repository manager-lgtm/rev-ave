import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Calendar, Clock, Phone, Mail, MapPin, CheckCircle, Star, ArrowRight } from "lucide-react";
import { toast } from "sonner@2.0.3";

export function ContactForm({ onBackClick }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    currentRevenue: '',
    businessStage: '',
    primaryChallenge: '',
    servicesInterested: [],
    preferredContactTime: '',
    message: '',
    howDidYouHear: '',
    agreedToTerms: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceInterestChange = (service, checked) => {
    setFormData(prev => ({
      ...prev,
      servicesInterested: checked 
        ? [...prev.servicesInterested, service]
        : prev.servicesInterested.filter(s => s !== service)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
    toast.success("Strategy call booked successfully! We'll be in touch within 24 hours.");
  };

  if (submitted) {
    return (
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Thank You!</h1>
            <p className="text-xl text-gray-600 mb-8">
              Your strategy call request has been submitted successfully. Our team will review your information and contact you within 24 hours to schedule your free consultation.
            </p>
          </div>

          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What Happens Next?</h2>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Review & Analysis</h3>
                    <p className="text-sm text-gray-600">We'll analyze your business information and prepare a customized strategy.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Schedule Call</h3>
                    <p className="text-sm text-gray-600">We'll contact you to schedule your free 45-minute strategy session.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Strategy Session</h3>
                    <p className="text-sm text-gray-600">Get personalized recommendations and a clear action plan.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={onBackClick} variant="outline" size="lg">
              Back to Services
            </Button>
            <Button 
              onClick={() => window.open('mailto:hello@revenueavenue.com', '_blank')}
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Mail className="w-5 h-5 mr-2" />
              Email Us Directly
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
            Book Your Free 
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Empire Strategy Call
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get personalized recommendations for your business growth. No sales pitch, just valuable insights and a clear action plan.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <span>Strategy Call Application</span>
                </CardTitle>
                <CardDescription>
                  Tell us about your business so we can prepare a customized strategy for your call.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Business Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="company">Company/Business Name</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          placeholder="Enter your business name or 'Personal' if no business yet"
                        />
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="currentRevenue">Current Monthly Revenue</Label>
                          <Select onValueChange={(value) => handleInputChange('currentRevenue', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select revenue range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">$0 (Pre-revenue)</SelectItem>
                              <SelectItem value="1-1000">$1 - $1,000</SelectItem>
                              <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                              <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                              <SelectItem value="10000-25000">$10,000 - $25,000</SelectItem>
                              <SelectItem value="25000-50000">$25,000 - $50,000</SelectItem>
                              <SelectItem value="50000+">$50,000+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="businessStage">Business Stage</Label>
                          <Select onValueChange={(value) => handleInputChange('businessStage', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select stage" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="idea">Idea Stage</SelectItem>
                              <SelectItem value="startup">Startup (0-2 years)</SelectItem>
                              <SelectItem value="growth">Growth Stage (2-5 years)</SelectItem>
                              <SelectItem value="established">Established (5+ years)</SelectItem>
                              <SelectItem value="scaling">Scaling/Expanding</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="primaryChallenge">What's your biggest business challenge right now? *</Label>
                        <Textarea
                          id="primaryChallenge"
                          value={formData.primaryChallenge}
                          onChange={(e) => handleInputChange('primaryChallenge', e.target.value)}
                          placeholder="Describe your main challenge (e.g., finding customers, scaling operations, increasing revenue, etc.)"
                          rows={3}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Services Interest */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Services of Interest</h3>
                    <p className="text-sm text-gray-600 mb-4">Select all services you'd like to learn more about:</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        'Side Hustle Accelerator',
                        'Income Igniter Package',
                        'Core Business Foundation',
                        'Rapid Revenue Starter',
                        'SmartHire Workforce Suite',
                        'Growth+ Success Bundle',
                        'Scale AI Business Boost',
                        'Social Media Domination',
                        'Legacy Empire Program'
                      ].map((service) => (
                        <div key={service} className="flex items-center space-x-2">
                          <Checkbox
                            id={service}
                            checked={formData.servicesInterested.includes(service)}
                            onCheckedChange={(checked) => handleServiceInterestChange(service, checked)}
                          />
                          <Label htmlFor={service} className="text-sm">{service}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="preferredContactTime">Preferred Contact Time</Label>
                        <Select onValueChange={(value) => handleInputChange('preferredContactTime', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select preferred time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                            <SelectItem value="afternoon">Afternoon (12 PM - 5 PM)</SelectItem>
                            <SelectItem value="evening">Evening (5 PM - 8 PM)</SelectItem>
                            <SelectItem value="flexible">I'm flexible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="howDidYouHear">How did you hear about us?</Label>
                        <Select onValueChange={(value) => handleInputChange('howDidYouHear', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="google">Google Search</SelectItem>
                            <SelectItem value="social-media">Social Media</SelectItem>
                            <SelectItem value="referral">Referral from friend/colleague</SelectItem>
                            <SelectItem value="podcast">Podcast</SelectItem>
                            <SelectItem value="youtube">YouTube</SelectItem>
                            <SelectItem value="blog">Blog/Article</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="message">Additional Message</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          placeholder="Is there anything specific you'd like to discuss on the call?"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Terms and Submit */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.agreedToTerms}
                        onCheckedChange={(checked) => handleInputChange('agreedToTerms', checked)}
                        required
                      />
                      <Label htmlFor="terms" className="text-sm text-gray-600">
                        I agree to receive communications from Revenue Avenue and understand that I can unsubscribe at any time. This call is completely free with no obligation to purchase.
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                      disabled={isSubmitting || !formData.agreedToTerms}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Calendar className="w-5 h-5 mr-2" />
                          Book My Free Strategy Call
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Call Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>Call Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-sm text-gray-600">45 minutes</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Format</p>
                    <p className="text-sm text-gray-600">Video call or phone</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Cost</p>
                    <p className="text-sm text-gray-600">Completely free</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What to Expect */}
            <Card>
              <CardHeader>
                <CardTitle>What to Expect</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Business analysis and growth opportunities</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Personalized recommendations</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Clear next steps and action plan</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">No sales pressure or obligations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">hello@revenueavenue.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <span className="text-sm">Available nationwide (US)</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}