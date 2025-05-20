"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"
import Link from "next/link"
import { useTranslate } from "@/lib/i18n-client"

export default function CheckoutCancelPage() {
  const { t } = useTranslate()
  
  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl">{t('checkout.paymentCancelled')}</CardTitle>
          <CardDescription>{t('checkout.cancellationMessage')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
            {t('checkout.cartItemsSaved')}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button asChild>
            <Link href="/checkout">{t('checkout.tryAgain')}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/cart">{t('checkout.backToCart')}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
