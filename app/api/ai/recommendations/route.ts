import { NextResponse } from "next/server"
import { aiService } from "@/lib/ai-service"

export async function POST(request: Request) {
  try {
    const { userPreferences, savedRestaurants, availableRestaurants } = await request.json()

    if (!userPreferences || !Array.isArray(userPreferences)) {
      return NextResponse.json({ error: "User preferences are required" }, { status: 400 })
    }

    const recommendations = await aiService.generatePersonalizedRecommendations(
      userPreferences,
      savedRestaurants || [],
      availableRestaurants || [],
    )

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error("Error generating recommendations:", error)
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}
