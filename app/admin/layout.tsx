"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ImageIcon, Settings, ChevronDown, LogOut, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/app/[locale]/contexts/AuthContext"
import { AuthProvider } from "@/app/[locale]/contexts/AuthContext"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)
  const { signOut } = useAuth()

  const menuItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Products",
      href: "/admin/products",
      icon: Package,
    },
    {
      title: "Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      title: "Banners",
      href: "/admin/banners",
      icon: ImageIcon,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed left-0 top-0 z-40 h-screen w-64 transition-transform bg-white border-r",
            !isOpen && "-translate-x-full",
          )}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
              <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden">
                <ChevronDown className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm rounded-lg",
                    pathname === item.href ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.title}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t">
              <button
                onClick={() => signOut()}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className={cn("transition-all duration-300", isOpen ? "lg:ml-64" : "lg:ml-0")}>
          <div className="p-8">{children}</div>
        </div>
      </div>
    </AuthProvider>
  )
}