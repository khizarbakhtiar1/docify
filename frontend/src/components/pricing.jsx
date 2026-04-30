"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import PurchaseCreditButton from "./PurchaseCreditButton";

export function Pricing({ instituteContract = null, onSuccess = null }) {
  const plans = [
    {
      name: "Basic",
      price: "0.049 ETH",
      description: "Perfect for small institutions",
      credits: "100 Credits included",
      costPerCredit: "~0.00049 ETH per credit",
      features: ["Document submissions", "SBT minting"],
      planType: 1,
      gradient: "text-blue-600",
      popular: false
    },
    {
      name: "Pro",
      price: "0.199 ETH",
      description: "Ideal for growing institutions",
      credits: "500 Credits included",
      costPerCredit: "~0.0004 ETH per credit",
      features: ["Higher volume", "Better per-credit rate", "Priority processing"],
      planType: 2,
      gradient: "text-purple-600",
      popular: true
    },
    {
      name: "Enterprise",
      price: "0.499 ETH",
      description: "For large institutions",
      credits: "1,500 Credits included",
      costPerCredit: "~0.00033 ETH per credit",
      features: ["Maximum volume", "Best per-credit rate", "Bulk operations"],
      planType: 3,
      gradient: "text-blue-600",
      popular: false
    }
  ];

  return (
    <div className="py-8">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Purchase Credits
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Credits are required to submit document verification requests. 
          All prices are in ETH and processed on-chain.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative p-6 rounded-xl hover-lift h-full flex flex-col ${
              plan.popular 
                ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 shadow-lg' 
                : 'gradient-card'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-sm font-medium">
                  Best Value
                </span>
              </div>
            )}

            <div className={`text-center mb-6 ${plan.popular ? 'pt-4' : ''}`}>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{plan.name}</h3>
              <div className="mb-3">
                <span className={`text-3xl font-bold ${plan.gradient}`}>{plan.price}</span>
              </div>
              <div className="text-sm text-gray-500">{plan.description}</div>
            </div>

            <div className="flex-1 flex flex-col">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckIcon className={`text-white rounded-full mr-3 p-1 w-5 h-5 flex-shrink-0 ${
                    plan.popular ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-green-500'
                  }`} />
                  <span className="text-gray-700 font-bold">{plan.credits}</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className={`text-white rounded-full mr-3 p-1 w-5 h-5 flex-shrink-0 ${
                    plan.popular ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-green-500'
                  }`} />
                  <span className="text-gray-700 font-bold">{plan.costPerCredit}</span>
                </li>
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

            <div className="pt-8">
              <PurchaseCreditButton
                instituteContract={instituteContract}
                planType={plan.planType}
                isPro={plan.popular}
                onSuccess={onSuccess}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
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