"use client"

import { Card, CardContent } from "@/components/ui/card"
import { PersonCircle } from "./person-circle"
import type { Person } from "@/lib/family-data"

interface SearchResultsProps {
  query: string
  results: Person[]
  onPersonClick: (person: Person) => void
}

export function SearchResults({ query, results, onPersonClick }: SearchResultsProps) {
  if (!query) return null

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">Search Results ({results.length})</h3>
        {results.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {results.map((person) => (
              <div
                key={person.id}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                onClick={() => onPersonClick(person)}
              >
                <PersonCircle person={person} size="small" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{person.name}</p>
                  {person.email && <p className="text-sm text-muted-foreground truncate">{person.email}</p>}
                  {person.phone && <p className="text-sm text-muted-foreground">{person.phone}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">No family members found matching "{query}"</p>
        )}
      </CardContent>
    </Card>
  )
}
