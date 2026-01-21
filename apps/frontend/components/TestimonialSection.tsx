import { Lock } from "lucide-react";

export function TestimonialSection(){
    return (
         <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="bg-[#191919] rounded-3xl border border-emerald-500/20 p-12 md:p-16 text-center">
            <Lock className="w-16 h-16 text-emerald-500 mx-auto mb-6" strokeWidth={1.5} />
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-wider">Trusted by Teams Worldwide</h2>
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
    )
}