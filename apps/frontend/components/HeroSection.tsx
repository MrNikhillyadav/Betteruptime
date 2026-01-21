"use client";

import { ArrowRight, Bell, CheckCircle2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { Activity } from "lucide-react";
import { FeatureSection } from "./FeatureSection";
import { TestimonialSection } from "./TestimonialSection";

export function HeroSection(){
    const router = useRouter();
    return (
          <main className="pt-20">
        <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-8">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">99.99% Uptime Guarantee</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-wide mb-6 bg-gradient-to-br from-white via-gray-100 to-gray-400 bg-clip-text text-transparent leading-tight">
              Monitor Your Infrastructure
              <br />
              <span className="text-emerald-500">Before Issues Strike</span>
            </h1>

            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Get instant alerts when your websites, APIs, and services go down.
              Beautiful status pages that keep your users informed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                 onClick={() => router.push('/signup')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 cursor-pointer rounded-lg font-normal transition-all flex items-center gap-2 group text-lg shadow-lg shadow-emerald-500/20">
                Start Monitoring for Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                 onClick={() => router.push('/signup')}
                className="border border-emerald-700 hover:border-emrald-600 text-white cursor-pointer hover:bg-zinc-900 px-8 font-normal py-4 rounded-lg transition-all text-lg">
                View Live Demo
              </button>
            </div>

            <div className="flex items-center justify-center gap-8 mt-12 text-md text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>14-day free trial</span>
              </div>
            </div>
          </div>

          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-transparent to-transparent z-10 pointer-events-none"></div>
            <div className="bg-gradient-to-br from-[#171717] to-[#181818] rounded-2xl border border-gray-800 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <div className="flex-1 bg-[#191919] rounded px-4 py-2 text-sm text-gray-400">
                  dashboard.uptimewatch.io
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#191919] rounded-lg p-6 border border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Uptime</span>
                      <Activity className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">99.98%</div>
                    <div className="text-xs text-emerald-500">+0.02% this month</div>
                  </div>
                  <div className="bg-[#191919] rounded-lg p-6 border border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Response Time</span>
                      <Zap className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">247ms</div>
                    <div className="text-xs text-blue-500">-15ms this month</div>
                  </div>
                  <div className="bg-[#191919] rounded-lg p-6 border border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Incidents</span>
                      <Bell className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">2</div>
                    <div className="text-xs text-orange-500">This month</div>
                  </div>
                </div>
                <div className="bg-[#191919] rounded-lg p-6 border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-300">Monitored Services</span>
                    <span className="text-xs text-gray-500">Last 30 days</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: 'Production API', status: 'operational', uptime: '100%' },
                      { name: 'Marketing Website', status: 'operational', uptime: '99.99%' },
                      { name: 'Payment Gateway', status: 'operational', uptime: '99.95%' },
                      { name: 'CDN Service', status: 'degraded', uptime: '99.82%' }
                    ].map((service, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-[#171717] rounded">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${service.status === 'operational' ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
                          <span className="text-sm text-gray-300">{service.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-gray-500">{service.uptime} uptime</span>
                          <span className={`text-xs px-2 py-1 rounded ${service.status === 'operational' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                            {service.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

       <FeatureSection/>
       <TestimonialSection/>

        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="bg-linear-to-r from-[bg-[#191919]] to-gray-850 rounded-3xl border border-gray-800 p-12 md:p-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-wider">Start Monitoring in Minutes</h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              No credit card required. 14-day free trial with all features included.
            </p>
            <button 
               onClick={() => router.push('/signup')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-5 rounded-lg font-medium transition-all flex items-center gap-3 mx-auto group text-lg shadow-lg shadow-emerald-500/20">
              Get Started for Free
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>
      </main>
    )
}