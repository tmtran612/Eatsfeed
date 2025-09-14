// AI service for restaurant review summaries and recommendations

export interface ReviewSummary {
  summary: string
  pros: string[]
  cons: string[]
  sentiment: "positive" | "neutral" | "negative"
  topDishes: string[]
  priceValue: "excellent" | "good" | "fair" | "poor"
  atmosphere: string
  serviceQuality: "excellent" | "good" | "fair" | "poor"
}

export interface PersonalizedRecommendation {
  restaurantId: number
  score: number
  reasons: string[]
  matchingPreferences: string[]
}

export class AIService {
  private apiKey: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY || ""
  }

  async generateReviewSummary(restaurantName: string, reviews: string[]): Promise<ReviewSummary> {
    try {
      // In a real implementation, this would call OpenAI API
      // For now, return mock data based on restaurant name
      return this.getMockReviewSummary(restaurantName)
    } catch (error) {
      console.error("Error generating review summary:", error)
      return this.getFallbackSummary()
    }
  }

  async generatePersonalizedRecommendations(
    userPreferences: string[],
    savedRestaurants: number[],
    availableRestaurants: any[],
  ): Promise<PersonalizedRecommendation[]> {
    try {
      // Mock personalized recommendations
      return availableRestaurants
        .filter((r) => !savedRestaurants.includes(r.id))
        .map((restaurant) => ({
          restaurantId: restaurant.id,
          score: Math.random() * 0.4 + 0.6, // 0.6-1.0 range
          reasons: this.generateReasons(restaurant, userPreferences),
          matchingPreferences: userPreferences.filter((pref) =>
            restaurant.tags?.some((tag: string) => tag.toLowerCase().includes(pref.toLowerCase())),
          ),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
    } catch (error) {
      console.error("Error generating recommendations:", error)
      return []
    }
  }

  async generateTripRecap(restaurants: any[], photos: string[]): Promise<string> {
    try {
      // Mock trip recap generation
      const restaurantNames = restaurants.map((r) => r.name).join(", ")
      return `What an amazing food adventure! You explored ${restaurants.length} incredible restaurants including ${restaurantNames}. From authentic flavors to creative presentations, each spot offered something unique. The photos captured the essence of each dining experience perfectly. This culinary journey showcased the diverse food scene and created memories that will last a lifetime!`
    } catch (error) {
      console.error("Error generating trip recap:", error)
      return "Your culinary adventure was filled with amazing discoveries and delicious experiences!"
    }
  }

  private getMockReviewSummary(restaurantName: string): ReviewSummary {
    const summaries: Record<string, ReviewSummary> = {
      "Bella Vista Italian": {
        summary:
          "Customers consistently praise the authentic Italian atmosphere and exceptional pasta dishes. The wood-fired pizzas and extensive wine selection are standout features.",
        pros: [
          "Authentic Italian flavors",
          "Romantic atmosphere",
          "Excellent wine selection",
          "Fresh pasta made daily",
        ],
        cons: ["Can be noisy during peak hours", "Limited parking", "Reservations recommended"],
        sentiment: "positive",
        topDishes: ["Carbonara", "Margherita Pizza", "Tiramisu", "Osso Buco"],
        priceValue: "good",
        atmosphere: "Romantic and cozy with dim lighting and Italian music",
        serviceQuality: "good",
      },
      "Sakura Sushi Bar": {
        summary:
          "Exceptional sushi quality with incredibly fresh fish and creative presentations. The omakase experience is highly recommended by regulars.",
        pros: [
          "Extremely fresh fish",
          "Creative roll combinations",
          "Skilled sushi chefs",
          "Authentic Japanese experience",
        ],
        cons: ["Higher price point", "Limited seating", "Can have long waits"],
        sentiment: "positive",
        topDishes: ["Chef's Special Roll", "Omakase Tasting", "Salmon Sashimi", "Miso Soup"],
        priceValue: "fair",
        atmosphere: "Traditional Japanese with sushi bar seating",
        serviceQuality: "excellent",
      },
      "The Local Burger": {
        summary:
          "Great casual spot for gourmet burgers with locally sourced ingredients. The craft beer selection complements the food perfectly.",
        pros: [
          "High-quality local ingredients",
          "Great craft beer selection",
          "Casual friendly atmosphere",
          "Good value",
        ],
        cons: ["Can get crowded", "Limited vegetarian options", "Fries could be crispier"],
        sentiment: "positive",
        topDishes: ["Truffle Burger", "Sweet Potato Fries", "Local IPA", "Bacon Cheeseburger"],
        priceValue: "excellent",
        atmosphere: "Casual and lively with local artwork",
        serviceQuality: "good",
      },
    }

    return (
      summaries[restaurantName] || {
        summary: "A popular local restaurant with positive reviews from customers.",
        pros: ["Good food quality", "Friendly service", "Clean environment"],
        cons: ["Limited information available"],
        sentiment: "positive",
        topDishes: ["House Special"],
        priceValue: "good",
        atmosphere: "Welcoming and comfortable",
        serviceQuality: "good",
      }
    )
  }

  private getFallbackSummary(): ReviewSummary {
    return {
      summary: "Review summary temporarily unavailable. Please try again later.",
      pros: ["Popular local spot"],
      cons: ["Limited information"],
      sentiment: "neutral",
      topDishes: [],
      priceValue: "good",
      atmosphere: "Comfortable dining environment",
      serviceQuality: "good",
    }
  }

  private generateReasons(restaurant: any, preferences: string[]): string[] {
    const reasons = []

    if (restaurant.rating >= 4.5) {
      reasons.push("Highly rated by customers")
    }

    if (restaurant.priceLevel <= 2) {
      reasons.push("Great value for money")
    }

    if (preferences.includes("romantic") && restaurant.tags?.includes("Romantic")) {
      reasons.push("Perfect for romantic dining")
    }

    if (preferences.includes("casual") && restaurant.tags?.includes("Casual")) {
      reasons.push("Relaxed casual atmosphere")
    }

    if (preferences.includes("spicy") && restaurant.tags?.includes("Spicy")) {
      reasons.push("Known for bold, spicy flavors")
    }

    return reasons.slice(0, 3)
  }
}

// Singleton instance
export const aiService = new AIService()
