"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../../lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let ignore = false
    let intervalId: NodeJS.Timeout | null = null

    const checkSessionAndRedirect = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        console.log("[Login] Session check:", { session: data.session, error })
        
        if (!ignore && data.session && !error) {
          console.log("[Login] Valid session found, redirecting to dashboard")
          router.push("/Dashboard")
          return true
        }
        return false
      } catch (err) {
        console.error("[Login] Session check error:", err)
        return false
      }
    }

    const handleMagicLinkCallback = async () => {
      console.log("[Login] Handling magic link callback")
      
      // Wait for auth to process the magic link
      let attempts = 0
      const maxAttempts = 10
      
      intervalId = setInterval(async () => {
        attempts++
        console.log(`[Login] Magic link attempt ${attempts}/${maxAttempts}`)
        
        const sessionFound = await checkSessionAndRedirect()
        
        if (sessionFound || attempts >= maxAttempts) {
          if (intervalId) {
            clearInterval(intervalId)
            intervalId = null
          }
          setLoading(false)
        }
      }, 1000)
    }

    const initializeAuth = async () => {
      const url = new URL(window.location.href)
      const hasAuthParams = 
        url.searchParams.get("access_token") ||
        url.searchParams.get("refresh_token") ||
        url.searchParams.get("type") === "magiclink" ||
        url.hash.includes("access_token") ||
        url.hash.includes("type=magiclink")

      console.log("[Login] Auth params detected:", hasAuthParams)
      console.log("[Login] URL:", window.location.href)

      if (hasAuthParams) {
        // Magic link callback - wait for session
        await handleMagicLinkCallback()
      } else {
        // Regular page load - check existing session
        await checkSessionAndRedirect()
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[Login] Auth state change:", { event, session: !!session })
      
      if (event === "SIGNED_IN" && session && !ignore) {
        console.log("[Login] Sign in detected, redirecting to dashboard")
        if (intervalId) {
          clearInterval(intervalId)
          intervalId = null
        }
        router.push("/Dashboard")
      }
      
      if (event === "TOKEN_REFRESHED" && session && !ignore) {
        console.log("[Login] Token refreshed, redirecting to dashboard")
        router.push("/Dashboard")
      }
    })

    return () => {
      ignore = true
      if (intervalId) {
        clearInterval(intervalId)
      }
      subscription.unsubscribe()
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("sending")
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // Make sure the redirect URL points back to your login page
          emailRedirectTo: `${window.location.origin}/login`
        }
      })

      if (error) {
        console.error("Magic link error:", error.message)
        setStatus("error")
      } else {
        setStatus("sent")
      }
    } catch (err) {
      console.error("Unexpected error:", err)
      setStatus("error")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-indigo-900 p-4">
        <Card className="w-full max-w-md shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Checking session...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-sm text-gray-600">
              Please wait while we verify your login status.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-indigo-900 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Sign in with Magic Link
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={status === "sending"}>
              {status === "sending" ? "Sending..." : "Send Magic Link"}
            </Button>
            {status === "sent" && (
              <p className="text-green-600 text-sm mt-2">
                ✅ Magic link sent! Please check your inbox and click the link to sign in.<br />
                <span className="text-xs text-gray-400">
                  After clicking the link, you will be redirected and logged in automatically.
                </span>
              </p>
            )}
            {status === "error" && (
              <p className="text-red-500 text-sm mt-2">
                ❌ Failed to send magic link. Please try again.
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}