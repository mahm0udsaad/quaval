"use server"

import { supabase } from "@/lib/supabase"

export interface ShippingAddress {
  name: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
}

export async function updateUserProfile(userId: string, shippingAddress: ShippingAddress) {
  try {
    // Split the name into first and last name
    const nameParts = shippingAddress.name.split(" ")
    const firstName = nameParts[0]
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : ""

    // Check if profile exists
    const { data: existingProfile } = await supabase.from("profiles").select("id").eq("id", userId).maybeSingle()

    if (!existingProfile) {
      // Create profile if it doesn't exist
      const { error: insertError } = await supabase.from("profiles").insert({
        id: userId,
        first_name: firstName,
        last_name: lastName,
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postal_code: shippingAddress.postalCode,
        country: shippingAddress.country,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (insertError) {
        console.error("Error creating user profile:", insertError)
        return { error: insertError.message }
      }
    } else {
      // Update existing profile
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
          address: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.postalCode,
          country: shippingAddress.country,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (error) {
        console.error("Error updating user profile:", error)
        return { error: error.message }
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in updateUserProfile:", error)
    return { error: "Failed to update profile" }
  }
}

export async function getUserProfile(userId: string) {
  try {
    // Use maybeSingle() instead of single() to avoid errors when no profile exists
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle()

    if (error) {
      console.error("Error fetching user profile:", error)
      return { error: error.message }
    }

    // Return the profile data even if it's null
    return { profile: data }
  } catch (error) {
    console.error("Error in getUserProfile:", error)
    return { error: "Failed to fetch profile" }
  }
}
