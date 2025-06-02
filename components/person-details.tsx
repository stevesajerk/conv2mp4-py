"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ArrowLeft, Edit, Copy, ChevronDown, ChevronRight, Camera, Upload, Link } from "lucide-react"
import { PersonCircle } from "./person-circle"
import type { Person } from "@/lib/family-data"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface PersonDetailsProps {
  person: Person
  onBack: () => void
  onTreeView: () => void
  onPersonUpdate: (person: Person) => void
}

export function PersonDetails({ person, onBack, onTreeView, onPersonUpdate }: PersonDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedPerson, setEditedPerson] = useState(person)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    address: true,
    phone: true,
    email: true,
    personal: false,
  })

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleSave = () => {
    // Save the edited person data
    onPersonUpdate(editedPerson)
    setIsEditing(false)

    // Show success message
    alert("Changes saved successfully!")
  }

  const fetchDuolingoAvatar = async (username: string) => {
    try {
      const mockAvatarUrl = `https://d35aaqx5ub95lt.cloudfront.net/images/profile_pictures/${username}.svg`

      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const updatedPerson = {
          ...editedPerson,
          avatar: mockAvatarUrl,
          duolingoUsername: username,
        }
        setEditedPerson(updatedPerson)
        onPersonUpdate(updatedPerson)
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

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-bold">{person.name}</h1>
        <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
          <Edit className="w-4 h-4" />
        </Button>
      </div>

      {/* Profile Picture */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <PersonCircle person={person} size="large" onClick={onTreeView} showAge />
          {isEditing && (
            <Dialog>
              <DialogTrigger asChild>
                <Button size="icon" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8" variant="secondary">
                  <Camera className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Update Profile Picture</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Button
                      onClick={() => document.getElementById("photo-upload")?.click()}
                      className="w-full"
                      variant="outline"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </Button>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = (event) => {
                            const updatedPerson = {
                              ...editedPerson,
                              avatar: event.target?.result as string,
                            }
                            setEditedPerson(updatedPerson)
                            onPersonUpdate(updatedPerson)
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        const username = prompt("Enter your Duolingo username:")
                        if (username) {
                          fetchDuolingoAvatar(username)
                        }
                      }}
                      className="w-full"
                      variant="outline"
                    >
                      <Link className="w-4 h-4 mr-2" />
                      Connect Duolingo
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <Button variant="ghost" onClick={onTreeView} className="text-sm">
          View Family Tree
        </Button>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        {/* Address */}
        <Collapsible open={openSections.address} onOpenChange={() => toggleSection("address")}>
          <CollapsibleTrigger asChild>
            <Card className="cursor-pointer hover:bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm">
                  Address
                  {openSections.address ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </CardTitle>
              </CardHeader>
            </Card>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card>
              <CardContent className="pt-2">
                {isEditing ? (
                  <Textarea
                    value={editedPerson.address || ""}
                    onChange={(e) => setEditedPerson((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter address"
                  />
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="text-sm">{person.address || "No address provided"}</div>
                    {person.address && (
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(person.address!)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* Phone */}
        <Collapsible open={openSections.phone} onOpenChange={() => toggleSection("phone")}>
          <CollapsibleTrigger asChild>
            <Card className="cursor-pointer hover:bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm">
                  Phone
                  {openSections.phone ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </CardTitle>
              </CardHeader>
            </Card>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card>
              <CardContent className="pt-2">
                {isEditing ? (
                  <Input
                    value={editedPerson.phone || ""}
                    onChange={(e) => setEditedPerson((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                  />
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="text-sm">{person.phone || "No phone provided"}</div>
                    {person.phone && (
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(person.phone!)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* Email */}
        <Collapsible open={openSections.email} onOpenChange={() => toggleSection("email")}>
          <CollapsibleTrigger asChild>
            <Card className="cursor-pointer hover:bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm">
                  Email
                  {openSections.email ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </CardTitle>
              </CardHeader>
            </Card>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card>
              <CardContent className="pt-2">
                {isEditing ? (
                  <Input
                    type="email"
                    value={editedPerson.email || ""}
                    onChange={(e) => setEditedPerson((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email"
                  />
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="text-sm">{person.email || "No email provided"}</div>
                    {person.email && (
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(person.email!)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* Personal Info */}
        <Collapsible open={openSections.personal} onOpenChange={() => toggleSection("personal")}>
          <CollapsibleTrigger asChild>
            <Card className="cursor-pointer hover:bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm">
                  Personal Info
                  {openSections.personal ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </CardTitle>
              </CardHeader>
            </Card>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card>
              <CardContent className="pt-2 space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Date of Birth</label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editedPerson.dateOfBirth || ""}
                      onChange={(e) => setEditedPerson((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                    />
                  ) : (
                    <div className="text-sm">{person.dateOfBirth || "Not provided"}</div>
                  )}
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Favorite Color</label>
                  {isEditing ? (
                    <Input
                      type="color"
                      value={editedPerson.favoriteColor || "#3b82f6"}
                      onChange={(e) => setEditedPerson((prev) => ({ ...prev, favoriteColor: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: person.favoriteColor || "#3b82f6" }}
                      />
                      <span className="text-sm">{person.favoriteColor || "Not set"}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={editedPerson.notes || ""}
                onChange={(e) => setEditedPerson((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Add notes..."
                className="min-h-[100px]"
              />
            ) : (
              <div className="text-sm text-muted-foreground">{person.notes || "No notes"}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {isEditing && (
        <div className="flex space-x-2">
          <Button onClick={handleSave} className="flex-1">
            Save Changes
          </Button>
          <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
            Cancel
          </Button>
        </div>
      )}
    </div>
  )
}
