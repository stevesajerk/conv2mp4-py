"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import { PersonCircle } from "@/components/person-circle"
import { PersonDetails } from "@/components/person-details"
import { FamilyTree } from "@/components/family-tree"
import { AddFamilyMember } from "@/components/add-family-member"
import { useTheme } from "@/components/theme-provider"
import { familyData, type Person } from "@/lib/family-data"

export default function FamilyContactsApp() {
  const [currentView, setCurrentView] = useState<"home" | "details" | "tree" | "add">("home")
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [nextBirthday, setNextBirthday] = useState<{ person: Person; daysUntil: number } | null>(null)
  const { theme } = useTheme()

  // Current user (you can modify this to be dynamic)
  const currentUser = familyData.find((p) => p.id === "adam") || familyData[0]

  useEffect(() => {
    // Calculate next birthday
    const today = new Date()
    const birthdays = familyData
      .filter((person) => person.dateOfBirth && !person.deceased)
      .map((person) => {
        const birthDate = new Date(person.dateOfBirth!)
        const thisYear = today.getFullYear()
        const birthdayThisYear = new Date(thisYear, birthDate.getMonth(), birthDate.getDate())

        if (birthdayThisYear < today) {
          birthdayThisYear.setFullYear(thisYear + 1)
        }

        const daysUntil = Math.ceil((birthdayThisYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        return { person, daysUntil }
      })
      .sort((a, b) => a.daysUntil - b.daysUntil)

    if (birthdays.length > 0) {
      setNextBirthday(birthdays[0])
    }
  }, [])

  const handlePersonClick = (person: Person) => {
    setSelectedPerson(person)
    setCurrentView("details")
  }

  const handleTreeView = (person: Person) => {
    setSelectedPerson(person)
    setCurrentView("tree")
  }

  const getGradientBackground = (person: Person) => {
    if (!person.favoriteColor) return ""
    const color = person.favoriteColor
    return theme === "dark"
      ? `linear-gradient(135deg, ${color} 0%, #000000 100%)`
      : `linear-gradient(135deg, ${color} 0%, #ffffff 100%)`
  }

  if (currentView === "details" && selectedPerson) {
    return (
      <div className="min-h-screen p-4" style={{ background: getGradientBackground(selectedPerson) }}>
        <PersonDetails
          person={selectedPerson}
          onBack={() => setCurrentView("home")}
          onTreeView={() => handleTreeView(selectedPerson)}
        />
      </div>
    )
  }

  if (currentView === "tree" && selectedPerson) {
    return (
      <div className="min-h-screen p-4 bg-background">
        <FamilyTree
          person={selectedPerson}
          onBack={() => setCurrentView("home")}
          onPersonClick={handlePersonClick}
          onAddMember={() => setCurrentView("add")}
        />
      </div>
    )
  }

  if (currentView === "add") {
    return (
      <div className="min-h-screen p-4 bg-background">
        <AddFamilyMember onBack={() => setCurrentView("home")} onSave={() => setCurrentView("home")} />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 bg-background">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <Button variant="secondary" className="bg-slate-600 text-white hover:bg-slate-700 rounded-2xl px-6 py-3">
            THE WHOLE FAMMDAMILY
          </Button>
        </div>

        {/* Current User */}
        <div className="flex flex-col items-center space-y-4">
          <PersonCircle person={currentUser} size="large" onClick={() => handlePersonClick(currentUser)} />
          <span className="text-lg font-medium">Me</span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="SEARCH"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted rounded-full"
          />
        </div>

        {/* Next Birthday */}
        {nextBirthday && (
          <Card className="bg-green-600 text-white">
            <CardContent className="p-4 text-center">
              <p className="text-sm">
                {nextBirthday.person.name}'s birthday is coming up in{" "}
                <span className="font-bold">{nextBirthday.daysUntil} days</span>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="flex justify-center space-x-4">
          <Button onClick={() => handleTreeView(currentUser)} variant="outline" className="rounded-full">
            View Family Tree
          </Button>
          <Button onClick={() => setCurrentView("add")} variant="outline" size="icon" className="rounded-full">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
