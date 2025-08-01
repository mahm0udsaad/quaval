"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ImageIcon, Settings, ChevronDown, LogOut, ShoppingCart, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/app/[locale]/contexts/AuthContext"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false) // Collapsed by default
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
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white rounded-md shadow-md border"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        onMouseEnter={() => window.innerWidth >= 1024 && setSidebarOpen(true)}
        onMouseLeave={() => window.innerWidth >= 1024 && setSidebarOpen(false)}
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-white border-r shadow-lg transition-all duration-300",
          "w-64 lg:w-20",
          sidebarOpen && "lg:w-64",
          !sidebarOpen && "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b h-16">
            <h1 className={cn("text-xl font-bold text-primary whitespace-nowrap overflow-hidden", !sidebarOpen && "lg:hidden")}>Admin Panel</h1>
            <div className={cn("flex-shrink-0", sidebarOpen && "lg:hidden")}>
              {/* You can put a small logo here */}
              <LayoutDashboard className="w-6 h-6 text-primary" />
            </div>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm rounded-lg transition-colors",
                    isActive 
                      ? "bg-primary text-white shadow-sm" 
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                    !sidebarOpen && "lg:justify-center"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 flex-shrink-0", sidebarOpen && "mr-3")} />
                  <span className={cn("whitespace-nowrap", !sidebarOpen && "lg:hidden")}>{item.title}</span>
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t">
            <button
              onClick={() => signOut()}
              className={cn(
                "flex items-center w-full px-4 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors",
                !sidebarOpen && "lg:justify-center"
              )}
            >
              <LogOut className={cn("w-5 h-5 flex-shrink-0", sidebarOpen && "mr-3")} />
              <span className={cn("whitespace-nowrap", !sidebarOpen && "lg:hidden")}>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className={cn(
        "min-h-screen transition-all duration-300",
        "lg:ml-20",
        sidebarOpen && "lg:ml-64"
      )}>
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">{children}</div>
      </div>
    </div>
  )
}
