"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, MapPin, Calendar, MoreVertical, Settings, UserPlus, LogOut } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

// Mock groups data
const mockGroups = [
  {
    id: 1,
    name: "Weekend Foodies",
    description: "Exploring the best brunch spots every weekend",
    memberCount: 8,
    restaurantCount: 24,
    isOwner: true,
    lastActivity: "2024-01-15",
    members: [
      { id: 1, name: "John Doe", avatar: "/diverse-user-avatars.png" },
      { id: 2, name: "Jane Smith", avatar: "/diverse-user-avatars.png" },
      { id: 3, name: "Mike Johnson", avatar: "/diverse-user-avatars.png" },
    ],
    recentActivity: "Sarah added Bella Vista Italian",
    upcomingEvent: "Brunch at The Local Cafe - Sunday 11 AM",
  },
  {
    id: 2,
    name: "Date Night Spots",
    description: "Romantic restaurants for special occasions",
    memberCount: 2,
    restaurantCount: 12,
    isOwner: false,
    lastActivity: "2024-01-14",
    members: [
      { id: 1, name: "John Doe", avatar: "/diverse-user-avatars.png" },
      { id: 4, name: "Emily Davis", avatar: "/diverse-user-avatars.png" },
    ],
    recentActivity: "Emily voted on Sakura Sushi Bar",
    upcomingEvent: null,
  },
  {
    id: 3,
    name: "Office Lunch Squad",
    description: "Quick lunch spots near the office",
    memberCount: 12,
    restaurantCount: 18,
    isOwner: false,
    lastActivity: "2024-01-13",
    members: [
      { id: 1, name: "John Doe", avatar: "/diverse-user-avatars.png" },
      { id: 5, name: "Alex Wilson", avatar: "/diverse-user-avatars.png" },
      { id: 6, name: "Lisa Brown", avatar: "/diverse-user-avatars.png" },
    ],
    recentActivity: "Alex suggested The Local Burger",
    upcomingEvent: "Team lunch - Friday 12:30 PM",
  },
]

export function GroupList() {
  const [groups, setGroups] = useState(mockGroups)

  const handleLeaveGroup = (groupId: number) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId))
  }

  return (
    <div className="space-y-6">
      {groups.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No groups yet</h3>
          <p className="text-muted-foreground">Create or join a group to start discovering restaurants together</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Card key={group.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {group.isOwner && (
                        <>
                          <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            Group Settings
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Invite Members
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem onClick={() => handleLeaveGroup(group.id)} className="text-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        Leave Group
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {group.memberCount} members
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {group.restaurantCount} places
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Members */}
                <div className="space-y-2">
                  <div className="text-sm font-semibold">Members</div>
                  <div className="flex -space-x-2">
                    {group.members.slice(0, 4).map((member) => (
                      <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback className="text-xs">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {group.memberCount > 4 && (
                      <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                        <span className="text-xs font-semibold">+{group.memberCount - 4}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="space-y-2">
                  <div className="text-sm font-semibold">Recent Activity</div>
                  <p className="text-sm text-muted-foreground">{group.recentActivity}</p>
                </div>

                {/* Upcoming Event */}
                {group.upcomingEvent && (
                  <div className="space-y-2">
                    <div className="text-sm font-semibold flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Upcoming
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {group.upcomingEvent}
                    </Badge>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground">
                    Active {new Date(group.lastActivity).toLocaleDateString()}
                  </span>
                  <Link href={`/groups/${group.id}`}>
                    <Button size="sm" variant="outline">
                      View Group
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
