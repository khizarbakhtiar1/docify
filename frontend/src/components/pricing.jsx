"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PurchaseCreditButton from "./PurchaseCreditButton";

export function Pricing() {
  const [instituteAddress, setInstituteAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchInstituteAddress = async () => {
      try {
        const address = "0x8F2D5BdB4F7C380e05AcEA2950dE9D03d9E75F4f";
        setInstituteAddress(address);
      } catch (error) {
        console.error("Error fetching Institute address:", error);
        setErrorMessage(
          "Failed to fetch Institute address. Please try again later."
        );
      }
    };

    fetchInstituteAddress();
  }, []);

  const plans = [
    {
      name: "Basic",
      price: "$49",
      period: "/ month",
      description: "Perfect for small institutions",
      credits: "100 Credits included",
      costPerCredit: "$0.49 per credit",
      features: ["Email support", "Basic analytics"],
      planType: 1,
      gradient: "text-blue-600",
      popular: false
    },
    {
      name: "Pro",
      price: "$199",
      period: "/ month",
      description: "Ideal for growing institutions",
      credits: "500 Credits included",
      costPerCredit: "$0.40 per credit",
      features: ["Priority support", "Advanced analytics", "API access"],
      planType: 2,
      gradient: "text-purple-600",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$449",
      period: "/ month",
      description: "For large institutions",
      credits: "1,500 Credits included",
      costPerCredit: "$0.30 per credit",
      features: ["24/7 support", "Custom integrations", "Dedicated account manager"],
      planType: 3,
      gradient: "text-blue-600",
      popular: false
    }
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20 gradient-background min-h-screen">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="text-center space-y-6 mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Choose Your Plan
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Select the perfect plan for your document verification needs. All plans include secure blockchain verification and instant results.
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="text-red-500 text-center mb-8 p-4 bg-red-50 rounded-lg">
            {errorMessage}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mt-4 lg:gap-10 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-6 md:p-8 rounded-xl hover-lift h-full flex flex-col ${
                plan.popular 
                  ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 shadow-lg' 
                  : 'gradient-card'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Header */}
              <div className={`text-center mb-6 ${plan.popular ? 'pt-6' : ''}`}>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                <div className="mb-4">
                  <span className={`text-4xl font-bold ${plan.gradient}`}>{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <div className="text-sm text-gray-500 mb-4">{plan.description}</div>
              </div>

              {/* Features - This will grow to fill available space */}
              <div className="flex-1 flex flex-col">
                <ul className="space-y-3">
                  {/* Credits */}
                  <li className="flex items-center">
                    <CheckIcon className={`text-white rounded-full mr-3 p-1 w-5 h-5 flex-shrink-0 ${
                      plan.popular ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-green-500'
                    }`} />
                    <span className="text-gray-700 font-bold">{plan.credits}</span>
                  </li>
                  
                  {/* Cost per credit */}
                  <li className="flex items-center">
                    <CheckIcon className={`text-white rounded-full mr-3 p-1 w-5 h-5 flex-shrink-0 ${
                      plan.popular ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-green-500'
                    }`} />
                    <span className="text-gray-700 font-bold">{plan.costPerCredit}</span>
                  </li>
                  
                  {/* Additional features */}
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckIcon className={`text-white rounded-full mr-3 p-1 w-5 h-5 flex-shrink-0 ${
                        plan.popular ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-green-500'
                      }`} />
                      <span className="text-gray-700 font-bold">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Button - Fixed at bottom */}
              <div className="pt-8">
                <PurchaseCreditButton
                  instituteAddress={instituteAddress}
                  planType={plan.planType}
                  isPro={plan.popular}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Contact Sales */}
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-6">Need a custom solution?</p>
          <Button className="btn-gradient text-white px-8 py-3">Contact Sales</Button>
        </div>
      </div>
    </section>
  );
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
} 