"use client"

import { Instrument_Serif } from "next/font/google";
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
import { NEXT_PUBLIC_API_URL } from "@/lib/utils"

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
});


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

export function DashboardPage() {
  const router = useRouter()
  const [websites, setWebsites] = useState<ApiWebsite[]>([])
  console.log("websites: ", websites)
  const [isLoading, setIsLoading] = useState(true)
  const [newUrl, setNewUrl] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAddingWebsite, setIsAddingWebsite] = useState(false)
  const [urlError, setUrlError] = useState("")
  const [error, setError] = useState("")

  const fetchWebsites = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/")
        return
      }

      const res = await axios.get<ApiWebsite[]>(`${NEXT_PUBLIC_API_URL}/website`, {
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

  useEffect(() => {
    fetchWebsites()
    // Refetch every 10 seconds
    const interval = setInterval(fetchWebsites, 90 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  async function handleSignOut (){
    setIsLoading(true);
    await localStorage.removeItem("token")
    
    setTimeout(async() =>{
      router.push("/")
    },500)
    
    setIsLoading(false);
    return;
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
      }>(`${NEXT_PUBLIC_API_URL}/website`, { url: urlToAdd }, {
        headers: { token }
      })

      // Refresh full list from backend
      await fetchWebsites()
      
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
      const deleteRes = await axios.delete(`${NEXT_PUBLIC_API_URL}/website/${websiteId}`, {
        headers: { token }
      })

      console.log("deleteRes: ", deleteRes)

      // Refresh list
      await fetchWebsites()
    } 
    catch (err: any) {
       if (err.response?.status === 401) {
        localStorage.removeItem("token")
        router.push("/signin")
      } else if (err.response?.status === 500) {
        setUrlError("Internal Server error")
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

  const getDisplayUrl = (url: string): string => {
    try {
      return new URL(url).hostname
    } catch {
      return url
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#171717]">
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          Loading your websites...
        </div>
      </main>
    )
  }

  return (
    <main className={`min-h-screen bg-[#171717]  ${instrumentSerif.className}`}>
      <header className="border-b border-emerald-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div 
            onClick={() => router.push("/")}
            className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-emerald-500" />
            <span className="text-2xl tracking-wider font-bold  text-white cursor-pointer">BetterUptime</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut} className=" bg-emerald-500 text-md border-none cursor-pointer tracking-wide text-white hover:bg-emerald-400 hover:text-white">
            Sign out
          </Button>
        </div>
      </header>

      <div className="container tracking-wider mx-auto px-4 py-8 max-w-4xl">
        {error && (
          <div className="mb-6 p-4 text-sm text-red-400 bg-red-500/10 rounded-lg border border-red-500/30">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-wider text-zinc-100">Monitors</h1>
              <p className="text-gray-400 text-lg">Track the uptime and response time of your websites</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-500 text-md hover:bg-emerald-400 cursor-pointer">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Monitors
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#222222] text-white border-emerald-700">
                <DialogHeader>
                  <DialogTitle className={ `${instrumentSerif.className} text-2xl` }>Add a website to monitor</DialogTitle>
                  <DialogDescription className={ `${instrumentSerif.className} text-gray-300 text-md` } >
                    Enter the URL of the website you want to track. We'll check its status every 30 seconds.
                  </DialogDescription>
                </DialogHeader>
                <div className={`space-y-4 py-4 ${instrumentSerif.className}`}>
                  <div className="space-y-2">
                    <Label htmlFor="url" className="text-white text-sm">Website URL</Label>
                    <Input
                      id="url"
                      placeholder="https://example.com"
                      value={newUrl}
                      onChange={(e) => {
                        setNewUrl(e.target.value)
                        setUrlError("")
                      }}
                      className="bg-[#222222] border-emerald-600 text-white text-xl font-semibold tracking-wider placeholder-gray-400 focus:border-blue-500 focus:ring-emerald-500"
                    />
                    {urlError && (
                      <p className="text-md text-red-400">{urlError}</p>
                    )}
                  </div>
                </div>
                <DialogFooter  className={ `${instrumentSerif.className}` }>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)} 
                    className="border-emerald-600 text-gray-900 text-sm tracking-wide  hover:bg-gray-200 cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddWebsite} disabled={isAddingWebsite || !newUrl.trim()} className="bg-blue-600 cursor-pointer tracking-wide hover:bg-blue-700">
                    {isAddingWebsite ? "Adding..." : "Add Website"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {websites.length === 0 ? (
            <Card className={`${instrumentSerif.className} tracking-wider bg-[#222222] border-emerald-700`}>
              <CardHeader className="text-center py-12">
                <div className="mx-auto w-12 h-12 rounded-full bg-emerald-700 flex items-center justify-center mb-4">
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
            <Card className="bg-[#222222] border-gray-700 overflow-hidden mx-auto max-w-4xl p-8">
              <CardContent className="p-2">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-gray-700 hover:bg-gray-700/50 text-lg ">
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
                          <TableRow key={website.id} className="border-b text-lg border-gray-700 hover:bg-gray-700/50">
                            <TableCell>
                              {latest ? getStatusIndicator(latest.status) : <span className="text-yellow-500">🟡</span>}
                            </TableCell>
                            <TableCell>
                              <a
                                href={website.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-zinc-200 hover:text-blue-300 font-medium"
                              >
                                {getDisplayUrl(website.url)}
                                <ExternalLink className="h-4 w-4" />
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
                            <TableCell className="text-right ">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteWebsite(website.id)}
                                className="text-red-400 hover:text-red-300 cursor-pointer hover:bg-red-500/10 h-8 w-8 p-0"
                              >
                                <Trash2 className="h-4 w-4 cursor-pointer" />
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
