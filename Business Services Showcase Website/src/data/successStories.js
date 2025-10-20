// Optimize data structure for better performance
const createSuccessStory = (data) => ({
  ...data,
  // Add computed properties for faster access
  _cached_archetype: data.clientArchetype,
  _cached_quote: data.quote,
  _cached_author: data.author
});

export const successStoriesContent = {
  'side-hustle-accelerator': createSuccessStory({
    clientArchetype: "The Bootstrap Warrior",
    transformationStory: {
      before: {
        situation: "Struggling with inconsistent $200/month side income from freelance writing",
        emotional_state: "Feeling overwhelmed and frustrated with lack of clear business direction",
        financial_state: "Part-time freelancer with unpredictable income streams",
        timeframe: "18 months of trying different approaches without success"
      },
      journey: {
        decision_point: "Chose Revenue Avenue because they promised a systematic approach to side hustle success",
        process_highlights: [
          "Identified virtual assistant niche with clear demand",
          "Built professional systems and processes in 30 days",
          "Launched structured pricing and service packages",
          "Automated client acquisition and delivery systems"
        ],
        breakthrough_moment: "Week 8 when I signed my first $1,200/month retainer client and realized this was scalable"
      },
      after: {
        concrete_results: [
          "Consistent $3,500 monthly income within 120 days",
          "5 recurring clients with systematic onboarding",
          "15-hour work weeks with optimized processes",
          "Professional brand and online presence"
        ],
        emotional_transformation: "From stressed freelancer to confident business owner with clear growth trajectory",
        business_impact: "Transformed from sporadic gig work to systematic business with predictable revenue",
        future_trajectory: "Planning to scale to $10K/month and hire virtual team within 12 months"
      }
    },
    credibilityMarkers: {
      client_photo: "Professional headshot available",
      business_logo: "MS Virtual Solutions LLC",
      industry_context: "Virtual Assistant Services, B2B",
      timeline: "Completed 6 months ago",
      verification_badge: "Verified Revenue Avenue Graduate"
    },
    measurableOutcomes: {
      revenue_growth: "1,750% increase in monthly revenue (from $200 to $3,500)",
      efficiency_gains: "Reduced work hours by 60% while tripling income",
      market_position: "Positioned as premium VA in local business community",
      team_growth: "Built foundation for scaling with systems documentation",
      strategic_wins: "Featured in local entrepreneur magazine, 5-star Google reviews"
    },
    quote: "I went from hoping for sales to predicting them. Revenue Avenue didn't just teach me tactics—they rewired how I think about business.",
    author: "Maria S., Virtual Assistant & Business Owner"
  }),

  'income-igniter-package': createSuccessStory({
    clientArchetype: "The Ambitious Accelerator",
    transformationStory: {
      before: {
        situation: "Established freelance digital marketer hitting income ceiling at $4,000/month",
        emotional_state: "Feeling frustrated with trading time for money and lack of scalability",
        financial_state: "Consistent but limited freelance income with no growth path",
        timeframe: "2 years at same income level despite working more hours"
      },
      journey: {
        decision_point: "Needed fast-track solution to break through income ceiling and build scalable systems",
        process_highlights: [
          "Rapid transformation from service provider to strategic consultant",
          "Developed signature methodology and intellectual property",
          "Created digital products and group coaching programs",
          "Built automated sales funnels and marketing systems"
        ],
        breakthrough_moment: "Day 25 when first group coaching program sold out at $2,500 per person"
      },
      after: {
        concrete_results: [
          "Scaled to $12,000 monthly recurring revenue in 45 days",
          "Launched 3 digital products generating passive income",
          "Built email list of 2,500 qualified prospects",
          "Established premium consulting rates at $300/hour"
        ],
        emotional_transformation: "From overwhelmed freelancer to confident thought leader and strategic consultant",
        business_impact: "Evolved from trading time for money to scalable, systems-driven revenue model",
        future_trajectory: "On track for $200K annual revenue with plans for team expansion and course platform"
      }
    },
    credibilityMarkers: {
      client_photo: "Professional headshot available",
      business_logo: "Strategic Growth Consulting",
      industry_context: "Digital Marketing Consulting, B2B",
      timeline: "Completed 4 months ago",
      verification_badge: "Verified Revenue Avenue Graduate"
    },
    measurableOutcomes: {
      revenue_growth: "300% increase in monthly revenue within 45 days",
      efficiency_gains: "Automated 70% of client acquisition and delivery processes",
      market_position: "Recognized as premium consultant in digital marketing space",
      team_growth: "Built systems for hiring first virtual team member",
      strategic_wins: "Speaking at 3 industry conferences, featured in Marketing Land publication"
    },
    quote: "Launched my business and started generating revenue in just 35 days. The fast-track approach was perfect for my timeline and aggressive growth goals.",
    author: "David R., Digital Marketing Consultant"
  }),

  'business-foundation-setup': createSuccessStory({
    clientArchetype: "The Strategic Builder",
    transformationStory: {
      before: {
        situation: "Aspiring business coach with great ideas but no systematic business foundation",
        emotional_state: "Feeling overwhelmed by the complexity of starting a legitimate business",
        financial_state: "Personal savings with no business income or structure",
        timeframe: "6 months of research and planning without action"
      },
      journey: {
        decision_point: "Chose Revenue Avenue for comprehensive foundation that handles all business setup complexities",
        process_highlights: [
          "Complete legal business entity formation and compliance",
          "Professional branding and market positioning strategy",
          "Systematic client acquisition and delivery processes",
          "Financial systems and business credit establishment"
        ],
        breakthrough_moment: "Month 3 when comprehensive systems enabled first $5K client contract"
      },
      after: {
        concrete_results: [
          "Fully operational LLC with business banking and credit",
          "Professional brand with 50+ business listings and SEO presence",
          "Systematic client onboarding and delivery processes",
          "Generated $25K revenue in first 6 months post-launch"
        ],
        emotional_transformation: "From idea-stage dreamer to confident, professional business owner",
        business_impact: "Built solid foundation for sustainable business growth and scaling",
        future_trajectory: "Expanding to group coaching programs and online course development"
      }
    },
    credibilityMarkers: {
      client_photo: "Professional headshot available",
      business_logo: "Empowerment Business Coaching LLC",
      industry_context: "Business Coaching, Professional Services",
      timeline: "Completed 8 months ago",
      verification_badge: "Verified Revenue Avenue Graduate"
    },
    measurableOutcomes: {
      revenue_growth: "Generated $25K revenue within 6 months of foundation completion",
      efficiency_gains: "Professional systems reduced admin time by 80%",
      market_position: "Established as credible business coach with professional presence",
      team_growth: "Built infrastructure to support future team expansion",
      strategic_wins: "Invited to speak at local chamber of commerce, 3 strategic partnerships formed"
    },
    quote: "Everything I needed to start my business professionally. From legal setup to branding to systems - they handled it all. Saved me months of figuring it out myself.",
    author: "Jennifer L., Business Coach & Consultant"
  }),

  'rapid-revenue-starter': createSuccessStory({
    clientArchetype: "The Growth Hacker",
    transformationStory: {
      before: {
        situation: "Experienced entrepreneur with successful offline business wanting to scale online",
        emotional_state: "Frustrated with slow progress in digital transformation and automation",
        financial_state: "$75K annual offline revenue but struggling to scale digitally",
        timeframe: "12 months attempting digital transformation with limited results"
      },
      journey: {
        decision_point: "Needed rapid scaling solution with pre-funded structure and automation systems",
        process_highlights: [
          "Created comprehensive digital product suite within 30 days",
          "Secured business funding and optimized cash flow systems",
          "Built automated sales funnels and revenue systems",
          "Implemented scalable fulfillment and customer service processes"
        ],
        breakthrough_moment: "Week 6 when automated systems generated first $10K month without manual intervention"
      },
      after: {
        concrete_results: [
          "Automated revenue systems generating $15K monthly",
          "Digital product suite with 40% profit margins",
          "Secured $50K business line of credit for expansion",
          "Built customer base of 500+ digital clients"
        ],
        emotional_transformation: "From manual business operator to strategic systems architect",
        business_impact: "Successfully transitioned from service-based to scalable product business model",
        future_trajectory: "Projecting $300K annual revenue with plans for national market expansion"
      }
    },
    credibilityMarkers: {
      client_photo: "Professional headshot available",
      business_logo: "Digital Empire Ventures",
      industry_context: "E-commerce and Digital Products",
      timeline: "Completed 5 months ago",
      verification_badge: "Verified Revenue Avenue Graduate"
    },
    measurableOutcomes: {
      revenue_growth: "400% increase in monthly revenue through automation and scaling",
      efficiency_gains: "Automated 90% of sales and fulfillment processes",
      market_position: "Established as innovative leader in digital transformation",
      team_growth: "Scaled from solopreneur to team of 3 with clear roles",
      strategic_wins: "Featured in Entrepreneur Magazine, secured distribution partnership"
    },
    quote: "Turned my hustle into a real business with automated systems generating $15K monthly. The funding help and automation were game-changers for scaling.",
    author: "Marcus P., Digital Entrepreneur"
  }),

  'success-bundle': createSuccessStory({
    clientArchetype: "The Strategic Empire Builder",
    transformationStory: {
      before: {
        situation: "Growing consulting firm at $150K annual revenue but lacking systematic growth infrastructure",
        emotional_state: "Feeling constrained by manual processes and inability to scale effectively",
        financial_state: "Good revenue but poor profit margins due to inefficient operations",
        timeframe: "18 months stuck at same revenue level despite increased effort"
      },
      journey: {
        decision_point: "Chose Revenue Avenue for comprehensive infrastructure to support serious business expansion",
        process_highlights: [
          "Established business credit and secured $100K funding line",
          "Built multiple income streams with systematic diversification",
          "Implemented advanced automation and operational systems",
          "Created scalable team structure and documented processes"
        ],
        breakthrough_moment: "Month 4 when multiple income streams combined to generate first $50K month"
      },
      after: {
        concrete_results: [
          "Scaled to $35K average monthly revenue within 6 months",
          "Developed 4 distinct revenue streams with 60% profit margins",
          "Built team of 5 with clear systems and accountability",
          "Established strong business credit and funding capabilities"
        ],
        emotional_transformation: "From overwhelmed business owner to confident CEO with clear growth vision",
        business_impact: "Transformed from manual consulting to scalable business empire with multiple revenue streams",
        future_trajectory: "Targeting $1M annual revenue with acquisition opportunities and franchise development"
      }
    },
    credibilityMarkers: {
      client_photo: "Professional headshot available",
      business_logo: "Strategic Solutions Enterprise",
      industry_context: "Business Consulting and Technology Solutions",
      timeline: "Completed 7 months ago",
      verification_badge: "Verified Revenue Avenue Graduate"
    },
    measurableOutcomes: {
      revenue_growth: "580% increase in monthly revenue through systematic scaling",
      efficiency_gains: "Increased profit margins from 25% to 60% through optimization",
      market_position: "Recognized as industry leader with multiple service offerings",
      team_growth: "Expanded from solo consultant to team of 5 specialists",
      strategic_wins: "Won 2 industry awards, secured 3 strategic partnerships, featured in Inc. Magazine"
    },
    quote: "Transformed my business from struggling startup to funded, scalable operation generating multiple income streams. The comprehensive approach was exactly what I needed.",
    author: "Sarah K., CEO & Strategic Consultant"
  }),

  'income-amplifier': createSuccessStory({
    clientArchetype: "The Optimization Expert",
    transformationStory: {
      before: {
        situation: "Successful online course creator generating $8K monthly but hitting growth plateau",
        emotional_state: "Frustrated with stagnant growth despite having proven products and audience",
        financial_state: "Consistent revenue but low customer lifetime value and poor retention",
        timeframe: "8 months stuck at same revenue level with declining engagement"
      },
      journey: {
        decision_point: "Needed systematic optimization to maximize existing business assets and break through plateau",
        process_highlights: [
          "Implemented comprehensive funnel stacking and upsell sequences",
          "Automated customer journey optimization with advanced segmentation",
          "Created high-value backend offers and retention programs",
          "Built sophisticated analytics and optimization systems"
        ],
        breakthrough_moment: "Month 2 when new upsell sequence generated additional $6K from existing customer base"
      },
      after: {
        concrete_results: [
          "Increased average customer value from $200 to $480",
          "Automated 85% of marketing and sales processes",
          "Built systematic retention program with 70% repeat purchase rate",
          "Scaled monthly revenue to $18K with same traffic volume"
        ],
        emotional_transformation: "From plateau-stuck entrepreneur to systematic optimization strategist",
        business_impact: "Maximized existing business assets to dramatically increase profitability without increasing workload",
        future_trajectory: "Planning expansion to corporate training market with $500K revenue target"
      }
    },
    credibilityMarkers: {
      client_photo: "Professional headshot available",
      business_logo: "Mastery Learning Systems",
      industry_context: "Online Education and Training",
      timeline: "Completed 4 months ago",
      verification_badge: "Verified Revenue Avenue Graduate"
    },
    measurableOutcomes: {
      revenue_growth: "225% increase in monthly revenue through optimization",
      efficiency_gains: "Saved 15 hours per week through automation while doubling revenue",
      market_position: "Established as premium educator with optimized customer experience",
      team_growth: "Hired customer success manager and content producer",
      strategic_wins: "Partnered with 2 major industry influencers, featured in Online Marketing podcast"
    },
    quote: "Doubled my average customer value and saved 15 hours per week with their automation systems. Revenue went from $8K to $18K monthly without burning out.",
    author: "Tom H., Online Course Creator"
  }),

  'rental-revenue-igniter': createSuccessStory({
    clientArchetype: "The Passive Income Strategist",
    transformationStory: {
      before: {
        situation: "Real estate investor with 2 properties seeking to optimize rental income and scale systematically",
        emotional_state: "Overwhelmed by manual property management and inconsistent booking optimization",
        financial_state: "$4,200 monthly rental income with 40% vacancy rate and high management costs",
        timeframe: "14 months struggling with property management inefficiencies"
      },
      journey: {
        decision_point: "Chose Revenue Avenue for systematic rental business optimization and scaling infrastructure",
        process_highlights: [
          "Implemented comprehensive property automation and management systems",
          "Optimized pricing strategy and booking conversion rates",
          "Established vendor relationships and operational efficiency",
          "Built scalable systems for property acquisition and management"
        ],
        breakthrough_moment: "Month 3 when automation systems achieved 95% occupancy rate with premium pricing"
      },
      after: {
        concrete_results: [
          "Achieved 95% occupancy rate with 40% higher nightly rates",
          "Generated $8,500 monthly rental income from same 2 properties",
          "Automated 80% of property management tasks",
          "Built systematic approach for scaling to additional properties"
        ],
        emotional_transformation: "From hands-on property manager to strategic real estate business owner",
        business_impact: "Converted labor-intensive rentals into optimized passive income generating assets",
        future_trajectory: "Acquiring 3 additional properties with projected $25K monthly portfolio income"
      }
    },
    credibilityMarkers: {
      client_photo: "Professional headshot available",
      business_logo: "Premium Stays Property Management",
      industry_context: "Short-term Rental and Property Management",
      timeline: "Completed 6 months ago",
      verification_badge: "Verified Revenue Avenue Graduate"
    },
    measurableOutcomes: {
      revenue_growth: "202% increase in rental income through optimization and automation",
      efficiency_gains: "Reduced management time by 75% while improving guest satisfaction",
      market_position: "Achieved premium positioning with 4.9-star average rating",
      team_growth: "Built network of reliable vendors and virtual assistant support",
      strategic_wins: "Featured in local real estate publication, secured property management contracts for other investors"
    },
    quote: "Launched my rental business and generated $8,500 monthly passive income within 5 months. The complete setup and automation made it truly hands-off.",
    author: "Carlos M., Real Estate Investor"
  }),

  // Continue with additional service success stories...
  'growth-fundability-accelerator': createSuccessStory({
    clientArchetype: "The Scale-Ready Innovator",
    transformationStory: {
      before: {
        situation: "Tech startup with promising product but struggling with funding readiness and growth systems",
        emotional_state: "Feeling frustrated with investor rejections and lack of scalable business infrastructure",
        financial_state: "$40K monthly revenue but burning cash with poor unit economics",
        timeframe: "10 months seeking funding with multiple investor rejections"
      },
      journey: {
        decision_point: "Needed comprehensive funding preparation and growth infrastructure for investor readiness",
        process_highlights: [
          "Built comprehensive financial models and investor-ready documentation",
          "Established business credit and optimized unit economics",
          "Implemented scalable operations and team structure",
          "Created strategic partnerships and market validation"
        ],
        breakthrough_moment: "Month 5 when Series A presentation resulted in term sheets from 3 investors"
      },
      after: {
        concrete_results: [
          "Secured $1.2M Series A funding round",
          "Achieved positive unit economics with 40% gross margins",
          "Built scalable team structure with clear growth roadmap",
          "Established strategic partnerships with 2 major industry players"
        ],
        emotional_transformation: "From struggling startup founder to confident, investor-backed CEO",
        business_impact: "Transformed from cash-burning startup to investor-ready growth company",
        future_trajectory: "Scaling to $500K monthly revenue with Series B planning for international expansion"
      }
    },
    credibilityMarkers: {
      client_photo: "Professional headshot available",
      business_logo: "InnovaTech Solutions Inc.",
      industry_context: "SaaS Technology and Business Software",
      timeline: "Completed 9 months ago",
      verification_badge: "Verified Revenue Avenue Graduate"
    },
    measurableOutcomes: {
      revenue_growth: "Scaled to $120K monthly recurring revenue post-funding",
      efficiency_gains: "Improved unit economics from -15% to +40% gross margin",
      market_position: "Recognized as emerging leader in business automation space",
      team_growth: "Expanded from 3 founders to team of 15 specialists",
      strategic_wins: "Featured in TechCrunch, won 2 industry innovation awards, secured enterprise partnerships"
    },
    quote: "Revenue Avenue didn't just help us get funded—they built the foundation for sustainable, scalable growth that investors could believe in.",
    author: "Michael Chen, CEO & Co-Founder"
  })
};

// Utility function to get success story by service tier
export const getSuccessStoryByTier = (serviceId) => {
  return successStoriesContent[serviceId] || null;
};

// Utility function to get all success stories
export const getAllSuccessStories = () => {
  return Object.values(successStoriesContent);
};

// Utility function to get success stories by archetype
export const getSuccessStoriesByArchetype = (archetype) => {
  return Object.values(successStoriesContent).filter(
    story => story.clientArchetype === archetype
  );
};