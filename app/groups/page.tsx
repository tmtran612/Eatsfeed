"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { GroupList } from "@/components/group-list"
import { CreateGroupDialog } from "@/components/create-group-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function GroupsPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Food Groups</h1>
              <p className="text-muted-foreground">Discover restaurants together with friends and family</p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Group
            </Button>
          </div>

          <GroupList />
        </div>
      </main>

      <CreateGroupDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </div>
  )
}
