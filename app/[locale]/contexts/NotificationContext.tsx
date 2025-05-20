"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "./AuthContext"
import { X } from "lucide-react"

type Notification = {
  id: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  created_at: string
}

type NotificationContextType = {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  addNotification: (notification: Omit<Notification, "id" | "created_at">) => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [toasts, setToasts] = useState<Notification[]>([])

  // Fetch notifications when user changes
  useEffect(() => {
    if (user) {
      fetchNotifications()
      subscribeToNotifications()
    } else {
      setNotifications([])
      setUnreadCount(0)
    }
  }, [user])

  // Subscribe to real-time notifications
  const subscribeToNotifications = () => {
    if (!user) return

    const subscription = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification
          setNotifications((prev) => [newNotification, ...prev])
          setUnreadCount((prev) => prev + 1)

          // Show toast for new notification
          setToasts((prev) => [newNotification, ...prev])

          // Auto-remove toast after 5 seconds
          setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== newNotification.id))
          }, 5000)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }

  const fetchNotifications = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20)

      if (error) {
        console.error("Error fetching notifications:", error)
        return
      }

      setNotifications(data || [])
      setUnreadCount(data?.filter((n) => !n.read).length || 0)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  const markAsRead = async (id: string) => {
    if (!user) return

    try {
      const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id).eq("user_id", user.id)

      if (error) {
        console.error("Error marking notification as read:", error)
        return
      }

      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    if (!user) return

    try {
      const { error } = await supabase.from("notifications").update({ read: true }).eq("user_id", user.id)

      if (error) {
        console.error("Error marking all notifications as read:", error)
        return
      }

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const addNotification = async (notification: Omit<Notification, "id" | "created_at">) => {
    if (!user) return

    try {
      const { error } = await supabase.from("notifications").insert({
        ...notification,
        user_id: user.id,
      })

      if (error) {
        console.error("Error adding notification:", error)
      }
    } catch (error) {
      console.error("Error adding notification:", error)
    }
  }

  // Toast notification component
  const ToastNotifications = () => {
    if (toasts.length === 0) return null

    return (
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-md shadow-md flex items-start justify-between ${
              toast.type === "success"
                ? "bg-green-100 text-green-800"
                : toast.type === "error"
                  ? "bg-red-100 text-red-800"
                  : toast.type === "warning"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-blue-100 text-blue-800"
            }`}
          >
            <div>{toast.message}</div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    )
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
      }}
    >
      {children}
      <ToastNotifications />
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
