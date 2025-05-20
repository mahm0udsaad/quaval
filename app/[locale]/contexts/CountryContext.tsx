"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./AuthContext"
import { supabase } from "@/lib/supabase"

type CountryContextType = {
  selectedCountry: string | null
  setSelectedCountry: (country: string) => void
}

const CountryContext = createContext<CountryContextType | undefined>(undefined)

export function CountryProvider({ children }: { children: ReactNode }) {
  const [selectedCountry, setSelectedCountryState] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    // Get country from localStorage on initial load
    const storedCountry = localStorage.getItem("selectedCountry")
    if (storedCountry) {
      setSelectedCountryState(storedCountry)
    } else {
      // Default to Canada if no country is selected
      setSelectedCountryState("canada")
      localStorage.setItem("selectedCountry", "canada")
    }
    setIsLoaded(true)
  }, [])

  // Load user preferences from Supabase when user logs in
  useEffect(() => {
    const loadUserPreferences = async () => {
      if (user) {
        try {
          const { data, error } = await supabase.from("user_settings").select("country").eq("user_id", user.id).single()

          if (data && !error && data.country) {
            setSelectedCountryState(data.country)
            localStorage.setItem("selectedCountry", data.country)
          }
        } catch (error) {
          console.error("Error loading user preferences:", error)
        }
      }
    }

    loadUserPreferences()
  }, [user])

  // Custom setter that also saves to localStorage and Supabase
  const setSelectedCountry = async (country: string) => {
    setSelectedCountryState(country)
    localStorage.setItem("selectedCountry", country)

    // Save to Supabase if user is logged in
    if (user) {
      try {
        const { error } = await supabase.from("user_settings").upsert(
          {
            user_id: user.id,
            country: country,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        )

        if (error) {
          console.error("Error saving user preferences:", error)
        }
      } catch (error) {
        console.error("Error saving user preferences:", error)
      }
    }
  }

  // Don't render children until we've checked localStorage
  if (!isLoaded) {
    return null
  }

  return (
    <CountryContext.Provider value={{ selectedCountry: selectedCountry, setSelectedCountry: setSelectedCountry }}>
      {children}
    </CountryContext.Provider>
  )
}

export function useCountry() {
  const context = useContext(CountryContext)
  if (context === undefined) {
    throw new Error("useCountry must be used within a CountryProvider")
  }
  return context
}
