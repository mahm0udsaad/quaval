"use client"

import type React from "react"
import { useState, useEffect, useRef, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { searchProducts, type SearchSuggestion } from "@/app/[locale]/actions/search"

interface SearchAutocompleteProps {
  onSelect?: () => void
  className?: string
  placeholder?: string
}

export function SearchAutocomplete({
  onSelect,
  className = "",
  placeholder = "Search products...",
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isPending, startTransition] = useTransition()
  const [isFocused, setIsFocused] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const debouncedQuery = useDebounce(query, 300)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Fetch suggestions when the debounced query changes
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([])
      return
    }

    startTransition(async () => {
      try {
        const result = await searchProducts(debouncedQuery, true, 10)
        setSuggestions(result.suggestions || [])
      } catch (error) {
        console.error("Error fetching suggestions:", error)
        setSuggestions([])
      }
    })
  }, [debouncedQuery])

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!suggestions.length) return

    // Arrow down
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
    }
    // Arrow up
    else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
    }
    // Enter
    else if (e.key === "Enter") {
      e.preventDefault()
      if (highlightedIndex >= 0) {
        const suggestion = suggestions[highlightedIndex]
        handleSuggestionSelect(suggestion)
      } else if (query.trim()) {
        handleSearch()
      }
    }
    // Escape
    else if (e.key === "Escape") {
      setIsFocused(false)
    }
  }

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setQuery("")
      setIsFocused(false)
      if (onSelect) onSelect()
    }
  }

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    if (!suggestion || !suggestion.id) {
      console.error("Invalid suggestion", suggestion)
      return
    }

    if (suggestion.type === "part_number" && suggestion.part_number) {
      // If it's a part number suggestion, go to the product with that part number selected
      router.push(`/products/${suggestion.id}?partNumber=${encodeURIComponent(suggestion.part_number)}`)
    } else {
      // Otherwise, go to the product page
      router.push(`/products/${suggestion.id}`)
    }
    setQuery("")
    setIsFocused(false)
    if (onSelect) onSelect()
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          aria-label="Search"
          aria-expanded={isFocused && suggestions.length > 0}
          aria-autocomplete="list"
          aria-controls={suggestions.length > 0 ? "search-suggestions" : undefined}
          aria-activedescendant={highlightedIndex >= 0 ? `suggestion-${highlightedIndex}` : undefined}
        />
        <button
          type="button"
          onClick={handleSearch}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        >
          <Search size={18} />
        </button>
      </div>

      {/* Suggestions dropdown */}
      {isFocused && (
        <div
          ref={suggestionsRef}
          id="search-suggestions"
          className={`absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg max-h-96 overflow-y-auto ${
            suggestions.length === 0 && !isPending ? "hidden" : ""
          }`}
        >
          {isPending ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : suggestions.length > 0 ? (
            <ul className="py-2">
              {suggestions.map((suggestion, index) => (
                <li
                  key={`${suggestion.id || index}-${suggestion.type}-${suggestion.part_number || index}`}
                  id={`suggestion-${index}`}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                    highlightedIndex === index ? "bg-gray-100" : ""
                  }`}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  role="option"
                  aria-selected={highlightedIndex === index}
                >
                  <div className="flex items-center">
                    {suggestion.image_url && (
                      <div className="w-10 h-10 mr-3 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        <img
                          src={suggestion.image_url || "/placeholder.svg"}
                          alt={suggestion.part_number || suggestion.name || "Product"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      {suggestion.type === "part_number" && suggestion.part_number ? (
                        <div className="font-medium">{suggestion.part_number}</div>
                      ) : (
                        <div className="font-medium">
                          {suggestion.part_number || suggestion.name || "Unnamed product"}
                        </div>
                      )}
                      {suggestion.family && <div className="text-xs text-gray-500">{suggestion.family}</div>}
                    </div>
                  </div>
                </li>
              ))}
              <li className="px-4 py-2 text-center border-t">
                <button onClick={handleSearch} className="text-primary hover:underline text-sm font-medium">
                  See all results for "{query}"
                </button>
              </li>
            </ul>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">No results found</div>
          ) : null}
        </div>
      )}
    </div>
  )
}
