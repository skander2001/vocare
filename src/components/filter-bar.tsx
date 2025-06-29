"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Filter, Search, User, Tag, Calendar } from "lucide-react"
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
    <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-medium hover-lift animate-fade-in-up">
      <div className="space-y-6">
        {/* Enhanced Header */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-soft">
            <Filter className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Termine filtern</h3>
            <p className="text-sm text-gray-500">Finden Sie schnell die gewünschten Termine</p>
          </div>
        </div>

        {/* Enhanced Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Patient Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="h-4 w-4 text-purple-600" />
              </div>
              <label className="text-sm font-medium text-gray-700">Patient</label>
            </div>
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger className="w-full bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500 hover-scale focus-ring">
                <SelectValue placeholder="Patient auswählen" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      {patient.firstname} {patient.lastname}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Tag className="h-4 w-4 text-green-600" />
              </div>
              <label className="text-sm font-medium text-gray-700">Kategorie</label>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full bg-white border-gray-200 focus:border-green-500 focus:ring-green-500 hover-scale focus-ring">
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
          </div>

          {/* Period Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <label className="text-sm font-medium text-gray-700">Zeitraum</label>
            </div>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 hover-scale focus-ring">
                <SelectValue placeholder="Zeitraum auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Heute
                  </div>
                </SelectItem>
                <SelectItem value="week">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    Diese Woche
                  </div>
                </SelectItem>
                <SelectItem value="month">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Dieser Monat
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Search className="h-4 w-4 text-gray-600" />
              </div>
              <label className="text-sm font-medium text-gray-700">Aktionen</label>
            </div>
            {hasActiveFilters ? (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600 bg-transparent hover-scale focus-ring"
              >
                <X className="mr-2 h-4 w-4" />
                Filter zurücksetzen
              </Button>
            ) : (
              <div className="w-full h-10 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-center">
                <span className="text-sm text-gray-500">Keine aktiven Filter</span>
              </div>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Aktive Filter:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedPatient && (
                <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  Patient: {patients.find(p => p.id === selectedPatient)?.firstname} {patients.find(p => p.id === selectedPatient)?.lastname}
                </div>
              )}
              {selectedCategory && (
                <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Kategorie: {categories.find(c => c.id === selectedCategory)?.label}
                </div>
              )}
              {selectedPeriod && (
                <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Zeitraum: {
                    selectedPeriod === 'today' ? 'Heute' :
                    selectedPeriod === 'week' ? 'Diese Woche' :
                    selectedPeriod === 'month' ? 'Dieser Monat' : ''
                  }
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
