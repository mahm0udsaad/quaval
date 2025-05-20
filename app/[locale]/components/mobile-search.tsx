"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { SearchAutocomplete } from "./search-autocomplete"
import { X } from "lucide-react"

interface MobileSearchProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileSearch({ isOpen, onClose }: MobileSearchProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Search Products</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <SearchAutocomplete onSelect={onClose} placeholder="Search models or part numbers..." />
      </DialogContent>
    </Dialog>
  )
}
