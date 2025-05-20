"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useCountry } from "./CountryContext"
// First, import the necessary dependencies at the top
import { useAuth } from "./AuthContext"

export type Currency = {
  code: string
  symbol: string
  name: string
}

export const AVAILABLE_CURRENCIES: Currency[] = [
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
]

type ExchangeRates = {
  [key: string]: number
}

type CurrencyContextType = {
  selectedCurrency: Currency
  setSelectedCurrency: (currency: Currency) => void
  exchangeRates: ExchangeRates
  convertPrice: (priceInCAD: number) => number
  isLoading: boolean
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

// Then update the CurrencyProvider component to include saving to Supabase
export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(AVAILABLE_CURRENCIES[0])
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({ CAD: 1, USD: 0.74, EUR: 0.68 })
  const [isLoading, setIsLoading] = useState(false)
  const { selectedCountry } = useCountry()

  // Set default currency based on selected region
  useEffect(() => {
    if (!selectedCountry) return

    if (selectedCountry === "canada") {
      setSelectedCurrency(AVAILABLE_CURRENCIES[0]) // CAD
    } else if (selectedCountry === "europe") {
      setSelectedCurrency(AVAILABLE_CURRENCIES[2]) // EUR
    } else {
      setSelectedCurrency(AVAILABLE_CURRENCIES[1]) // USD
    }
  }, [selectedCountry])

  // Fetch exchange rates
  useEffect(() => {
    const fetchExchangeRates = async () => {
      setIsLoading(true)
      try {
        // Using Exchange Rate API
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/CAD")
        const data = await response.json()

        if (data.rates) {
          setExchangeRates({
            CAD: 1, // Base currency
            USD: data.rates.USD,
            EUR: data.rates.EUR,
          })
        }
      } catch (error) {
        console.error("Error fetching exchange rates:", error)
        // Fallback to default rates if API fails
        setExchangeRates({ CAD: 1, USD: 0.74, EUR: 0.68 })
      } finally {
        setIsLoading(false)
      }
    }

    fetchExchangeRates()

    // Refresh rates every hour
    const intervalId = setInterval(fetchExchangeRates, 60 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  // Function to convert prices from CAD to selected currency
  const convertPrice = (priceInCAD: number): number => {
    const rate = exchangeRates[selectedCurrency.code] || 1
    return priceInCAD * rate
  }

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        setSelectedCurrency,
        exchangeRates,
        convertPrice,
        isLoading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
