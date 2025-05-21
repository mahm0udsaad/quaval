import { AuthProvider } from "./[locale]/contexts/AuthContext"
import "./globals.css"
import type React from "react"

export const metadata = {
  title: "Quaval Bearings - High-Quality Industrial Bearings",
  description:
    "Quaval Bearings specializes in high-quality industrial bearings, offering precision and reliability for various applications.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
