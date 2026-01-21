"use client";


import { useCheckUserLoggedIn } from "@/app/hook/useCheckUserLoggedIn";
import { Activity } from "lucide-react";
import { useRouter } from "next/navigation";

export function NavLandingPage(){
  const isLoggedIn = useCheckUserLoggedIn();
    const router = useRouter();
    
    return (
          <nav className="fixed top-0 w-full  bg-[#171717]  backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-8 h-8 text-emerald-500" strokeWidth={2.5} />
            <span className="text-3xl font-bold tracking-wider">UptimeWatch</span>
          </div>
          { isLoggedIn ? 
            <button 
                onClick={() => router.push('/dashboard')}
                className="text-gray-300 cursor-pointer outline hover:text-white transition-colors text-md px-6 py-2 rounded-lg  tracking-wider font-medium">Dashboard</button>          
            : (
                <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-gray-300 cursor-pointer hover:text-white transition-colors text-md tracking-wider font-medium">Features</a>
                <a href="#docs" className="text-gray-300 hover:text-white transition-colors text-md tracking-wider font-medium">Docs</a>
                <button 
                  onClick={() => router.push('/signin')}
                  className="text-gray-300 cursor-pointer hover:text-white transition-colors text-md tracking-wider font-medium">Sign In</button>
                <button 
                  onClick={() => router.push('/signup')}
                  className="bg-emerald-500 cursor-pointer hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium transition-all text-md"tracking-wider >
                  Start Free Trial
                </button>
              </div>
          )}
        </div>
      </nav>
    )
}