"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MapPin, Users, Heart, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

export function DashboardHeader() {
  const pathname = usePathname()

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <MapPin className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">TasteTrail</h1>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard">
              <Button variant={pathname === "/dashboard" ? "default" : "ghost"} className="gap-2">
                <MapPin className="h-4 w-4" />
                Discover
              </Button>
            </Link>
            <Link href="/saved">
              <Button variant={pathname === "/saved" ? "default" : "ghost"} className="gap-2">
                <Heart className="h-4 w-4" />
                Saved
              </Button>
            </Link>
            <Link href="/groups">
              <Button variant={pathname === "/groups" ? "default" : "ghost"} className="gap-2">
                <Users className="h-4 w-4" />
                Groups
              </Button>
            </Link>
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span tabIndex={0} role="button" aria-label="Open user menu" className="relative h-10 w-10 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/diverse-user-avatars.png" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => signOut({ callbackUrl: "/" })} variant="destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
