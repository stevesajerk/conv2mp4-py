"use client"

import type React from "react"
import type { Person } from "@/types/person" // Declare the Person variable

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Send, Upload, Link } from "lucide-react"
import { PersonCircle } from "./person-circle"

interface AddFamilyMemberProps {
  onBack: () => void
  onSave: () => void
  onAddMember: (person: Person) => void
}

export function AddFamilyMember({ onBack, onSave, onAddMember }: AddFamilyMemberProps) {
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    favoriteColor: "#3b82f6",
    notes: "",
    sendInvite: false,
    avatar: "",
    duolingoUsername: "",
  })

  const fetchDuolingoAvatar = async (username: string) => {
    try {
      const mockAvatarUrl = `https://d35aaqx5ub95lt.cloudfront.net/images/profile_pictures/${username}.svg`

      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        setFormData((prev) => ({
          ...prev,
          avatar: mockAvatarUrl,
          duolingoUsername: username,
        }))
      }
      img.onerror = () => {
        alert("Could not find Duolingo avatar for this username. Please check the username or upload a photo instead.")
      }
      img.src = mockAvatarUrl
    } catch (error) {
      console.error("Error fetching Duolingo avatar:", error)
      alert("Error connecting to Duolingo. Please try again later.")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Generate a unique ID for the new family member
    const newId = `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create the new family member object
    const newMember: Person = {
      id: newId,
      name: formData.name,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      address: formData.address || undefined,
      dateOfBirth: formData.dateOfBirth || undefined,
      favoriteColor: formData.favoriteColor,
      notes: formData.notes || undefined,
      avatar: formData.avatar || undefined,
      duolingoUsername: formData.duolingoUsername || undefined,
      relationships: {
        // You can add relationship logic here based on the selected relationship
      },
    }

    // Add the new member to the family data
    onAddMember(newMember)

    if (formData.sendInvite && formData.email) {
      // Send invitation email (mock implementation)
      console.log("Sending invitation to:", formData.email)
      alert(`Invitation sent to ${formData.email}!`)
    }

    // Show success message
    alert(`${formData.name} has been added to the family!`)

    onSave()
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-bold">Add Family Member</h1>
        <div></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="relationship">Relationship</Label>
              <Select
                value={formData.relationship}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, relationship: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="sibling">Sibling</SelectItem>
                  <SelectItem value="grandparent">Grandparent</SelectItem>
                  <SelectItem value="grandchild">Grandchild</SelectItem>
                  <SelectItem value="aunt-uncle">Aunt/Uncle</SelectItem>
                  <SelectItem value="cousin">Cousin</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <PersonCircle
                person={{
                  id: "temp",
                  name: formData.name || "New Member",
                  avatar: formData.avatar,
                  favoriteColor: formData.favoriteColor,
                }}
                size="large"
              />

              <div className="flex flex-col space-y-2 w-full">
                <Button
                  type="button"
                  onClick={() => document.getElementById("new-member-photo-upload")?.click()}
                  variant="outline"
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
                <input
                  id="new-member-photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = (event) => {
                        setFormData((prev) => ({
                          ...prev,
                          avatar: event.target?.result as string,
                        }))
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />

                <Button
                  type="button"
                  onClick={() => {
                    const username = prompt("Enter Duolingo username:")
                    if (username) {
                      fetchDuolingoAvatar(username)
                    }
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <Link className="w-4 h-4 mr-2" />
                  Connect Duolingo
                </Button>

                {formData.avatar && (
                  <Button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, avatar: "", duolingoUsername: "" }))}
                    variant="ghost"
                    className="w-full text-red-500 hover:text-red-700"
                  >
                    Remove Picture
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="favoriteColor">Favorite Color</Label>
              <Input
                id="favoriteColor"
                type="color"
                value={formData.favoriteColor}
                onChange={(e) => setFormData((prev) => ({ ...prev, favoriteColor: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional information..."
              />
            </div>
          </CardContent>
        </Card>

        {formData.email && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sendInvite"
                  checked={formData.sendInvite}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, sendInvite: checked as boolean }))}
                />
                <Label htmlFor="sendInvite" className="flex items-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Send invitation to join the family app</span>
                </Label>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex space-x-2">
          <Button type="submit" className="flex-1">
            Add Family Member
          </Button>
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
