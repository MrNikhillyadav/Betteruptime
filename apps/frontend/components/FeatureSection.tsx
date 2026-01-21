import { BarChart3, Bell, Clock, Globe, Shield, Smartphone } from "lucide-react";

export function FeatureSection(){
    return (
         <section id="features" className=" max-w-7xl mx-auto px-6 py-24 ">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-wider">Everything You Need to Stay Online</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Comprehensive monitoring tools designed for modern infrastructure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 bg-[#191919]">
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
                description: 'Get alerted before your SSL certificates expire. Automatic renewal tracking:wider ',
                color: 'text-teal-500'
              },
              {
                icon: Smartphone,
                title: 'Mobile Apps',
                description: 'iOS and Android apps. Manage your monitoring on the go with push notifications.',
                color: 'text-rose-500'
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-[#191919] p-8 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all group">
                <feature.icon className={`w-12 h-12 ${feature.color} mb-4 group-hover:scale-110 transition-transform`} strokeWidth={1.5} />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
    )
}