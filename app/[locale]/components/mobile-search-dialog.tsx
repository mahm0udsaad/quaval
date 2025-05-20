"use client"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { SearchAutocomplete } from "./search-autocomplete"

interface MobileSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileSearchDialog({ open, onOpenChange }: MobileSearchDialogProps) {
  const handleSelect = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0">
        <div className="p-4">
          <SearchAutocomplete onSelect={handleSelect} placeholder="Search products or part numbers..." />
        </div>
      </DialogContent>
    </Dialog>
  )
}
