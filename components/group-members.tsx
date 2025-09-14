"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Crown, MoreVertical, UserMinus, Shield, Calendar } from "lucide-react"

interface GroupMembersProps {
  members: Array<{
    id: number
    name: string
    avatar: string
    isOwner: boolean
    joinedAt: string
  }>
  isOwner: boolean
}

export function GroupMembers({ members, isOwner }: GroupMembersProps) {
  const [memberList, setMemberList] = useState(members)

  const handleRemoveMember = (memberId: number) => {
    setMemberList((prev) => prev.filter((m) => m.id !== memberId))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Group Members ({memberList.length})</h3>
        {isOwner && (
          <Button variant="outline" size="sm">
            Manage Members
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {memberList.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{member.name}</h4>
                      {member.isOwner && <Crown className="h-4 w-4 text-yellow-500" />}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {isOwner && !member.isOwner && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Shield className="mr-2 h-4 w-4" />
                        Make Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRemoveMember(member.id)} className="text-destructive">
                        <UserMinus className="mr-2 h-4 w-4" />
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <Badge variant={member.isOwner ? "default" : "secondary"} className="text-xs">
                  {member.isOwner ? "Owner" : "Member"}
                </Badge>

                <div className="text-xs text-muted-foreground">Active today</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
