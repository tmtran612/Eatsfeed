"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, MapPin, Heart } from "lucide-react"

// Mock chat messages
const mockMessages = [
  {
    id: 1,
    user: { name: "Sarah Wilson", avatar: "/diverse-user-avatars.png" },
    message: "Hey everyone! I just added Bella Vista Italian to our group. The pasta there is amazing! 🍝",
    timestamp: "2024-01-15T10:30:00Z",
    type: "message",
  },
  {
    id: 2,
    user: { name: "Mike Johnson", avatar: "/diverse-user-avatars.png" },
    message: "Great choice! I've been wanting to try that place.",
    timestamp: "2024-01-15T10:32:00Z",
    type: "message",
  },
  {
    id: 3,
    user: { name: "System", avatar: "" },
    message: "Jane Smith voted 👍 on Bella Vista Italian",
    timestamp: "2024-01-15T10:35:00Z",
    type: "activity",
    restaurant: "Bella Vista Italian",
  },
  {
    id: 4,
    user: { name: "Jane Smith", avatar: "/diverse-user-avatars.png" },
    message: "Should we plan a group dinner there this weekend?",
    timestamp: "2024-01-15T10:40:00Z",
    type: "message",
  },
  {
    id: 5,
    user: { name: "System", avatar: "" },
    message: "Alex Wilson added The Local Burger to the group",
    timestamp: "2024-01-15T11:00:00Z",
    type: "activity",
    restaurant: "The Local Burger",
  },
]

interface GroupChatProps {
  groupId: number
}

export function GroupChat({ groupId }: GroupChatProps) {
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message = {
      id: Date.now(),
      user: { name: "John Doe", avatar: "/diverse-user-avatars.png" },
      message: newMessage,
      timestamp: new Date().toISOString(),
      type: "message" as const,
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">Group Chat</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => {
            const showDate = index === 0 || formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp)

            return (
              <div key={message.id} className="space-y-2">
                {showDate && (
                  <div className="text-center">
                    <Badge variant="outline" className="text-xs">
                      {formatDate(message.timestamp)}
                    </Badge>
                  </div>
                )}

                {message.type === "activity" ? (
                  <div className="flex items-center justify-center">
                    <div className="bg-muted rounded-lg px-3 py-2 text-sm text-muted-foreground flex items-center gap-2">
                      {message.message.includes("voted") ? (
                        <Heart className="h-4 w-4" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                      {message.message}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.user.avatar || "/placeholder.svg"} alt={message.user.name} />
                      <AvatarFallback className="text-xs">
                        {message.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{message.user.name}</span>
                        <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                      </div>
                      <div className="bg-muted rounded-lg px-3 py-2 text-sm">{message.message}</div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Message Input */}
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
