"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Star, DollarSign, MapPin, Heart, Search, Filter, MoreVertical, Trash2, FolderPlus } from "lucide-react"

// Mock saved restaurants data
const mockSavedRestaurants = [
  {
    id: 1,
    name: "Bella Vista Italian",
    cuisine: "Italian",
    rating: 4.5,
    priceLevel: 2,
    distance: "0.3 miles",
    image: "/italian-restaurant-exterior.png",
    summary: "Authentic Italian cuisine with fresh pasta and wood-fired pizzas",
    savedAt: "2024-01-15",
    tags: ["Romantic", "Date Night", "Pasta"],
    collections: ["Date Night", "Italian Favorites"],
  },
  {
    id: 2,
    name: "Sakura Sushi Bar",
    cuisine: "Japanese",
    rating: 4.7,
    priceLevel: 3,
    distance: "0.5 miles",
    image: "/bustling-sushi-restaurant.png",
    summary: "Premium sushi with fresh fish and creative rolls",
    savedAt: "2024-01-14",
    tags: ["Fresh Fish", "Premium", "Creative"],
    collections: ["Special Occasions"],
  },
  {
    id: 3,
    name: "The Local Burger",
    cuisine: "American",
    rating: 4.2,
    priceLevel: 1,
    distance: "0.2 miles",
    image: "/burger-restaurant.png",
    summary: "Gourmet burgers with locally sourced ingredients",
    savedAt: "2024-01-13",
    tags: ["Casual", "Local", "Burgers"],
    collections: ["Quick Bites"],
  },
  {
    id: 4,
    name: "Spice Route Indian",
    cuisine: "Indian",
    rating: 4.6,
    priceLevel: 2,
    distance: "0.6 miles",
    image: "/indian-restaurant-interior.png",
    summary: "Authentic Indian flavors with traditional spices",
    savedAt: "2024-01-12",
    tags: ["Spicy", "Traditional", "Authentic"],
    collections: ["Spicy Food"],
  },
]

export function SavedRestaurants() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCuisine, setFilterCuisine] = useState<string | null>(null)
  const [savedRestaurants, setSavedRestaurants] = useState(mockSavedRestaurants)

  const cuisines = Array.from(new Set(mockSavedRestaurants.map((r) => r.cuisine)))

  const filteredRestaurants = savedRestaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCuisine = !filterCuisine || restaurant.cuisine === filterCuisine
    return matchesSearch && matchesCuisine
  })

  const handleRemoveFromSaved = (restaurantId: number) => {
    setSavedRestaurants((prev) => prev.filter((r) => r.id !== restaurantId))
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search saved restaurants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              {filterCuisine || "All Cuisines"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilterCuisine(null)}>All Cuisines</DropdownMenuItem>
            {cuisines.map((cuisine) => (
              <DropdownMenuItem key={cuisine} onClick={() => setFilterCuisine(cuisine)}>
                {cuisine}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      {/* Restaurant Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <Card key={restaurant.id} className="overflow-hidden">
            <div className="relative">
              <img
                src={restaurant.image || "/placeholder.svg"}
                alt={restaurant.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <FolderPlus className="mr-2 h-4 w-4" />
                      Add to Collection
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRemoveFromSaved(restaurant.id)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove from Saved
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <CardContent className="p-4 space-y-3">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{restaurant.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {restaurant.cuisine}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {restaurant.rating}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {"$".repeat(restaurant.priceLevel)}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {restaurant.distance}
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">{restaurant.summary}</p>

              {/* Collections */}
              {restaurant.collections.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {restaurant.collections.map((collection) => (
                    <Badge key={collection} variant="outline" className="text-xs">
                      {collection}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">
                  Saved {new Date(restaurant.savedAt).toLocaleDateString()}
                </span>
                <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                  <Heart className="h-4 w-4 fill-current text-primary" />
                  Saved
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRestaurants.length === 0 && (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No saved restaurants found</h3>
          <p className="text-muted-foreground">
            {searchQuery || filterCuisine
              ? "Try adjusting your search or filter criteria"
              : "Start swiping to save restaurants you like!"}
          </p>
        </div>
      )}
    </div>
  )
}
