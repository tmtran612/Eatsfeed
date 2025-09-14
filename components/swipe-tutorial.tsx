"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Heart, ArrowLeft, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

interface SwipeTutorialProps {
  onComplete: () => void
}

export function SwipeTutorial({ onComplete }: SwipeTutorialProps) {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: "Welcome to TasteTrail!",
      description: "Discover restaurants by swiping through personalized recommendations",
      action: "Get Started",
    },
    {
      title: "Swipe Right to Save",
      description: "When you see a restaurant you like, swipe right or tap the heart button",
      action: "Got it",
    },
    {
      title: "Swipe Left to Skip",
      description: "Not interested? Swipe left or tap the X button to see the next option",
      action: "Understood",
    },
    {
      title: "Ready to Explore!",
      description: "Start swiping to discover amazing restaurants near you",
      action: "Start Swiping",
    },
  ]

  const currentStep = steps[step]

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      onComplete()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full">
        <Card>
          <CardContent className="p-6 text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{currentStep.title}</h2>
              <p className="text-muted-foreground">{currentStep.description}</p>
            </div>

            {step === 1 && (
              <div className="relative">
                <div className="bg-muted rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Italian</Badge>
                    <div className="text-sm">★ 4.5</div>
                  </div>
                  <h3 className="font-semibold">Sample Restaurant</h3>
                </div>
                <motion.div
                  className="absolute -right-2 top-1/2 -translate-y-1/2"
                  animate={{ x: [0, 10, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                >
                  <div className="bg-green-500 text-white p-2 rounded-full">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </motion.div>
              </div>
            )}

            {step === 2 && (
              <div className="relative">
                <div className="bg-muted rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Japanese</Badge>
                    <div className="text-sm">★ 4.2</div>
                  </div>
                  <h3 className="font-semibold">Another Restaurant</h3>
                </div>
                <motion.div
                  className="absolute -left-2 top-1/2 -translate-y-1/2"
                  animate={{ x: [0, -10, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                >
                  <div className="bg-red-500 text-white p-2 rounded-full">
                    <ArrowLeft className="h-4 w-4" />
                  </div>
                </motion.div>
              </div>
            )}

            {(step === 1 || step === 2) && (
              <div className="flex justify-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <X className="h-4 w-4 text-red-500" />
                  Skip
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Heart className="h-4 w-4 text-green-500" />
                  Save
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-2">
              {steps.map((_, index) => (
                <div key={index} className={`h-2 w-2 rounded-full ${index === step ? "bg-primary" : "bg-muted"}`} />
              ))}
            </div>

            <Button onClick={nextStep} className="w-full">
              {currentStep.action}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
