import { AuthForm } from "@/components/auth-form"
import { MapPin, Users, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Hero Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-balance">
                Discover Your Next
                <span className="text-primary"> Favorite </span>
                Restaurant
              </h1>
              <p className="text-xl text-muted-foreground text-pretty">
                AI-powered restaurant discovery with swipe-to-save functionality and social group features. Find amazing
                places to eat with friends.
              </p>
            </div>

            {/* Features */}
            <div className="grid gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Map & Swipe Discovery</h3>
                  <p className="text-muted-foreground">Explore restaurants on a map or swipe through curated cards</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">AI-Powered Summaries</h3>
                  <p className="text-muted-foreground">
                    Get intelligent review summaries and personalized recommendations
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Social Groups</h3>
                  <p className="text-muted-foreground">
                    Create groups with friends to discover and vote on restaurants together
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Auth Form */}
          <div className="flex justify-center">
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  )
}
