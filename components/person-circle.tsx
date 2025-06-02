"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { Person } from "@/lib/family-data"

interface PersonCircleProps {
  person: Person
  size?: "small" | "medium" | "large"
  onClick?: () => void
  showAge?: boolean
}

export function PersonCircle({ person, size = "medium", onClick, showAge = false }: PersonCircleProps) {
  const sizeClasses = {
    small: "w-12 h-12",
    medium: "w-16 h-16",
    large: "w-24 h-24",
  }

  const getAge = () => {
    if (!person.dateOfBirth) return null
    const today = new Date()
    const birthDate = new Date(person.dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return (
    <div className="relative flex flex-col items-center space-y-1">
      <div
        className={cn("relative cursor-pointer transition-transform hover:scale-105", onClick && "cursor-pointer")}
        onClick={onClick}
      >
        <Avatar className={cn(sizeClasses[size], person.deceased && "ring-2 ring-red-500 ring-offset-2")}>
          <AvatarImage src={person.avatar || "/placeholder.svg"} alt={person.name} />
          <AvatarFallback className="bg-orange-400 text-white font-bold">
            {person.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        {showAge && (
          <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {getAge()}
          </div>
        )}
      </div>

      {size !== "small" && <span className="text-xs text-center max-w-16 truncate">{person.name.split(" ")[0]}</span>}
    </div>
  )
}
