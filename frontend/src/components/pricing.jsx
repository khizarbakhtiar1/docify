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

  return (
    <section className="py-16 md:py-24 lg:py-32 gradient-background">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-6 mb-12">
          <h2 className="text-responsive-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Choose Your Plan
          </h2>
          <p className="text-responsive-lg text-gray-600 max-w-3xl mx-auto">
            Select the perfect plan for your document verification needs. All plans include secure blockchain verification and instant results.
          </p>
        </div>

        {errorMessage && (
          <div className="text-red-500 text-center mb-8 p-4 bg-red-50 rounded-lg">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-8 max-w-6xl mx-auto">
          {/* Basic Plan */}
          <div className="gradient-card p-8 rounded-xl hover-lift">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Basic</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-blue-600">$49</span>
                <span className="text-gray-600">/ month</span>
              </div>
              <div className="text-sm text-gray-500 mb-6">Perfect for small institutions</div>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <CheckIcon className="text-white bg-green-500 rounded-full mr-3 p-1 w-5 h-5" />
                <span className="text-gray-700">100 Credits included</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="text-white bg-green-500 rounded-full mr-3 p-1 w-5 h-5" />
                <span className="text-gray-700">$0.49 per credit</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="text-white bg-green-500 rounded-full mr-3 p-1 w-5 h-5" />
                <span className="text-gray-700">Email support</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="text-white bg-green-500 rounded-full mr-3 p-1 w-5 h-5" />
                <span className="text-gray-700">Basic analytics</span>
              </li>
            </ul>
            
            <PurchaseCreditButton
              instituteAddress={instituteAddress}
              planType={1}
            />
          </div>

          {/* Pro Plan */}
          <div className="relative gradient-card p-8 rounded-xl hover-lift border-2 border-purple-300">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            
            <div className="text-center mb-8 pt-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Pro</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">$199</span>
                <span className="text-gray-600">/ month</span>
              </div>
              <div className="text-sm text-gray-500 mb-6">Ideal for growing institutions</div>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <CheckIcon className="text-white bg-green-500 rounded-full mr-3 p-1 w-5 h-5" />
                <span className="text-gray-700">500 Credits included</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="text-white bg-green-500 rounded-full mr-3 p-1 w-5 h-5" />
                <span className="text-gray-700">$0.40 per credit</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="text-white bg-green-500 rounded-full mr-3 p-1 w-5 h-5" />
                <span className="text-gray-700">Priority support</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="text-white bg-green-500 rounded-full mr-3 p-1 w-5 h-5" />
                <span className="text-gray-700">Advanced analytics</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="text-white bg-green-500 rounded-full mr-3 p-1 w-5 h-5" />
                <span className="text-gray-700">API access</span>
              </li>
            </ul>
            
            <PurchaseCreditButton
              instituteAddress={instituteAddress}
              planType={2}
            />
          </div>

          {/* Enterprise Plan */}
          <div className="gradient-card p-8 rounded-xl hover-lift">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Enterprise</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-indigo-600">$449</span>
                <span className="text-gray-600">/ month</span>
              </div>
              <div className="text-sm text-gray-500 mb-6">For large institutions</div>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <CheckIcon className="text-white bg-green-500 rounded-full mr-3 p-1 w-5 h-5" />
                <span className="text-gray-700">1,500 Credits included</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="text-white bg-green-500 rounded-full mr-3 p-1 w-5 h-5" />
                <span className="text-gray-700">$0.30 per credit</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="text-white bg-green-500 rounded-full mr-3 p-1 w-5 h-5" />
                <span className="text-gray-700">24/7 support</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="text-white bg-green-500 rounded-full mr-3 p-1 w-5 h-5" />
                <span className="text-gray-700">Custom integrations</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="text-white bg-green-500 rounded-full mr-3 p-1 w-5 h-5" />
                <span className="text-gray-700">Dedicated account manager</span>
              </li>
            </ul>
            
            <PurchaseCreditButton
              instituteAddress={instituteAddress}
              planType={3}
            />
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Need a custom solution?</p>
          <Button className="btn-gradient">Contact Sales</Button>
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
