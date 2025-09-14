"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { GroupHeader } from "@/components/group-header"
import { GroupRestaurants } from "@/components/group-restaurants"
import { GroupMembers } from "@/components/group-members"
import { GroupChat } from "@/components/group-chat"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock group data
const mockGroup = {
  id: 1,
  name: "Weekend Foodies",
  description: "Exploring the best brunch spots every weekend",
  memberCount: 8,
  restaurantCount: 24,
  isOwner: true,
  createdAt: "2024-01-01",
  tags: ["Brunch", "Weekend", "Casual"],
  members: [
    { id: 1, name: "John Doe", avatar: "/diverse-user-avatars.png", isOwner: true, joinedAt: "2024-01-01" },
    { id: 2, name: "Jane Smith", avatar: "/diverse-user-avatars.png", isOwner: false, joinedAt: "2024-01-02" },
    { id: 3, name: "Mike Johnson", avatar: "/diverse-user-avatars.png", isOwner: false, joinedAt: "2024-01-03" },
    { id: 4, name: "Sarah Wilson", avatar: "/diverse-user-avatars.png", isOwner: false, joinedAt: "2024-01-04" },
  ],
}

export default function GroupDetailPage({ params }: { params: { id: string } }) {
  const [group] = useState(mockGroup)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <GroupHeader group={group} />

          <Tabs defaultValue="restaurants" className="space-y-6">
            <TabsList>
              <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
            </TabsList>

            <TabsContent value="restaurants" className="space-y-0">
              <GroupRestaurants groupId={group.id} />
            </TabsContent>

            <TabsContent value="members" className="space-y-0">
              <GroupMembers members={group.members} isOwner={group.isOwner} />
            </TabsContent>

            <TabsContent value="chat" className="space-y-0">
              <GroupChat groupId={group.id} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
