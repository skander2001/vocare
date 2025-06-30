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
import { Calendar, Clock, MapPin, User, Tag, FileText, Trash2, Save, AlertTriangle } from "lucide-react"
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
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white border-0 shadow-2xl">
        <DialogHeader className="space-y-4 pb-8 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {appointment ? "Termin bearbeiten" : "Neuen Termin erstellen"}
              </DialogTitle>
              <DialogDescription className="text-gray-600 mt-2">
                {appointment
                  ? "Bearbeiten Sie die Termindetails"
                  : "Erstellen Sie einen neuen Termin für Ihren Patienten"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 pt-4">
          {/* Title and Category Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <FileText className="h-5 w-5 text-indigo-600" />
                  </div>
                  <Label htmlFor="title" className="text-lg font-semibold text-gray-800">
                    Titel
                  </Label>
                </div>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="z.B. Hausbesuch, Beratung..."
                  className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 focus-ring text-lg py-3"
                  required
                />
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border-gray-100 shadow-soft hover-lift">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Tag className="h-5 w-5 text-green-600" />
                  </div>
                  <Label htmlFor="category" className="text-lg font-semibold text-gray-800">
                    Kategorie
                  </Label>
                </div>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="border-gray-200 focus:border-green-500 focus:ring-green-500 focus-ring text-lg py-3">
                    <SelectValue placeholder="Kategorie auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full shadow-soft"
                            style={{ backgroundColor: category.color || "#6b7280" }}
                          />
                          <span className="font-medium">{category.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedCategory && (
                  <Badge
                    className="mt-3 px-4 py-2 text-sm font-medium shadow-soft"
                    style={{
                      backgroundColor: selectedCategory.color + "15",
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-gray-100 shadow-soft hover-lift">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <Label htmlFor="start_time" className="text-lg font-semibold text-gray-800">
                    Startzeit
                  </Label>
                </div>
                <Input
                  id="start_time"
                  type="datetime-local"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 focus-ring text-lg py-3"
                  required
                />
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border-gray-100 shadow-soft hover-lift">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <Label htmlFor="end_time" className="text-lg font-semibold text-gray-800">
                    Endzeit
                  </Label>
                </div>
                <Input
                  id="end_time"
                  type="datetime-local"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  className="border-gray-200 focus:border-orange-500 focus:ring-orange-500 focus-ring text-lg py-3"
                />
              </div>
            </Card>
          </div>

          {/* Patient and Location Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-gray-100 shadow-soft hover-lift">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <User className="h-5 w-5 text-purple-600" />
                  </div>
                  <Label htmlFor="patient" className="text-lg font-semibold text-gray-800">
                    Patient
                  </Label>
                </div>
                <Select
                  value={formData.patient}
                  onValueChange={(value) => setFormData({ ...formData, patient: value })}
                >
                  <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-500 focus-ring text-lg py-3">
                    <SelectValue placeholder="Patient auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-soft">
                            {patient.firstname?.[0]}
                            {patient.lastname?.[0]}
                          </div>
                          <div>
                            <div className="font-medium">{patient.firstname} {patient.lastname}</div>
                            <div className="text-sm text-gray-500">Patient</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border-gray-100 shadow-soft hover-lift">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <MapPin className="h-5 w-5 text-red-600" />
                  </div>
                  <Label htmlFor="location" className="text-lg font-semibold text-gray-800">
                    Ort
                  </Label>
                </div>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="z.B. Praxis, Zuhause beim Patienten..."
                  className="border-gray-200 focus:border-red-500 focus:ring-red-500 focus-ring text-lg py-3"
                />
              </div>
            </Card>
          </div>

          {/* Notes */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-gray-100 shadow-soft hover-lift">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <FileText className="h-5 w-5 text-amber-600" />
                </div>
                <Label htmlFor="notes" className="text-lg font-semibold text-gray-800">
                  Notizen
                </Label>
              </div>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Zusätzliche Informationen zum Termin..."
                rows={4}
                className="border-gray-200 focus:border-amber-500 focus:ring-amber-500 focus-ring resize-none text-lg"
              />
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8 border-t border-gray-100">
            <div>
              {appointment && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={loading}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-soft hover-lift focus-ring"
                >
                  <Trash2 className="mr-2 h-5 w-5" />
                  Termin löschen
                </Button>
              )}
            </div>
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
                className="border-gray-300 hover:bg-gray-50 hover-scale focus-ring px-6 py-3"
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-glow hover-lift focus-ring px-8 py-3"
              >
                <Save className="mr-2 h-5 w-5" />
                {loading ? "Speichern..." : "Speichern"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
