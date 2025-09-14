"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { SavedRestaurants } from "@/components/saved-restaurants"
import { Collections } from "@/components/collections"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function SavedPage() {
  const [showCreateCollection, setShowCreateCollection] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Saved Places</h1>
              <p className="text-muted-foreground">Organize your favorite restaurants into collections</p>
            </div>
            <Button onClick={() => setShowCreateCollection(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Collection
            </Button>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All Saved</TabsTrigger>
              <TabsTrigger value="collections">Collections</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-0">
              <SavedRestaurants />
            </TabsContent>

            <TabsContent value="collections" className="space-y-0">
              <Collections
                showCreateForm={showCreateCollection}
                onCreateFormClose={() => setShowCreateCollection(false)}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
