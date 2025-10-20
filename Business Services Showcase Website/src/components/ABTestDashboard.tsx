import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { BarChart, TrendingUp, Users, Target, RefreshCw } from "lucide-react";
import { useABTestResults } from "./ABTesting";

export function ABTestDashboard() {
  const results = useABTestResults();

  const clearResults = () => {
    if (confirm('Are you sure you want to clear all A/B test data?')) {
      localStorage.removeItem('ra_ab_tests');
      localStorage.removeItem('ra_ab_conversions');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold ra-text-primary">A/B Test Results</h2>
          <p className="ra-text-secondary">Real-time conversion optimization data</p>
        </div>
        <Button onClick={clearResults} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Clear Data
        </Button>
      </div>

      <div className="grid gap-6">
        {results.map((test) => (
          <Card key={test.testId} className="ra-stat-modern">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart className="w-5 h-5 ra-text-accent" />
                <span className="ra-text-primary">{formatTestName(test.testId)}</span>
              </CardTitle>
              <CardDescription>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {test.totalParticipants} participants
                  </span>
                  <span className="flex items-center">
                    <Target className="w-4 h-4 mr-1" />
                    {test.totalConversions} conversions
                  </span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {test.variantResults.map((variant) => (
                  <div 
                    key={variant.variant}
                    className="flex items-center justify-between p-4 border rounded-lg ra-border-light"
                  >
                    <div className="flex items-center space-x-3">
                      <Badge 
                        variant={variant.variant === 'control' ? 'secondary' : 'default'}
                        className={variant.variant === 'control' ? '' : 'ra-cta-badge'}
                      >
                        {variant.variant}
                      </Badge>
                      <div>
                        <p className="font-semibold ra-text-primary">
                          {variant.participants} participants
                        </p>
                        <p className="text-sm ra-text-secondary">
                          {variant.conversions} conversions
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <div className={`text-2xl font-bold ${
                          variant.conversionRate > 0 ? 'text-green-600' : 'ra-text-muted'
                        }`}>
                          {variant.conversionRate.toFixed(1)}%
                        </div>
                        {variant.conversionRate > 0 && (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-xs ra-text-muted">conversion rate</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {test.variantResults.length > 1 && (
                <div className="mt-4 pt-4 border-t ra-border-light">
                  <WinnerAnalysis variants={test.variantResults} />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {results.length === 0 && (
        <Card className="ra-stat-modern">
          <CardContent className="pt-6 text-center">
            <BarChart className="w-12 h-12 ra-text-muted mx-auto mb-4" />
            <h3 className="font-semibold ra-text-primary mb-2">No A/B Test Data Yet</h3>
            <p className="ra-text-secondary text-sm">
              Start interacting with the site to generate test data and conversions.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function WinnerAnalysis({ variants }: { variants: any[] }) {
  const winner = variants.reduce((prev, current) => 
    current.conversionRate > prev.conversionRate ? current : prev
  );
  
  const improvement = variants.length > 1 
    ? winner.conversionRate - Math.min(...variants.map(v => v.conversionRate))
    : 0;

  if (improvement <= 0) {
    return (
      <p className="text-sm ra-text-muted">
        Insufficient data for statistical significance
      </p>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold ra-text-primary">
          🏆 Winner: <span className="ra-text-accent">{winner.variant}</span>
        </p>
        <p className="text-xs ra-text-secondary">
          {improvement.toFixed(1)}% improvement over lowest performer
        </p>
      </div>
      
      {improvement > 5 && (
        <Badge className="bg-green-500 text-white">
          <TrendingUp className="w-3 h-3 mr-1" />
          Significant
        </Badge>
      )}
    </div>
  );
}

function formatTestName(testId: string): string {
  const names = {
    'hero-cta-variation': 'Homepage Hero CTA',
    'service-detail-hero-cta': 'Service Detail Hero CTA',
    'service-detail-investment-cta': 'Investment Section CTA',
    'exit-intent-offer': 'Exit Intent Popup',
    'pricing-display': 'Pricing Display Format'
  };
  
  return names[testId] || testId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}