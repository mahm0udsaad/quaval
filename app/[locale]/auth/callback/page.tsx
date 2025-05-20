"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if this is an email confirmation
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get("access_token")

    if (accessToken) {
      // This is a successful auth callback (either OAuth or email confirmation)
      // Get redirect path from localStorage or default to home
      const redirectPath = localStorage.getItem("redirectPath") || "/"
      localStorage.removeItem("redirectPath") // Clear after use
      localStorage.removeItem("confirmationEmail") // Clear confirmation email

      // Small delay to ensure auth state is updated
      const timer = setTimeout(() => {
        router.push(redirectPath)
      }, 1000)

      return () => clearTimeout(timer)
    } else {
      // If no access token, redirect to sign in
      router.push("/auth/signin")
    }
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-gray-600">Completing authentication...</p>
    </div>
  )
}
