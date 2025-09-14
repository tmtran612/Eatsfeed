"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Folder, MoreVertical, Edit, Trash2, Share, Users, Lock } from "lucide-react"

// Mock collections data
const mockCollections = [
  {
    id: 1,
    name: "Date Night",
    description: "Romantic restaurants perfect for special occasions",
    restaurantCount: 8,
    isPrivate: false,
    createdAt: "2024-01-10",
    coverImage: "/italian-restaurant-interior.png",
    tags: ["Romantic", "Upscale", "Wine"],
  },
  {
    id: 2,
    name: "Quick Bites",
    description: "Fast and delicious options for busy days",
    restaurantCount: 12,
    isPrivate: true,
    createdAt: "2024-01-08",
    coverImage: "/burger-restaurant.png",
    tags: ["Fast", "Casual", "Affordable"],
  },
  {
    id: 3,
    name: "Special Occasions",
    description: "High-end restaurants for celebrations",
    restaurantCount: 5,
    isPrivate: false,
    createdAt: "2024-01-05",
    coverImage: "/bustling-sushi-restaurant.png",
    tags: ["Upscale", "Celebration", "Premium"],
  },
  {
    id: 4,
    name: "Spicy Food",
    description: "For when you want to turn up the heat",
    restaurantCount: 6,
    isPrivate: true,
    createdAt: "2024-01-03",
    coverImage: "/indian-restaurant-interior.png",
    tags: ["Spicy", "Bold Flavors", "International"],
  },
]

interface CollectionsProps {
  showCreateForm: boolean
  onCreateFormClose: () => void
}

export function Collections({ showCreateForm, onCreateFormClose }: CollectionsProps) {
  const [collections, setCollections] = useState(mockCollections)
  const [newCollection, setNewCollection] = useState({
    name: "",
    description: "",
    isPrivate: false,
  })

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCollection.name.trim()) return

    const collection = {
      id: Date.now(),
      name: newCollection.name,
      description: newCollection.description,
      restaurantCount: 0,
      isPrivate: newCollection.isPrivate,
      createdAt: new Date().toISOString().split("T")[0],
      coverImage: "/placeholder.svg",
      tags: [],
    }

    setCollections((prev) => [collection, ...prev])
    setNewCollection({ name: "", description: "", isPrivate: false })
    onCreateFormClose()
  }

  const handleDeleteCollection = (collectionId: number) => {
    setCollections((prev) => prev.filter((c) => c.id !== collectionId))
  }

  return (
    <div className="space-y-6">
      {/* Create Collection Dialog */}
      <Dialog open={showCreateForm} onOpenChange={onCreateFormClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Collection</DialogTitle>
            <DialogDescription>Organize your saved restaurants into themed collections.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateCollection} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="collection-name">Collection Name</Label>
              <Input
                id="collection-name"
                placeholder="e.g., Date Night, Quick Bites"
                value={newCollection.name}
                onChange={(e) => setNewCollection((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="collection-description">Description (Optional)</Label>
              <Textarea
                id="collection-description"
                placeholder="Describe what kind of restaurants belong in this collection"
                value={newCollection.description}
                onChange={(e) => setNewCollection((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is-private"
                checked={newCollection.isPrivate}
                onChange={(e) => setNewCollection((prev) => ({ ...prev, isPrivate: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="is-private" className="text-sm">
                Make this collection private
              </Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCreateFormClose}>
                Cancel
              </Button>
              <Button type="submit">Create Collection</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Collections Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <Card key={collection.id} className="overflow-hidden">
            <div className="relative">
              <img
                src={collection.coverImage || "/placeholder.svg"}
                alt={collection.name}
                className="w-full h-32 object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                {collection.isPrivate ? (
                  <Badge variant="secondary" className="text-xs">
                    <Lock className="h-3 w-3 mr-1" />
                    Private
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    Public
                  </Badge>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="secondary" className="h-6 w-6 p-0">
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Collection
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share className="mr-2 h-4 w-4" />
                      Share Collection
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteCollection(collection.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Collection
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{collection.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{collection.restaurantCount} restaurants</p>
                </div>
                <Folder className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {collection.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">{collection.description}</p>
              )}

              {collection.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {collection.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">
                  Created {new Date(collection.createdAt).toLocaleDateString()}
                </span>
                <Button size="sm" variant="outline">
                  View Collection
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {collections.length === 0 && (
        <div className="text-center py-12">
          <Folder className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No collections yet</h3>
          <p className="text-muted-foreground">Create your first collection to organize your saved restaurants</p>
        </div>
      )}
    </div>
  )
}
