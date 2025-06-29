"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createAppointment, updateAppointment, deleteAppointment } from "@/lib/appointments"
import { Calendar, Clock, MapPin, User, Tag, FileText, Trash2, Save } from "lucide-react"
import type { Appointment, Patient, Category } from "@/types/index"

interface ModernAppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment: Appointment | null
  patients: Patient[]
  categories: Category[]
  onSaved: () => void
}

export function ModernAppointmentDialog({
  open,
  onOpenChange,
  appointment,
  patients,
  categories,
  onSaved,
}: ModernAppointmentDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    start_time: "",
    end_time: "",
    location: "",
    patient: "",
    category: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (appointment) {
      setFormData({
        title: appointment.title || "",
        start_time: appointment.start_time ? new Date(appointment.start_time).toISOString().slice(0, 16) : "",
        end_time: appointment.end_time ? new Date(appointment.end_time).toISOString().slice(0, 16) : "",
        location: appointment.location || "",
        patient: appointment.patient || "",
        category: appointment.category || "",
        notes: appointment.notes || "",
      })
    } else {
      setFormData({
        title: "",
        start_time: "",
        end_time: "",
        location: "",
        patient: "",
        category: "",
        notes: "",
      })
    }
  }, [appointment])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const appointmentData = {
        title: formData.title,
        start_time: formData.start_time ? new Date(formData.start_time).toISOString() : null,
        end_time: formData.end_time ? new Date(formData.end_time).toISOString() : null,
        location: formData.location || null,
        patient: formData.patient || null,
        category: formData.category || null,
        notes: formData.notes || null,
      }

      if (appointment) {
        await updateAppointment(appointment.id, appointmentData)
      } else {
        await createAppointment(appointmentData)
      }

      onSaved()
    } catch (error) {
      console.error("Error saving appointment:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!appointment) return

    setLoading(true)
    try {
      await deleteAppointment(appointment.id)
      onSaved()
    } catch (error) {
      console.error("Error deleting appointment:", error)
    } finally {
      setLoading(false)
    }
  }

  const selectedCategory = categories.find((cat) => cat.id === formData.category)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-indigo-50/30 border-0 shadow-2xl">
        <DialogHeader className="space-y-3 pb-6 border-b border-gray-100">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
            {appointment ? "Termin bearbeiten" : "Neuen Termin erstellen"}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {appointment ? "Bearbeiten Sie die Termindetails" : "Erstellen Sie einen neuen Termin für Ihren Patienten"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {/* Title and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4 bg-white/50 border-gray-100 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-indigo-500" />
                  <Label htmlFor="title" className="font-medium">
                    Titel
                  </Label>
                </div>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="z.B. Hausbesuch, Beratung..."
                  className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
            </Card>

            <Card className="p-4 bg-white/50 border-gray-100 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-cyan-500" />
                  <Label htmlFor="category" className="font-medium">
                    Kategorie
                  </Label>
                </div>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="border-gray-200 focus:border-cyan-500 focus:ring-cyan-500">
                    <SelectValue placeholder="Kategorie auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color || "#6b7280" }}
                          />
                          {category.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedCategory && (
                  <Badge
                    className="mt-2"
                    style={{
                      backgroundColor: selectedCategory.color + "20",
                      color: selectedCategory.color ?? undefined,
                      border: `1px solid ${selectedCategory.color}30`,
                    }}
                  >
                    {selectedCategory.label}
                  </Badge>
                )}
              </div>
            </Card>
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4 bg-white/50 border-gray-100 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-500" />
                  <Label htmlFor="start_time" className="font-medium">
                    Startzeit
                  </Label>
                </div>
                <Input
                  id="start_time"
                  type="datetime-local"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  className="border-gray-200 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
            </Card>

            <Card className="p-4 bg-white/50 border-gray-100 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <Label htmlFor="end_time" className="font-medium">
                    Endzeit
                  </Label>
                </div>
                <Input
                  id="end_time"
                  type="datetime-local"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </Card>
          </div>

          {/* Patient and Location Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4 bg-white/50 border-gray-100 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-indigo-500" />
                  <Label htmlFor="patient" className="font-medium">
                    Patient
                  </Label>
                </div>
                <Select
                  value={formData.patient}
                  onValueChange={(value) => setFormData({ ...formData, patient: value })}
                >
                  <SelectTrigger className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500">
                    <SelectValue placeholder="Patient auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {patient.firstname?.[0]}
                            {patient.lastname?.[0]}
                          </div>
                          {patient.firstname} {patient.lastname}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Card>

            <Card className="p-4 bg-white/50 border-gray-100 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <Label htmlFor="location" className="font-medium">
                    Ort
                  </Label>
                </div>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="z.B. Praxis, Zuhause beim Patienten..."
                  className="border-gray-200 focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </Card>
          </div>

          {/* Notes */}
          <Card className="p-4 bg-white/50 border-gray-100 shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <Label htmlFor="notes" className="font-medium">
                  Notizen
                </Label>
              </div>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Zusätzliche Informationen zum Termin..."
                rows={4}
                className="border-gray-200 focus:border-gray-500 focus:ring-gray-500 resize-none"
              />
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-100">
            <div>
              {appointment && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={loading}
                  className="bg-red-500 hover:bg-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Löschen
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
                className="border-gray-300 hover:bg-gray-50"
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white shadow-lg"
              >
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Speichern..." : "Speichern"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
