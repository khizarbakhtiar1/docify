import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function Body() {
  return (
    <div className="w-full bg-white text-gray-900">
      {/* Hero Section */}
      <section className="w-full py-24 md:py-32 border-b border-gray-100">
        <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center space-y-10">
          <div className="inline-flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 text-sm font-medium text-gray-600">
            <span>Docify is now in Public Beta</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl">
            Secure Digital Credential Verification
          </h1>
          
          <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
            The standard for verifiable educational credentials. Secure, instant, and tamper-proof records built on modern blockchain infrastructure.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center h-12 px-8 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Start Verifying
            </Link>
            <Link
              href="/verify"
              className="inline-flex items-center justify-center h-12 px-8 bg-white border border-gray-300 text-gray-900 font-medium rounded-md hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
            >
              Check a Document
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-16 border-b border-gray-100 bg-gray-50/50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-4xl font-bold tracking-tight">1.2M+</h3>
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Documents Verified</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold tracking-tight">500+</h3>
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Institutions</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold tracking-tight">99.9%</h3>
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Accuracy</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold tracking-tight">&lt;3s</h3>
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Avg. Latency</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full py-24 border-b border-gray-100">
        <div className="container px-4 md:px-6 mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight">Built for scale and security</h2>
            <p className="text-gray-500 text-lg">
              Everything you need to issue, manage, and verify credentials globally without vendor lock-in.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 border border-gray-200 rounded-xl bg-white hover:border-gray-300 transition-colors">
              <h3 className="text-xl font-semibold mb-3">Immutable Records</h3>
              <p className="text-gray-500 leading-relaxed">
                Advanced blockchain cryptography ensures credentials can never be altered or forged after issuance.
              </p>
            </div>
            
            <div className="p-8 border border-gray-200 rounded-xl bg-white hover:border-gray-300 transition-colors">
              <h3 className="text-xl font-semibold mb-3">Instant Verification</h3>
              <p className="text-gray-500 leading-relaxed">
                Employers and third parties can verify credentials in milliseconds through our public verification portal.
              </p>
            </div>
            
            <div className="p-8 border border-gray-200 rounded-xl bg-white hover:border-gray-300 transition-colors">
              <h3 className="text-xl font-semibold mb-3">Global Standard</h3>
              <p className="text-gray-500 leading-relaxed">
                Issue Soul-Bound Tokens (SBTs) that adhere to modern Web3 credential standards recognized worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-24 bg-gray-50 border-b border-gray-100">
        <div className="container px-4 md:px-6 mx-auto space-y-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Trusted by leading organizations</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 bg-white border border-gray-200 rounded-xl space-y-6">
              <blockquote className="text-gray-700 text-lg leading-relaxed">
                "Docify transformed our credential verification process. What used to take weeks now happens in seconds."
              </blockquote>
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                <Avatar className="w-10 h-10 border border-gray-200">
                  <AvatarFallback className="bg-gray-100 text-gray-900 font-medium">SC</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">Dr. Sarah Chen</p>
                  <p className="text-xs text-gray-500">Registrar, Stanford University</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 bg-white border border-gray-200 rounded-xl space-y-6">
              <blockquote className="text-gray-700 text-lg leading-relaxed">
                "The security and reliability of Docify gives us complete confidence in every background check."
              </blockquote>
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                <Avatar className="w-10 h-10 border border-gray-200">
                  <AvatarFallback className="bg-gray-100 text-gray-900 font-medium">MJ</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">Michael Johnson</p>
                  <p className="text-xs text-gray-500">HR Director, TechCorp</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 bg-white border border-gray-200 rounded-xl space-y-6 md:col-span-2 lg:col-span-1">
              <blockquote className="text-gray-700 text-lg leading-relaxed">
                "As a student, sharing my verified credentials with employers is incredibly simple and native."
              </blockquote>
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                <Avatar className="w-10 h-10 border border-gray-200">
                  <AvatarFallback className="bg-gray-100 text-gray-900 font-medium">ER</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">Emily Rodriguez</p>
                  <p className="text-xs text-gray-500">CS Graduate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 bg-black text-white">
        <div className="container px-4 md:px-6 mx-auto text-center space-y-8 max-w-3xl">
          <h2 className="text-4xl font-bold tracking-tight">Ready to modernize your credentials?</h2>
          <p className="text-xl text-gray-400">
            Join the network of institutions leveraging blockchain for verifiable data.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link
              href="/register"
              className="inline-flex items-center justify-center h-12 px-8 bg-white text-black font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              Get Started for Free
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-12 px-8 bg-transparent border border-gray-600 text-white font-medium rounded-md hover:bg-gray-900 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
