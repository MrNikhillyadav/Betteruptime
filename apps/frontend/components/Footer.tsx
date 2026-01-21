import { Activity } from "lucide-react";


export function Footer(){
    return (
         <footer className="border-t border-gray-800 mt-24">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4 text-md tracking-wide">Product</h4>
              <ul className="space-y-2 text-md tracking-wide text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-md tracking-wide">Company</h4>
              <ul className="space-y-2 text-md tracking-wide text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-md tracking-wide">Resources</h4>
              <ul className="space-y-2 text-md tracking-wide text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-md tracking-wide">Legal</h4>
              <ul className="space-y-2 text-md tracking-wide text-gray-400">
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
            <p className="text-md tracking-wide text-gray-500">© 2026 UptimeWatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
}