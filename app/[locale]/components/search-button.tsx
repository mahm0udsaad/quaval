"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MobileSearchDialog } from "./mobile-search-dialog"

export function SearchButton() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} aria-label="Search">
        <Search className="h-5 w-5" />
      </Button>

      <MobileSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
