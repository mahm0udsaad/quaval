"use client"

import { useMemo, useState } from "react"
import { ArrowUpDown, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export type BearingSpecification = {
  partNumber: string
  dimensions: {
    bore: string
    outerDiameter: string
    width: string
  }
  loadRatings: {
    dynamic: string
    static: string
  }
  geometryFactor: string
  speedReference: {
    thermalReferenceSpeed: string
    limitingSpeed: string
  }
  weight: string
}

// First, let's update the SortField type to include Heat Stabilization
type SortField =
  | "partNumber"
  | "dimensions.bore"
  | "dimensions.outerDiameter"
  | "dimensions.width"
  | "loadRatings.dynamic"
  | "loadRatings.static"
  | "geometryFactor"
  | "speedReference.thermalReferenceSpeed"
  | "speedReference.limitingSpeed"
  | "weight"
  | "heatStabilization"

type SortDirection = "asc" | "desc"

interface BearingSpecificationTableProps {
  specifications: BearingSpecification[]
  selectedPartNumber?: string
  onPartNumberSelect?: (partNumber: string) => void
}

export function BearingSpecificationTable({
  specifications,
  selectedPartNumber,
  onPartNumberSelect,
}: BearingSpecificationTableProps) {
  const [sortField, setSortField] = useState<SortField>("partNumber")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  // Use the first part number as default if no selection is provided
  const effectiveSelectedPartNumber = useMemo(() => {
    if (selectedPartNumber) return selectedPartNumber
    return specifications.length > 0 ? specifications[0].partNumber : undefined
  }, [selectedPartNumber, specifications])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortedValue = (item: BearingSpecification, field: SortField) => {
    const fieldParts = field.split(".")
    let value: any = item

    for (const part of fieldParts) {
      value = value[part]
    }

    // Convert to number if possible for proper sorting
    const numValue = Number.parseFloat(value.replace(/[^\d.-]/g, ""))
    return isNaN(numValue) ? value.toLowerCase() : numValue
  }

  // Get only the selected bearing specification
  const selectedSpecification = useMemo(() => {
    if (!effectiveSelectedPartNumber) return null
    return specifications.find((spec) => spec.partNumber === effectiveSelectedPartNumber) || null
  }, [specifications, effectiveSelectedPartNumber])

  // Update the SortableHeader component to display headers in a more compact format
  const SortableHeader = ({ field, label, tooltip }: { field: SortField; label: string; tooltip?: string }) => {
    // Split the label into words
    const words = label.split(" ")

    return (
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent" onClick={() => handleSort(field)}>
          <span className="flex flex-col text-xs">
            {words.map((word, i) => (
              <span key={i}>{word}</span>
            ))}
          </span>
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="ml-1 h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      <div className="w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">
                <SortableHeader field="dimensions.bore" label="Inner (d)" tooltip="Inner diameter in mm" />
              </th>
              <th className="border border-gray-300 p-2 text-left">
                <SortableHeader field="dimensions.outerDiameter" label="Outer (D)" tooltip="Outer diameter in mm" />
              </th>
              <th className="border border-gray-300 p-2 text-left">
                <SortableHeader field="dimensions.width" label="Width (B)" tooltip="Width in mm" />
              </th>
              <th className="border border-gray-300 p-2 text-left">
                <SortableHeader field="weight" label="Weight" tooltip="Weight in kg" />
              </th>
              <th className="border border-gray-300 p-2 text-left">
                <SortableHeader field="speedReference.limitingSpeed" label="Speed" tooltip="Limiting speed in rpm" />
              </th>
              <th className="border border-gray-300 p-2 text-left">
                <SortableHeader
                  field="heatStabilization"
                  label="Heat Stabilization"
                  tooltip="Heat stabilization treatment"
                />
              </th>
              <th className="border border-gray-300 p-2 text-left">
                <SortableHeader
                  field="loadRatings.static"
                  label="Static Load (C₀)"
                  tooltip="Static load rating in kN"
                />
              </th>
              <th className="border border-gray-300 p-2 text-left">
                <SortableHeader
                  field="loadRatings.dynamic"
                  label="Dynamic Load (C)"
                  tooltip="Dynamic load rating in kN"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {!selectedSpecification ? (
              <tr>
                <td colSpan={8} className="border border-gray-300 p-4 text-center">
                  No bearing specification found.
                </td>
              </tr>
            ) : (
              <tr className="bg-blue-50">
                <td className="border border-gray-300 p-2">{selectedSpecification.dimensions.bore}</td>
                <td className="border border-gray-300 p-2">{selectedSpecification.dimensions.outerDiameter}</td>
                <td className="border border-gray-300 p-2">{selectedSpecification.dimensions.width}</td>
                <td className="border border-gray-300 p-2">{selectedSpecification.weight}</td>
                <td className="border border-gray-300 p-2">{selectedSpecification.speedReference.limitingSpeed}</td>
                <td className="border border-gray-300 p-2">Standard</td>
                <td className="border border-gray-300 p-2">{selectedSpecification.loadRatings.static}</td>
                <td className="border border-gray-300 p-2">{selectedSpecification.loadRatings.dynamic}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
