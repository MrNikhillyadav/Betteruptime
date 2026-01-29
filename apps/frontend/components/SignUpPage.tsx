"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Eye, EyeOff, Loader2 } from "lucide-react"
import axios from "axios"
import { NEXT_PUBLIC_API_URL } from "@/lib/utils"

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters long")
      return
    }

    setIsLoading(true)

    try {
      const res = await axios.post(`${NEXT_PUBLIC_API_URL}/signup`,{
        username: email,
        password
      })
      
      console.log("res.data.message:" ,res.data.message);

      router.push("/signin")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#171717] text-gray-100 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md  bg-gradient-to-br from-[#171717] to-[#171717] border border-gray-700 shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-emerald-500" strokeWidth={2.5} />
              <span className="text-3xl font-bold tracking-wide text-gray-300">BetterUptime</span>
            </div>
          </div>
          <div>
            <CardTitle className="text-xl font-bold tracking-wide text-gray-300">Create an account</CardTitle>
            <CardDescription className="mt-2 tracking-wide text-md text-gray-400">
              Start monitoring your services in minutes
            </CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-4 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 text-md tracking-wide">Username</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="bg-gray-800/50 border-gray-700  tracking-wide text-gray-100 placeholder-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-300  text-md tracking-wide">Password</Label>
                <span className="text-xs text-gray-500">Must be at least 4 characters</span>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="pr-12 bg-gray-800/50 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 p-0  text-md tracking-wide text-gray-500 hover:text-gray-300 hover:bg-gray-700/50"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col mt-6 gap-4 px-6 pb-6">
            <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600   text-md tracking-wide shadow-lg shadow-emerald-500/20 transition-all" disabled={isLoading || !email || !password}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin  text-md tracking-wide" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
            <p className="text-sm text-center text-gray-500  text-md tracking-wide">
              Already have an account?{" "}
              <Link href="/signin" className="text-emerald-400  text-md tracking-wide hover:text-emerald-300 font-medium hover:underline transition-colors">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
