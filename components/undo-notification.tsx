"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Undo2, X } from "lucide-react"

interface FamilyAction {
  id: string
  type: "add" | "update" | "delete"
  timestamp: number
  description: string
  previousState?: any
  newState?: any
  personId: string
}

interface UndoNotificationProps {
  action: FamilyAction | null
  onUndo: () => void
  onDismiss: () => void
}

export function UndoNotification({ action, onUndo, onDismiss }: UndoNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (action) {
      setIsVisible(true)
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onDismiss, 300) // Wait for animation to complete
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [action, onDismiss])

  if (!action || !isVisible) return null

  return (
    <Card className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50 shadow-lg animate-in slide-in-from-bottom-2">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium">{action.description}</p>
            <p className="text-xs text-muted-foreground">Action completed</p>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onUndo()
                setIsVisible(false)
                setTimeout(onDismiss, 300)
              }}
              className="flex items-center space-x-1"
            >
              <Undo2 className="w-3 h-3" />
              <span>Undo</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsVisible(false)
                setTimeout(onDismiss, 300)
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
