"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus } from "lucide-react"
import { PersonCircle } from "./person-circle"
import { type Person, getSpouse, getChildren, getParents, getSiblings, getPets } from "@/lib/family-data"

interface FamilyTreeProps {
  person: Person
  onBack: () => void
  onPersonClick: (person: Person) => void
  onAddMember: () => void
}

export function FamilyTree({ person, onBack, onPersonClick, onAddMember }: FamilyTreeProps) {
  const [viewType, setViewType] = useState<"immediate" | "origin">("immediate")

  const spouse = getSpouse(person.id)
  const children = getChildren(person.id)
  const parents = getParents(person.id)
  const siblings = getSiblings(person.id)
  const pets = getPets(person.id)

  const toggleView = () => {
    setViewType((prev) => (prev === "immediate" ? "origin" : "immediate"))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex space-x-2">
          <Button
            variant={viewType === "immediate" ? "default" : "outline"}
            onClick={() => setViewType("immediate")}
            className="rounded-full"
          >
            {person.name.split(" ")[0]}'s Family
          </Button>
          <Button
            variant={viewType === "origin" ? "default" : "outline"}
            onClick={() => setViewType("origin")}
            className="rounded-full"
          >
            {person.name.split(" ").pop()}'s
          </Button>
        </div>
        <Button variant="ghost" size="icon" onClick={onAddMember}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {viewType === "immediate" ? (
        /* Immediate Family View */
        <div className="space-y-8">
          {/* Parents (Spouse and Person) */}
          <div className="flex justify-center items-center space-x-8">
            <PersonCircle person={person} size="large" onClick={() => onPersonClick(person)} showAge />
            {spouse && (
              <>
                <div className="w-8 h-0.5 bg-red-500"></div>
                <PersonCircle person={spouse} size="large" onClick={() => onPersonClick(spouse)} showAge />
              </>
            )}
          </div>

          {/* Children */}
          {children.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-0.5 h-8 bg-gray-400"></div>
              </div>
              <div className="flex justify-center space-x-6">
                {children.map((child) => (
                  <PersonCircle
                    key={child.id}
                    person={child}
                    size="medium"
                    onClick={() => onPersonClick(child)}
                    showAge
                  />
                ))}
              </div>
            </div>
          )}

          {/* Pets */}
          {pets.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Pets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center space-x-4">
                  {pets.map((pet) => (
                    <PersonCircle key={pet.id} person={pet} size="small" />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        /* Origin Family View */
        <div className="space-y-8">
          {/* Parents */}
          {parents.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-center font-semibold">Parents</h3>
              <div className="flex justify-center space-x-8">
                {parents.map((parent) => (
                  <PersonCircle
                    key={parent.id}
                    person={parent}
                    size="large"
                    onClick={() => onPersonClick(parent)}
                    showAge
                  />
                ))}
              </div>
            </div>
          )}

          {/* Siblings + Current Person */}
          <div className="space-y-4">
            <h3 className="text-center font-semibold">Siblings</h3>
            <div className="flex justify-center space-x-6">
              {[...siblings, person]
                .sort((a, b) => {
                  const aDate = new Date(a.dateOfBirth || "1900-01-01")
                  const bDate = new Date(b.dateOfBirth || "1900-01-01")
                  return aDate.getTime() - bDate.getTime()
                })
                .map((sibling) => (
                  <PersonCircle
                    key={sibling.id}
                    person={sibling}
                    size="medium"
                    onClick={() => onPersonClick(sibling)}
                    showAge
                  />
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
