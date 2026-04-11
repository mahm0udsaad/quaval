"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const finishAuth = async () => {
      const url = new URL(window.location.href)
      const code = url.searchParams.get("code")
      const errorDescription =
        url.searchParams.get("error_description") ||
        new URLSearchParams(window.location.hash.substring(1)).get("error_description")

      if (errorDescription) {
        router.push(`/auth/signin?error=${encodeURIComponent(errorDescription)}`)
        return
      }

      // PKCE flow: exchange the ?code=... for a session.
      // Supabase's detectSessionInUrl may race us, so check for an existing
      // session first and only exchange if nothing is there yet.
      if (code) {
        const existing = await supabase.auth.getSession()
        if (!existing.data.session) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error && !/already.*used|code verifier/i.test(error.message)) {
            router.push(`/auth/signin?error=${encodeURIComponent(error.message)}`)
            return
          }
        }
      } else {
        // Legacy implicit flow fallback: #access_token=...
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get("access_token")
        if (!accessToken) {
          // Nothing to do — not a real callback
          router.push("/auth/signin")
          return
        }
      }

      // Confirm a session is actually present before routing away
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.push("/auth/signin?error=Authentication%20failed")
        return
      }

      const redirectPath = localStorage.getItem("redirectPath") || "/"
      localStorage.removeItem("redirectPath")
      localStorage.removeItem("confirmationEmail")
      router.push(redirectPath)
    }

    finishAuth()
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-gray-600">Completing authentication...</p>
    </div>
  )
}
