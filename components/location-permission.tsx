"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, AlertCircle } from "lucide-react"

interface LocationPermissionProps {
  onLocationGranted: (location: { lat: number; lng: number }) => void
}

export function LocationPermission({ onLocationGranted }: LocationPermissionProps) {
  const [permissionState, setPermissionState] = useState<"prompt" | "granted" | "denied" | "loading">("prompt")

  useEffect(() => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setPermissionState("denied")
      return
    }

    // Check current permission state
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          getCurrentLocation()
        } else if (result.state === "denied") {
          setPermissionState("denied")
        }
      })
    }
  }, [])

  const getCurrentLocation = () => {
    setPermissionState("loading")

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setPermissionState("granted")
        onLocationGranted(location)
      },
      (error) => {
        console.error("Error getting location:", error)
        setPermissionState("denied")
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  }

  const requestLocation = () => {
    getCurrentLocation()
  }

  if (permissionState === "granted") {
    return null // Don't render anything if permission is granted
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            {permissionState === "denied" ? (
              <AlertCircle className="h-8 w-8 text-destructive" />
            ) : (
              <MapPin className="h-8 w-8 text-primary" />
            )}
          </div>
          <CardTitle>{permissionState === "denied" ? "Location Access Needed" : "Enable Location Services"}</CardTitle>
          <CardDescription>
            {permissionState === "denied"
              ? "We need your location to show nearby restaurants. Please enable location access in your browser settings."
              : "Allow TasteTrail to access your location to discover restaurants near you."}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {permissionState === "denied" ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                To enable location access:
                <br />
                1. Click the location icon in your address bar
                <br />
                2. Select "Allow" for location permissions
                <br />
                3. Refresh this page
              </p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Refresh Page
              </Button>
            </div>
          ) : (
            <Button onClick={requestLocation} disabled={permissionState === "loading"} className="w-full">
              {permissionState === "loading" ? "Getting Location..." : "Allow Location Access"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
