"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Plus, ExternalLink, Trash2, Loader2 } from "lucide-react"
import axios from "axios"
import { BACKEND_URL } from "@/lib/utils"

interface Website {
  id: string
  url: string
  userId: string
}

interface WebsiteTick {
  id: string
  responseTimeMs: number
  status: "Up" | "Down" | "Unknown"
  createdAt: string
}

interface ApiWebsite {
  id: string
  url: string
  userId: string
  ticks: WebsiteTick[]
}

export default function DashboardPage() {
  const router = useRouter()
  const [websites, setWebsites] = useState<ApiWebsite[]>([])
  console.log("websites: ", websites)
  const [isLoading, setIsLoading] = useState(true)
  const [newUrl, setNewUrl] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAddingWebsite, setIsAddingWebsite] = useState(false)
  const [urlError, setUrlError] = useState("")
  const [error, setError] = useState("")

  // Fetch user's websites from backend
  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/signin")
          return
        }

        const res = await axios.get<ApiWebsite[]>(`${BACKEND_URL}/website`, {
          headers: { token }
        })
        console.log("fetched websites: ",res.data)
        setWebsites(res.data)
      } catch (err: any) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token")
          router.push("/signin")
        } else {
          setError("Failed to load websites")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchWebsites()
  }, [router])

  const handleSignOut = () => {
    localStorage.removeItem("token")
    router.push("/signin")
  }

  const validateUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url)
      return urlObj.protocol === "http:" || urlObj.protocol === "https:"
    } catch {
      return false
    }
  }

  const handleAddWebsite = async () => {
    setUrlError("")
    setError("")

    let urlToAdd = newUrl.trim()
    if (!urlToAdd.startsWith("http://") && !urlToAdd.startsWith("https://")) {
      urlToAdd = `https://${urlToAdd}`
    }

    if (!validateUrl(urlToAdd)) {
      setUrlError("Please enter a valid URL")
      return
    }

    setIsAddingWebsite(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No token")

      const res = await axios.post<{
        id: string
        userId: string
      }>(`${BACKEND_URL}/website`, { url: urlToAdd }, {
        headers: { token }
      })

      // Refresh full list from backend
      const updatedRes = await axios.get<ApiWebsite[]>(`${BACKEND_URL}/websites`, {
        headers: { token }
      })
      setWebsites(updatedRes.data)
      console.log("updatedRes.status: ", updatedRes.status);
      console.log("updatedRes.data: ", updatedRes.data);
      
      setIsDialogOpen(false)
      setNewUrl("")
    } 
    catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token")
        router.push("/signin")
      } else if (err.response?.status === 411) {
        setUrlError("URL is required")
      } else {
        setError("Failed to add website")
      }
    } finally {
      setIsAddingWebsite(false)
    }
  }

  const handleDeleteWebsite = async (websiteId: string) => {
    if (!confirm("Are you sure you want to delete this website?")) return

    try {
      const token = localStorage.getItem("token")
      await axios.delete(`${BACKEND_URL}/website/${websiteId}`, {
        headers: { token }
      })

      // Refresh list
      const res = await axios.get<ApiWebsite[]>(`${BACKEND_URL}/websites`, {
        headers: { token }
      })
      setWebsites(res.data) // Fixed: was res.res
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token")
        router.push("/signin")
      } else {
        setError("Failed to delete website")
      }
    }
  }

  const getLatestStatus = (ticks: WebsiteTick[]): { status: string; responseTimeMs: number; time: string } | null => {
    if (ticks.length === 0) return null
   
    const latest = ticks[0]  // Already ordered by createdAt desc in backend
    return {
      status: latest.status,
      responseTimeMs: latest.responseTimeMs,
      time: new Date(latest.createdAt).toLocaleString()
    }
  }

const getStatusIndicator = (status: string) => {
  const getColors = (status: string) => {
    switch (status) {
      case "Up": return { dot: "bg-green-500", pulse: "bg-green-400" }
      case "Down": return { dot: "bg-red-500", pulse: "bg-red-400" }
      default: return { dot: "bg-yellow-500", pulse: "bg-yellow-400" }
    }
  }

  const colors = getColors(status)

  return (
    <div className="flex items-center gap-2">
      <div className="relative inline-flex ">
        <div className={`relative h-3 w-3 rounded-full ${colors.dot} shadow-sm border border-white/20`} />
      </div>
      <span className="text-xs font-medium capitalize text-gray-400">
        {status}
      </span>
    </div>
  )
}


  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          Loading your websites...
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-900">
      <header className="border-b border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold text-white">BetterUptime</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut} className="border-gray-600 text-gray-300 hover:bg-gray-800">
            Sign out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {error && (
          <div className="mb-6 p-4 text-sm text-red-400 bg-red-500/10 rounded-lg border border-red-500/30">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Monitors</h1>
              <p className="text-gray-400">Track the uptime and response time of your websites</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Monitors
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 text-white border-gray-700">
                <DialogHeader>
                  <DialogTitle>Add a website to monitor</DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Enter the URL of the website you want to track. We'll check its status every 30 seconds.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="url" className="text-white">Website URL</Label>
                    <Input
                      id="url"
                      placeholder="https://example.com"
                      value={newUrl}
                      onChange={(e) => {
                        setNewUrl(e.target.value)
                        setUrlError("")
                      }}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {urlError && (
                      <p className="text-sm text-red-400">{urlError}</p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    Cancel
                  </Button>
                  <Button onClick={handleAddWebsite} disabled={isAddingWebsite || !newUrl.trim()} className="bg-blue-600 hover:bg-blue-700">
                    {isAddingWebsite ? "Adding..." : "Add Website"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {websites.length === 0 ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="text-center py-12">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-gray-500" />
                </div>
                <CardTitle className="text-white">No websites yet</CardTitle>
                <CardDescription className="text-gray-400">
                  Add your first website to start monitoring its uptime and response time.
                </CardDescription>
                <div className="pt-4">
                  <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add your first website
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ) : (
            <Card className="bg-gray-800 border-gray-700  overflow-hidden mx-auto max-w-4xl p-8">
              <CardContent className="p-2">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-gray-700 hover:bg-gray-700/50 ">
                        <TableHead className="text-gray-300 font-semibold">Status</TableHead>
                        <TableHead className="text-gray-300 font-semibold">URL</TableHead>
                        <TableHead className="text-gray-300 font-semibold">Response Time</TableHead>
                        <TableHead className="text-gray-300 font-semibold">Last Checked</TableHead>
                        <TableHead className="text-right text-gray-300 font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {websites.map((website) => {
                        const latest = getLatestStatus(website.ticks)
                        return (
                          <TableRow key={website.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                            <TableCell>
                              {latest ? getStatusIndicator(latest.status) : <span className="text-yellow-500">🟡</span>}
                            </TableCell>
                            <TableCell>
                              <a
                                href={website.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-zinc-200 hover:text-blue-300  font-medium"
                              >
                                {website.url}
                              </a>
                            </TableCell>
                            <TableCell>
                              {latest ? (
                                <span className={
                                  latest.responseTimeMs < 500 ? "text-green-400" :
                                  latest.responseTimeMs < 1000 ? "text-yellow-400" : "text-red-400"
                                }>
                                  {latest.responseTimeMs} ms
                                </span>
                              ) : (
                                <span className="text-gray-500">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {latest ? (
                                <span className="text-sm text-gray-400">
                                  {latest.time}
                                </span>
                              ) : (
                                <span className="text-gray-500">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteWebsite(website.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
