import { NextResponse } from "next/server"
import { aiService } from "@/lib/ai-service"

export async function POST(request: Request) {
  try {
    const { restaurantName, reviews } = await request.json()

    if (!restaurantName) {
      return NextResponse.json({ error: "Restaurant name is required" }, { status: 400 })
    }

    const summary = await aiService.generateReviewSummary(restaurantName, reviews || [])

    return NextResponse.json({ summary })
  } catch (error) {
    console.error("Error generating AI summary:", error)
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 })
  }
}
