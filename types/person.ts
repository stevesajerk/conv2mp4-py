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
