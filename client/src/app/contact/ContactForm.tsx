"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface FormData {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  category?: string;
  message?: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Form submitted:", formData);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardContent className="pt-6 pb-8 text-center">
          <div className="mb-6">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <CheckIcon className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold text-green-800 mb-2">Message Sent!</h3>
            <p className="text-muted-foreground">
              Thank you for reaching out. We'll get back to you within 24 hours.
            </p>
          </div>
          <Button 
            onClick={() => setIsSubmitted(false)}
            className="bg-[#0077B6] hover:bg-[#0066A0] transition-colors"
          >
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 transform transition-all duration-300 hover:shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#0077B6] to-[#00A8E8] bg-clip-text text-transparent">
          Send us a Message
        </CardTitle>
        <CardDescription className="text-base">
          Fill out the form below and we'll get back to you as soon as possible.
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Name and Email Row */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-medium">
                Full Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                className={`transition-all duration-200 focus:ring-2 focus:ring-[#0077B6] ${
                  errors.name ? "border-red-500 focus:ring-red-200" : ""
                }`}
              />
              {errors.name && (
                <p className="text-sm text-red-600 animate-fade-in">{errors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email address"
                className={`transition-all duration-200 focus:ring-2 focus:ring-[#0077B6] ${
                  errors.email ? "border-red-500 focus:ring-red-200" : ""
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-600 animate-fade-in">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="font-medium">
              Subject *
            </Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              placeholder="Brief description of your inquiry"
              className={`transition-all duration-200 focus:ring-2 focus:ring-[#0077B6] ${
                errors.subject ? "border-red-500 focus:ring-red-200" : ""
              }`}
            />
            {errors.subject && (
              <p className="text-sm text-red-600 animate-fade-in">{errors.subject}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="font-medium">
              Inquiry Category *
            </Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger className={`transition-all duration-200 focus:ring-2 focus:ring-[#0077B6] ${
                errors.category ? "border-red-500 focus:ring-red-200" : ""
              }`}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Inquiry</SelectItem>
                <SelectItem value="technical">Technical Support</SelectItem>
                <SelectItem value="institution">Institution Registration</SelectItem>
                <SelectItem value="verification">Document Verification</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
                <SelectItem value="billing">Billing & Pricing</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-600 animate-fade-in">{errors.category}</p>
            )}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="font-medium">
              Message *
            </Label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="Please provide details about your inquiry..."
              rows={6}
              className={`w-full px-3 py-2 border rounded-md resize-none transition-all duration-200 focus:ring-2 focus:ring-[#0077B6] focus:outline-none ${
                errors.message ? "border-red-500 focus:ring-red-200" : "border-input"
              }`}
            />
            {errors.message && (
              <p className="text-sm text-red-600 animate-fade-in">{errors.message}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {formData.message.length}/500 characters
            </p>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#0077B6] to-[#00A8E8] hover:from-[#0066A0] hover:to-[#0088CC] text-white font-medium py-3 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending...</span>
              </div>
            ) : (
              "Send Message"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function CheckIcon(props: any) {
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}