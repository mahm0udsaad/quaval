"use client"

import { useCurrency, AVAILABLE_CURRENCIES } from "../contexts/CurrencyContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CurrencySelector({ className }: { className?: string }) {
  const { selectedCurrency, setSelectedCurrency } = useCurrency()

  return (
    <Select
      value={selectedCurrency.code}
      onValueChange={(code) => {
        const currency = AVAILABLE_CURRENCIES.find((c) => c.code === code)
        if (currency) {
          setSelectedCurrency(currency)
        }
      }}
    >
      <SelectTrigger className={`w-[200px] ${className}`}>
        <SelectValue placeholder="Select a currency">
          {selectedCurrency.symbol} {selectedCurrency.code}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-white">
        {AVAILABLE_CURRENCIES.map((currency) => (
          <SelectItem key={currency.code} value={currency.code}>
            {currency.symbol} {currency.code} - {currency.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
