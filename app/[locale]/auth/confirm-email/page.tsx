"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Mail, CheckCircle, ArrowRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

export default function ConfirmEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [email, setEmail] = useState<string>("")
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  useEffect(() => {
    // Get email from URL params or localStorage
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
      localStorage.setItem("confirmationEmail", emailParam)
    } else {
      const storedEmail = localStorage.getItem("confirmationEmail")
      if (storedEmail) {
        setEmail(storedEmail)
      }
    }
  }, [searchParams])

  const handleResendEmail = async () => {
    if (!email) return

    setIsResending(true)
    setResendSuccess(false)

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      })

      if (error) {
        console.error("Error resending confirmation email:", error)
      } else {
        setResendSuccess(true)
      }
    } catch (err) {
      console.error("Unexpected error:", err)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-W3AYNZkfFMTjKw4qXp4fHkySoTb6oo.png"
              alt="Quaval Bearings Logo"
              width={180}
              height={40}
              className="h-10 w-auto"
            />
          </div>
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Confirm Your Email</CardTitle>
          <CardDescription className="text-center">
            We've sent a confirmation link to your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-blue-800 font-medium mb-1">Please check your inbox</p>
            {email && <p className="text-blue-700 font-semibold">{email}</p>}
          </div>

          <div className="space-y-4">
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-medium text-gray-700 mb-2">What to do next:</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Check your email inbox (and spam folder)</li>
                <li>Click the confirmation link in the email</li>
                <li>Once confirmed, you can sign in to your account</li>
              </ol>
            </div>

            {resendSuccess && (
              <div className="flex items-center text-green-600 bg-green-50 p-3 rounded-md">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Confirmation email resent successfully!</span>
              </div>
            )}

            <div className="text-center">
              <p className="text-gray-500 mb-2">Didn't receive the email?</p>
              <Button variant="outline" onClick={handleResendEmail} disabled={isResending || !email} className="w-full">
                {isResending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Resending...
                  </>
                ) : (
                  "Resend Confirmation Email"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-gray-600 text-center">Already confirmed your email?</div>
          <Button asChild className="w-full">
            <Link href="/auth/signin">
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
