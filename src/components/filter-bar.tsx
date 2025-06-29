"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Filter } from "lucide-react"
import type { Appointment, Patient, Category } from "@/types/index"

interface FilterBarProps {
  appointments: Appointment[]
  patients: Patient[]
  categories: Category[]
  onFilter: (filtered: Appointment[]) => void
}

export function FilterBar({ appointments, patients, categories, onFilter }: FilterBarProps) {
  const [selectedPatient, setSelectedPatient] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedPeriod, setSelectedPeriod] = useState<string>("")

  useEffect(() => {
    filterAppointments()
  }, [selectedPatient, selectedCategory, selectedPeriod, appointments])

  const filterAppointments = () => {
    let filtered = [...appointments]

    if (selectedPatient) {
      filtered = filtered.filter((apt) => apt.patient === selectedPatient)
    }

    if (selectedCategory) {
      filtered = filtered.filter((apt) => apt.category === selectedCategory)
    }

    if (selectedPeriod) {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay() + 1)
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

      filtered = filtered.filter((apt) => {
        if (!apt.start_time) return false
        const aptDate = new Date(apt.start_time)

        switch (selectedPeriod) {
          case "today":
            return aptDate.toDateString() === today.toDateString()
          case "week":
            return aptDate >= startOfWeek && aptDate <= endOfWeek
          case "month":
            return aptDate >= startOfMonth && aptDate <= endOfMonth
          default:
            return true
        }
      })
    }

    onFilter(filtered)
  }

  const clearFilters = () => {
    setSelectedPatient("")
    setSelectedCategory("")
    setSelectedPeriod("")
  }

  const hasActiveFilters = selectedPatient || selectedCategory || selectedPeriod

  return (
    <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-blue-500" />
        <h3 className="font-semibold text-gray-800">Termine filtern</h3>
      </div>

      <div className="flex flex-wrap gap-4">
        <Select value={selectedPatient} onValueChange={setSelectedPatient}>
          <SelectTrigger className="w-[220px] bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500">
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

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[220px] bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500">
            <SelectValue placeholder="Kategorie auswählen" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color || "#6b7280" }} />
                  {category.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[220px] bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500">
            <SelectValue placeholder="Zeitraum auswählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Heute</SelectItem>
            <SelectItem value="week">Diese Woche</SelectItem>
            <SelectItem value="month">Dieser Monat</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 bg-transparent"
          >
            <X className="mr-2 h-4 w-4" />
            Filter zurücksetzen
          </Button>
        )}
      </div>
    </Card>
  )
}
