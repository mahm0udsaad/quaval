"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AVAILABLE_COUNTRIES } from "@/lib/api"
import { Check, Globe } from "lucide-react"
import Image from "next/image"

interface RegionSelectorProps {
  selectedRegions: string[]
  onChange: (regions: string[]) => void
}

const COUNTRY_FLAGS = {
  canada: "https://flagcdn.com/w80/ca.png",
  north_america_us_mexico: "https://flagcdn.com/w80/us.png",
  north_america: "https://flagcdn.com/w80/us.png",
  europe: "https://flagcdn.com/w80/eu.png",
  middle_east: "https://flagcdn.com/w80/sa.png",
  asia: "https://flagcdn.com/w80/cn.png",
}

export function RegionSelector({ selectedRegions, onChange }: RegionSelectorProps) {
  const [open, setOpen] = useState(false)

  const toggleRegion = (regionId: string) => {
    if (selectedRegions.includes(regionId)) {
      onChange(selectedRegions.filter((id) => id !== regionId))
    } else {
      onChange([...selectedRegions, regionId])
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedRegions.length === 0 ? (
          <div className="text-gray-500 italic">No regions selected</div>
        ) : (
          selectedRegions.map((regionId) => {
            const region = AVAILABLE_COUNTRIES.find((c) => c.id === regionId)
            return (
              <div key={regionId} className="flex items-center bg-blue-50 border border-blue-200 rounded-md px-3 py-2">
                <div className="relative w-5 h-4 mr-2">
                  <Image
                    src={COUNTRY_FLAGS[regionId] || "https://flagcdn.com/w80/xx.png"}
                    alt={region?.name || ""}
                    fill
                    className="object-cover rounded-sm"
                  />
                </div>
                <span className="text-sm">{region?.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-5 w-5 p-0 text-gray-400 hover:text-red-500"
                  onClick={() => toggleRegion(regionId)}
                >
                  <span className="sr-only">Remove</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </Button>
              </div>
            )
          })
        )}
      </div>

      <Button type="button" variant="outline" onClick={() => setOpen(true)} className="flex items-center">
        <Globe className="mr-2 h-4 w-4" />
        Select Regions
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Available Regions</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4">
            <p className="text-sm text-gray-500 mb-4">Choose the regions where this product will be available:</p>

            <div className="grid grid-cols-1 gap-3">
              {AVAILABLE_COUNTRIES.map((country) => (
                <Button
                  key={country.id}
                  variant={selectedRegions.includes(country.id) ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => toggleRegion(country.id)}
                >
                  <div className="relative w-6 h-5 mr-3">
                    <Image
                      src={COUNTRY_FLAGS[country.id] || "https://flagcdn.com/w80/xx.png"}
                      alt={country.name}
                      fill
                      className="object-cover rounded-sm"
                    />
                  </div>
                  {selectedRegions.includes(country.id) && <Check className="mr-2 h-4 w-4" />}
                  {country.name}
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
