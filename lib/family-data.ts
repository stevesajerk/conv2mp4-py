export interface Person {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  dateOfBirth?: string
  favoriteColor?: string
  notes?: string
  avatar?: string
  duolingoUsername?: string
  deceased?: boolean
  relationships?: {
    spouse?: string
    children?: string[]
    parents?: string[]
    siblings?: string[]
  }
}

export const familyData: Person[] = [
  {
    id: "adam",
    name: "Adam Holbrough",
    email: "adam.holbrough@gmail.com",
    phone: "(514) 531-8158",
    address: "2054 Ave Belgrave\nMontreal\nH4A 2L7\nQC",
    dateOfBirth: "1970-06-09",
    favoriteColor: "#ff6b35",
    notes: "Loves photography and hiking",
    avatar: "/placeholder.svg?height=100&width=100",
    duolingoUsername: "adamh_photo",
    relationships: {
      spouse: "elaine",
      children: ["nate"],
      parents: ["les", "betty"],
    },
  },
  {
    id: "elaine",
    name: "Elaine (Dix) Holbrough",
    email: "elaine.holbrough@gmail.com",
    phone: "(514) 531-6818",
    address: "2054 Ave Belgrave\nMontreal\nH4A 2L7\nQC",
    dateOfBirth: "1979-10-15",
    favoriteColor: "#4ade80",
    notes: "Teacher and artist",
    avatar: "/placeholder.svg?height=100&width=100",
    duolingoUsername: "elaine_teacher",
    relationships: {
      spouse: "adam",
      children: ["nate"],
    },
  },
  {
    id: "nate",
    name: "Nate",
    dateOfBirth: "2011-02-10",
    favoriteColor: "#3b82f6",
    notes: "Loves video games and soccer",
    avatar: "/placeholder.svg?height=100&width=100",
    relationships: {
      parents: ["adam", "elaine"],
    },
  },
  {
    id: "les",
    name: "Les Holbrough",
    dateOfBirth: "1945-03-15",
    favoriteColor: "#6b7280",
    deceased: true,
    avatar: "/placeholder.svg?height=100&width=100",
    relationships: {
      spouse: "betty",
      children: ["adam", "lynda", "kathy", "dean"],
    },
  },
  {
    id: "betty",
    name: "Betty (Coates) Holbrough",
    dateOfBirth: "1948-08-22",
    favoriteColor: "#ec4899",
    avatar: "/placeholder.svg?height=100&width=100",
    relationships: {
      spouse: "les",
      children: ["adam", "lynda", "kathy", "dean"],
    },
  },
  {
    id: "lynda",
    name: "Lynda",
    dateOfBirth: "1972-11-30",
    favoriteColor: "#8b5cf6",
    avatar: "/placeholder.svg?height=100&width=100",
    relationships: {
      parents: ["les", "betty"],
      siblings: ["adam", "kathy", "dean"],
    },
  },
  {
    id: "kathy",
    name: "Kathy",
    dateOfBirth: "1975-05-18",
    favoriteColor: "#f59e0b",
    avatar: "/placeholder.svg?height=100&width=100",
    relationships: {
      parents: ["les", "betty"],
      siblings: ["adam", "lynda", "dean"],
    },
  },
  {
    id: "dean",
    name: "Dean",
    dateOfBirth: "1978-12-03",
    favoriteColor: "#10b981",
    avatar: "/placeholder.svg?height=100&width=100",
    relationships: {
      parents: ["les", "betty"],
      siblings: ["adam", "lynda", "kathy"],
    },
  },
  {
    id: "aaron",
    name: "Aaron",
    dateOfBirth: "2005-07-20",
    favoriteColor: "#ef4444",
    avatar: "/placeholder.svg?height=100&width=100",
    relationships: {
      parents: ["adam", "elaine"],
    },
  },
  // Pets
  {
    id: "martin",
    name: "Martin",
    favoriteColor: "#000000",
    avatar: "/placeholder.svg?height=100&width=100",
    notes: "Family cat",
    deceased: true,
  },
  {
    id: "dd",
    name: "DD",
    favoriteColor: "#8b4513",
    avatar: "/placeholder.svg?height=100&width=100",
    notes: "Family dog",
    deceased: true,
  },
  {
    id: "mojo",
    name: "Mojo Howls",
    favoriteColor: "#654321",
    avatar: "/placeholder.svg?height=100&width=100",
    notes: "Family dog",
    deceased: true,
  },
  {
    id: "jc",
    name: "JC",
    favoriteColor: "#ffd700",
    avatar: "/placeholder.svg?height=100&width=100",
    notes: "Family dog",
  },
  {
    id: "biff",
    name: "Biff",
    favoriteColor: "#c0c0c0",
    avatar: "/placeholder.svg?height=100&width=100",
    notes: "Family dog",
  },
]

export function getSpouse(personId: string): Person | null {
  const person = familyData.find((p) => p.id === personId)
  if (!person?.relationships?.spouse) return null
  return familyData.find((p) => p.id === person.relationships.spouse) || null
}

export function getChildren(personId: string): Person[] {
  const person = familyData.find((p) => p.id === personId)
  if (!person?.relationships?.children) return []
  return familyData.filter((p) => person.relationships.children?.includes(p.id))
}

export function getParents(personId: string): Person[] {
  const person = familyData.find((p) => p.id === personId)
  if (!person?.relationships?.parents) return []
  return familyData.filter((p) => person.relationships.parents?.includes(p.id))
}

export function getSiblings(personId: string): Person[] {
  const person = familyData.find((p) => p.id === personId)
  if (!person?.relationships?.siblings) return []
  return familyData.filter((p) => person.relationships.siblings?.includes(p.id))
}

export function getPets(personId: string): Person[] {
  // For this demo, pets are associated with Adam's family
  if (personId === "adam" || personId === "elaine") {
    return familyData.filter((p) => ["martin", "dd", "mojo", "jc", "biff"].includes(p.id))
  }
  return []
}
