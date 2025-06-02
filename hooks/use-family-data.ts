"use client"

import { useCallback } from "react"
import { useLocalStorage } from "./use-local-storage"
import { familyData, type Person } from "@/lib/family-data"

interface FamilyAction {
  id: string
  type: "add" | "update" | "delete"
  timestamp: number
  description: string
  previousState?: Person
  newState?: Person
  personId: string
}

export function useFamilyData() {
  const [familyMembers, setFamilyMembers] = useLocalStorage("family-members", familyData)
  const [actionHistory, setActionHistory] = useLocalStorage<FamilyAction[]>("family-action-history", [])
  const [historyIndex, setHistoryIndex] = useLocalStorage("family-history-index", -1)

  const addAction = useCallback(
    (action: Omit<FamilyAction, "id" | "timestamp">) => {
      const newAction: FamilyAction = {
        ...action,
        id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
      }

      setActionHistory((prev) => {
        // Remove any actions after current index (when undoing then making new changes)
        const newHistory = prev.slice(0, historyIndex + 1)
        // Add new action
        newHistory.push(newAction)
        // Keep only last 50 actions to prevent memory issues
        return newHistory.slice(-50)
      })

      setHistoryIndex((prev) => Math.min(prev + 1, 49))
    },
    [historyIndex, setActionHistory, setHistoryIndex],
  )

  const updatePerson = useCallback(
    (updatedPerson: Person) => {
      const previousPerson = familyMembers.find((p) => p.id === updatedPerson.id)

      setFamilyMembers((prev) => prev.map((person) => (person.id === updatedPerson.id ? updatedPerson : person)))

      if (previousPerson) {
        addAction({
          type: "update",
          description: `Updated ${updatedPerson.name}'s information`,
          previousState: previousPerson,
          newState: updatedPerson,
          personId: updatedPerson.id,
        })
      }
    },
    [familyMembers, setFamilyMembers, addAction],
  )

  const addPerson = useCallback(
    (newPerson: Person) => {
      setFamilyMembers((prev) => [...prev, newPerson])

      addAction({
        type: "add",
        description: `Added ${newPerson.name} to the family`,
        newState: newPerson,
        personId: newPerson.id,
      })
    },
    [setFamilyMembers, addAction],
  )

  const deletePerson = useCallback(
    (personId: string) => {
      const personToDelete = familyMembers.find((p) => p.id === personId)

      if (personToDelete) {
        setFamilyMembers((prev) => prev.filter((person) => person.id !== personId))

        addAction({
          type: "delete",
          description: `Removed ${personToDelete.name} from the family`,
          previousState: personToDelete,
          personId: personId,
        })
      }
    },
    [familyMembers, setFamilyMembers, addAction],
  )

  const undo = useCallback(() => {
    if (historyIndex >= 0) {
      const actionToUndo = actionHistory[historyIndex]

      if (actionToUndo) {
        switch (actionToUndo.type) {
          case "add":
            // Remove the added person
            setFamilyMembers((prev) => prev.filter((person) => person.id !== actionToUndo.personId))
            break
          case "update":
            // Restore previous state
            if (actionToUndo.previousState) {
              setFamilyMembers((prev) =>
                prev.map((person) => (person.id === actionToUndo.personId ? actionToUndo.previousState! : person)),
              )
            }
            break
          case "delete":
            // Restore deleted person
            if (actionToUndo.previousState) {
              setFamilyMembers((prev) => [...prev, actionToUndo.previousState!])
            }
            break
        }

        setHistoryIndex((prev) => prev - 1)
        return actionToUndo
      }
    }
    return null
  }, [historyIndex, actionHistory, setFamilyMembers, setHistoryIndex])

  const redo = useCallback(() => {
    if (historyIndex < actionHistory.length - 1) {
      const actionToRedo = actionHistory[historyIndex + 1]

      if (actionToRedo) {
        switch (actionToRedo.type) {
          case "add":
            // Re-add the person
            if (actionToRedo.newState) {
              setFamilyMembers((prev) => [...prev, actionToRedo.newState!])
            }
            break
          case "update":
            // Apply new state
            if (actionToRedo.newState) {
              setFamilyMembers((prev) =>
                prev.map((person) => (person.id === actionToRedo.personId ? actionToRedo.newState! : person)),
              )
            }
            break
          case "delete":
            // Remove the person again
            setFamilyMembers((prev) => prev.filter((person) => person.id !== actionToRedo.personId))
            break
        }

        setHistoryIndex((prev) => prev + 1)
        return actionToRedo
      }
    }
    return null
  }, [historyIndex, actionHistory, setFamilyMembers, setHistoryIndex])

  const clearHistory = useCallback(() => {
    setActionHistory([])
    setHistoryIndex(-1)
  }, [setActionHistory, setHistoryIndex])

  const canUndo = historyIndex >= 0
  const canRedo = historyIndex < actionHistory.length - 1

  return {
    familyMembers,
    actionHistory: actionHistory.slice(0, historyIndex + 1),
    updatePerson,
    addPerson,
    deletePerson,
    undo,
    redo,
    clearHistory,
    canUndo,
    canRedo,
  }
}
