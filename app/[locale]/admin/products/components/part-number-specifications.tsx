"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { BearingSpecification } from "@/lib/api"

interface PartNumberSpecificationsProps {
  partNumbers: string[]
  specifications: BearingSpecification[]
  onChange: (specifications: BearingSpecification[]) => void
}

export function PartNumberSpecifications({ partNumbers, specifications, onChange }: PartNumberSpecificationsProps) {
  const [activeTab, setActiveTab] = useState(partNumbers[0] || "")

  // Initialize specifications for all part numbers if they don't exist
  const ensureSpecificationsExist = () => {
    const updatedSpecs = [...specifications]

    // Add specifications for part numbers that don't have them
    partNumbers.forEach((partNumber) => {
      if (!specifications.some((spec) => spec.partNumber === partNumber)) {
        updatedSpecs.push({
          partNumber,
          dimensions: {
            bore: "",
            outerDiameter: "",
            width: "",
          },
          loadRatings: {
            dynamic: "",
            static: "",
          },
          geometryFactor: "",
          speedReference: {
            thermalReferenceSpeed: "",
            limitingSpeed: "",
          },
          weight: "",
        })
      }
    })

    // Remove specifications for part numbers that no longer exist
    const filteredSpecs = updatedSpecs.filter((spec) => partNumbers.includes(spec.partNumber))

    if (JSON.stringify(filteredSpecs) !== JSON.stringify(specifications)) {
      onChange(filteredSpecs)
    }

    return filteredSpecs
  }

  const currentSpecs = ensureSpecificationsExist()

  // Find the specification for the active tab
  const activeSpec = currentSpecs.find((spec) => spec.partNumber === activeTab) || currentSpecs[0]

  // Update a specific field in the active specification
  const updateSpecField = (path: string[], value: string) => {
    // Add units to dimension values if they don't already have them
    if (path.includes("dimensions") && value && !value.includes("mm") && !isNaN(Number.parseFloat(value))) {
      value = `${value} mm`
    }
    if (path.includes("weight") && value && !value.includes("kg") && !isNaN(Number.parseFloat(value))) {
      value = `${value} kg`
    }
    if (path.includes("loadRatings") && value && !value.includes("kN") && !isNaN(Number.parseFloat(value))) {
      value = `${value} kN`
    }
    if (path.includes("speedReference") && value && !value.includes("rpm") && !isNaN(Number.parseFloat(value))) {
      value = `${value} rpm`
    }

    if (!activeSpec) return

    const updatedSpecs = currentSpecs.map((spec) => {
      if (spec.partNumber !== activeSpec.partNumber) return spec

      // Create a deep copy of the spec
      const updatedSpec = JSON.parse(JSON.stringify(spec))

      // Navigate to the nested property and update it
      let current: any = updatedSpec
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]]
      }
      current[path[path.length - 1]] = value

      return updatedSpec
    })

    onChange(updatedSpecs)
  }

  if (partNumbers.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
        <p className="text-yellow-800">Please add part numbers first before adding specifications.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap">
          {partNumbers.map((partNumber) => (
            <TabsTrigger key={partNumber} value={partNumber} className="flex-shrink-0">
              {partNumber}
            </TabsTrigger>
          ))}
        </TabsList>

        {partNumbers.map((partNumber) => (
          <TabsContent key={partNumber} value={partNumber} className="space-y-4">
            {activeSpec && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Dimensions</CardTitle>
                    <CardDescription>Enter the dimensions for this bearing part number</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="bore">Bore (d)</Label>
                        <Input
                          id="bore"
                          value={activeSpec.dimensions.bore}
                          onChange={(e) => updateSpecField(["dimensions", "bore"], e.target.value)}
                          placeholder="e.g., 25"
                        />
                      </div>
                      <div>
                        <Label htmlFor="outerDiameter">Outer Diameter (D)</Label>
                        <Input
                          id="outerDiameter"
                          value={activeSpec.dimensions.outerDiameter}
                          onChange={(e) => updateSpecField(["dimensions", "outerDiameter"], e.target.value)}
                          placeholder="e.g., 52"
                        />
                      </div>
                      <div>
                        <Label htmlFor="width">Width (B)</Label>
                        <Input
                          id="width"
                          value={activeSpec.dimensions.width}
                          onChange={(e) => updateSpecField(["dimensions", "width"], e.target.value)}
                          placeholder="e.g., 15"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Load Ratings</CardTitle>
                    <CardDescription>Enter the load ratings for this bearing part number</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dynamicLoad">Dynamic Load (C)</Label>
                        <Input
                          id="dynamicLoad"
                          value={activeSpec.loadRatings.dynamic}
                          onChange={(e) => updateSpecField(["loadRatings", "dynamic"], e.target.value)}
                          placeholder="e.g., 27.5 kN"
                        />
                      </div>
                      <div>
                        <Label htmlFor="staticLoad">Static Load (C₀)</Label>
                        <Input
                          id="staticLoad"
                          value={activeSpec.loadRatings.static}
                          onChange={(e) => updateSpecField(["loadRatings", "static"], e.target.value)}
                          placeholder="e.g., 22.8 kN"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Additional Specifications</CardTitle>
                    <CardDescription>Enter additional specifications for this bearing part number</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="geometryFactor">Geometry Factor (ƒ₀)</Label>
                        <Input
                          id="geometryFactor"
                          value={activeSpec.geometryFactor}
                          onChange={(e) => updateSpecField(["geometryFactor"], e.target.value)}
                          placeholder="e.g., 0.25"
                        />
                      </div>
                      <div>
                        <Label htmlFor="thermalReferenceSpeed">Thermal Reference Speed</Label>
                        <Input
                          id="thermalReferenceSpeed"
                          value={activeSpec.speedReference.thermalReferenceSpeed}
                          onChange={(e) => updateSpecField(["speedReference", "thermalReferenceSpeed"], e.target.value)}
                          placeholder="e.g., 5000 rpm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="limitingSpeed">Limiting Speed</Label>
                        <Input
                          id="limitingSpeed"
                          value={activeSpec.speedReference.limitingSpeed}
                          onChange={(e) => updateSpecField(["speedReference", "limitingSpeed"], e.target.value)}
                          placeholder="e.g., 8000 rpm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="weight">Weight</Label>
                        <Input
                          id="weight"
                          value={activeSpec.weight}
                          onChange={(e) => updateSpecField(["weight"], e.target.value)}
                          placeholder="e.g., 0.15 kg"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
