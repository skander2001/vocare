"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createAppointment, updateAppointment, deleteAppointment } from "@/lib/appointments"
import type { Appointment, Patient, Category } from "@/types/index"

interface AppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment: Appointment | null
  patients: Patient[]
  categories: Category[]
  onSaved: () => void
}

export function AppointmentDialog({
  open,
  onOpenChange,
  appointment,
  patients,
  categories,
  onSaved,
}: AppointmentDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    start: "",
    end: "",
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
        start: appointment.start ? new Date(appointment.start).toISOString().slice(0, 16) : "",
        end: appointment.end ? new Date(appointment.end).toISOString().slice(0, 16) : "",
        location: appointment.location || "",
        patient: appointment.patient || "",
        category: appointment.category || "",
        notes: appointment.notes || "",
      })
    } else {
      setFormData({
        title: "",
        start: "",
        end: "",
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
        ...formData,
        start: formData.start ? new Date(formData.start).toISOString() : null,
        end: formData.end ? new Date(formData.end).toISOString() : null,
        patient: formData.patient || null,
        category: formData.category || null,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{appointment ? "Termin bearbeiten" : "Neuen Termin erstellen"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titel</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Termin Titel"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Ort</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ort des Termins"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start">Startzeit</Label>
              <Input
                id="start"
                type="datetime-local"
                value={formData.start}
                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end">Endzeit</Label>
              <Input
                id="end"
                type="datetime-local"
                value={formData.end}
                onChange={(e) => setFormData({ ...formData, end: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Patient</Label>
              <Select value={formData.patient} onValueChange={(value) => setFormData({ ...formData, patient: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Patient auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.firstname} {patient.lastname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategorie</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kategorie auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color || "#gray" }} />
                        {category.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notizen</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Zusätzliche Notizen zum Termin"
              rows={3}
            />
          </div>

          <div className="flex justify-between pt-4">
            <div>
              {appointment && (
                <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
                  Löschen
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                Abbrechen
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Speichern..." : "Speichern"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
