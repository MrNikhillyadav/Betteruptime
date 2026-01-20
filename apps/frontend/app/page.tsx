"use client"

import {
  Activity,
  Bell,
  CheckCircle2,
  Clock,
  Globe,
  Shield,
  Zap,
  ArrowRight,
  BarChart3,
  Lock,
  Smartphone
} from 'lucide-react';
import { useRouter } from 'next/navigation';

function App() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="fixed top-0 w-full bg-gray-950/80 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-8 h-8 text-emerald-500" strokeWidth={2.5} />
            <span className="text-xl font-bold tracking-tight">UptimeWatch</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Features</a>
            <a href="#docs" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Docs</a>
            <button 
              onClick={() => router.push('/signin')}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Sign In</button>
            <button 
              onClick={() => router.push('/signup')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium transition-all text-sm">
              Start Free Trial
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-8">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">99.99% Uptime Guarantee</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-white via-gray-100 to-gray-400 bg-clip-text text-transparent leading-tight">
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
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold transition-all flex items-center gap-2 group text-lg shadow-lg shadow-emerald-500/20">
                Start Monitoring for Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                 onClick={() => router.push('/signup')}
                className="border border-gray-700 hover:border-gray-600 text-white px-8 py-4 rounded-lg font-semibold transition-all text-lg">
                View Live Demo
              </button>
            </div>

            <div className="flex items-center justify-center gap-8 mt-12 text-sm text-gray-500">
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
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent z-10 pointer-events-none"></div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <div className="flex-1 bg-gray-800 rounded px-4 py-2 text-sm text-gray-400">
                  dashboard.uptimewatch.io
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Uptime</span>
                      <Activity className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">99.98%</div>
                    <div className="text-xs text-emerald-500">+0.02% this month</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Response Time</span>
                      <Zap className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">247ms</div>
                    <div className="text-xs text-blue-500">-15ms this month</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Incidents</span>
                      <Bell className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">2</div>
                    <div className="text-xs text-orange-500">This month</div>
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
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
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-900/50 rounded">
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

        <section id="features" className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Everything You Need to Stay Online</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Comprehensive monitoring tools designed for modern infrastructure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: 'Global Monitoring',
                description: 'Monitor from 15+ locations worldwide. Get accurate data from where your users are.',
                color: 'text-blue-500'
              },
              {
                icon: Bell,
                title: 'Smart Alerts',
                description: 'Get notified via Slack, email, SMS, or webhook. Custom alert rules and escalation policies.',
                color: 'text-emerald-500'
              },
              {
                icon: BarChart3,
                title: 'Status Pages',
                description: 'Beautiful, customizable status pages. Keep your users informed during incidents.',
                color: 'text-cyan-500'
              },
              {
                icon: Clock,
                title: 'Incident Management',
                description: 'Track, document, and resolve incidents. Post-mortem reports and timeline views.',
                color: 'text-orange-500'
              },
              {
                icon: Shield,
                title: 'SSL Monitoring',
                description: 'Get alerted before your SSL certificates expire. Automatic renewal tracking.',
                color: 'text-teal-500'
              },
              {
                icon: Smartphone,
                title: 'Mobile Apps',
                description: 'iOS and Android apps. Manage your monitoring on the go with push notifications.',
                color: 'text-rose-500'
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all group">
                <feature.icon className={`w-12 h-12 ${feature.color} mb-4 group-hover:scale-110 transition-transform`} strokeWidth={1.5} />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="bg-gradient-to-br from-emerald-900/20 to-gray-900 rounded-3xl border border-emerald-500/20 p-12 md:p-16 text-center">
            <Lock className="w-16 h-16 text-emerald-500 mx-auto mb-6" strokeWidth={1.5} />
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Trusted by Teams Worldwide</h2>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of companies that rely on UptimeWatch to keep their services running smoothly.
              Enterprise-grade reliability with startup-friendly pricing.
            </p>
            <div className="flex flex-wrap justify-center gap-12 mt-12">
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">99.99%</div>
                <div className="text-sm text-gray-400">Platform Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">10M+</div>
                <div className="text-sm text-gray-400">Checks per Day</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">5,000+</div>
                <div className="text-sm text-gray-400">Active Customers</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">&lt;30s</div>
                <div className="text-sm text-gray-400">Alert Response</div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-800 p-12 md:p-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Start Monitoring in Minutes</h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              No credit card required. 14-day free trial with all features included.
            </p>
            <button 
               onClick={() => router.push('/signup')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-5 rounded-lg font-semibold transition-all flex items-center gap-3 mx-auto group text-lg shadow-lg shadow-emerald-500/20">
              Get Started for Free
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-800 mt-24">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-800">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Activity className="w-6 h-6 text-emerald-500" strokeWidth={2.5} />
              <span className="font-bold">UptimeWatch</span>
            </div>
            <p className="text-sm text-gray-500">© 2024 UptimeWatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
