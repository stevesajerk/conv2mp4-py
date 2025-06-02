"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Undo2, Redo2, History, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface FamilyAction {
  id: string
  type: "add" | "update" | "delete"
  timestamp: number
  description: string
  previousState?: any
  newState?: any
  personId: string
}

interface UndoRedoControlsProps {
  onUndo: () => any
  onRedo: () => any
  onClearHistory: () => void
  canUndo: boolean
  canRedo: boolean
  actionHistory: FamilyAction[]
}

export function UndoRedoControls({
  onUndo,
  onRedo,
  onClearHistory,
  canUndo,
  canRedo,
  actionHistory,
}: UndoRedoControlsProps) {
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const getActionIcon = (type: string) => {
    switch (type) {
      case "add":
        return "+"
      case "update":
        return "✏️"
      case "delete":
        return "🗑️"
      default:
        return "•"
    }
  }

  const getActionColor = (type: string) => {
    switch (type) {
      case "add":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "update":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "delete":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 shadow-lg">
      <CardContent className="p-3">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className="flex items-center space-x-1"
          >
            <Undo2 className="w-4 h-4" />
            <span className="hidden sm:inline">Undo</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            className="flex items-center space-x-1"
          >
            <Redo2 className="w-4 h-4" />
            <span className="hidden sm:inline">Redo</span>
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center space-x-1">
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">History</span>
                {actionHistory.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {actionHistory.length}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Action History</span>
                  {actionHistory.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm("Are you sure you want to clear all history? This cannot be undone.")) {
                          onClearHistory()
                        }
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[300px] w-full">
                {actionHistory.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No actions yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {actionHistory
                      .slice()
                      .reverse()
                      .map((action, index) => (
                        <div key={action.id} className="flex items-center space-x-3 p-2 rounded-lg border bg-card">
                          <div className="flex-shrink-0">
                            <Badge className={getActionColor(action.type)}>{getActionIcon(action.type)}</Badge>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{action.description}</p>
                            <p className="text-xs text-muted-foreground">{formatTimestamp(action.timestamp)}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
