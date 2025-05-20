"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle  , DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AVAILABLE_COUNTRIES } from "@/lib/api"
import { Check, Globe } from "lucide-react"
import { useCountry } from "@/app/[locale]/contexts/CountryContext"
import Image from "next/image"

// Country flag mapping
const COUNTRY_FLAGS = {
  canada: "https://flagcdn.com/w80/ca.png",
  north_america_us_mexico: "https://flagcdn.com/w80/us.png",
  north_america: "https://flagcdn.com/w80/us.png",
  europe: "https://flagcdn.com/w80/eu.png",
  middle_east: "https://flagcdn.com/w80/sa.png",
  asia: "https://flagcdn.com/w80/cn.png",
}

export function CountrySelectorModal() {
  const [open, setOpen] = useState(false)
  const { selectedCountry, setSelectedCountry } = useCountry()

  useEffect(() => {
    // Show modal if no country is selected or on first visit
    const hasVisited = localStorage.getItem("hasVisitedBefore")
    if (!selectedCountry || !hasVisited) {
      setOpen(true)
      localStorage.setItem("hasVisitedBefore", "true")
    }
  }, [selectedCountry])

  const handleCountrySelect = (countryId: string) => {
    setSelectedCountry(countryId)
    setOpen(false)
  }

  const currentCountry = AVAILABLE_COUNTRIES.find((c) => c.id === selectedCountry)

  return (
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
      <Button
        variant="ghost"
        size="icon"
        className="flex items-center justify-center"
      >
        {selectedCountry ? (
          <div className="relative w-5 h-4">
            <Image
              src={COUNTRY_FLAGS[selectedCountry as keyof typeof COUNTRY_FLAGS]}
              alt={currentCountry?.name || ""}
              fill
              className="object-cover rounded-sm"
            />
          </div>
        ) : (
          <Globe className="h-5 w-5 text-secondary hover:text-primary" />
        )}
      </Button>
      </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Your Region</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4">
            <p className="text-sm text-gray-500 mb-4">
              Please select your region to see products available in your area:
            </p>

            <div className="grid grid-cols-1 gap-3">
              {AVAILABLE_COUNTRIES.map((country) => (
                <Button
                  key={country.id}
                  variant={selectedCountry === country.id ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => handleCountrySelect(country.id)}
                >
                  <div className="relative w-6 h-5 mr-3">
                    <Image
                      src={COUNTRY_FLAGS[country.id as keyof typeof COUNTRY_FLAGS] || "https://flagcdn.com/w80/xx.png"}
                      alt={country.name}
                      fill
                      className="object-cover rounded-sm"
                    />
                  </div>
                  {selectedCountry === country.id && <Check className="mr-2 h-4 w-4" />}
                  {country.name}
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
  )
}
