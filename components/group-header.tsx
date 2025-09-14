"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Users, MapPin, Calendar, Settings, UserPlus, Share, MoreVertical } from "lucide-react"

interface GroupHeaderProps {
  group: {
    id: number
    name: string
    description: string
    memberCount: number
    restaurantCount: number
    isOwner: boolean
    createdAt: string
    tags: string[]
    members: Array<{
      id: number
      name: string
      avatar: string
      isOwner: boolean
    }>
  }
}

export function GroupHeader({ group }: GroupHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{group.name}</h1>
          <p className="text-muted-foreground">{group.description}</p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {group.memberCount} members
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {group.restaurantCount} restaurants
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Created {new Date(group.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <UserPlus className="h-4 w-4" />
            Invite
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Share className="mr-2 h-4 w-4" />
                Share Group
              </DropdownMenuItem>
              {group.isOwner && (
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Group Settings
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tags */}
      {group.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {group.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Member Avatars */}
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          {group.members.slice(0, 6).map((member) => (
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
          {group.memberCount > 6 && (
            <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
              <span className="text-xs font-semibold">+{group.memberCount - 6}</span>
            </div>
          )}
        </div>
        <span className="text-sm text-muted-foreground">
          {group.members
            .slice(0, 2)
            .map((m) => m.name)
            .join(", ")}
          {group.memberCount > 2 && ` and ${group.memberCount - 2} others`}
        </span>
      </div>
    </div>
  )
}
