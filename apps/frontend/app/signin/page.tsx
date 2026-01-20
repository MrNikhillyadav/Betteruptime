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
import { BACKEND_URL } from "@/lib/utils"

interface SignInResponse {
  token: string
}

interface ApiError {
  error: string
}

export default function SignInPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")  
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const res = await axios.post<SignInResponse, { data: SignInResponse }, { username: string; password: string }>(
        `${BACKEND_URL}/signin`,
        {
          username, 
          password
        },
        {
          timeout: 5000 
        }
      )

      await localStorage.setItem("token", res.data.token)
      
      router.push("/dashboard")
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        setError(err.response.data.error || "Invalid username or password")
      } else if (axios.isAxiosError(err) && err.response?.status === 500) {
        setError("Server error. Please try again later.")
      } else {
        setError("Network error. Please check your connection.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="bg-gray-900 min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">BetterUptime</span>
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription className="mt-2">
              Sign in with your username to continue
            </CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg border">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="johndoe@gmail.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link 
                  href="/reset-password" 
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              
              <div className="flex items-center justify-between">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="**********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="pr-10"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col mt-6 gap-4">
            <Button type="submit" className="w-full" disabled={isLoading || !username || !password}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
