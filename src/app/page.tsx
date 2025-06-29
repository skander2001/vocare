"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Calendar, List, Grid3X3, Search } from "lucide-react"
import { AppointmentList } from "@/components/appointment-list"
import { WeeklyView } from "@/components/weekly-view"
import { MonthlyView } from "@/components/monthly-view"
import { ModernAppointmentDialog } from "@/components/modern-appointment-dialog"
import { FilterBar } from "@/components/filter-bar"
import { getAppointments, getPatients, getCategories } from "@/lib/appointments"
import type { Appointment, Patient, Category } from "@/types/index"
import { format } from "date-fns"
import { de } from "date-fns/locale"

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("list")

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    setFilteredAppointments(appointments)
  }, [appointments])

  const loadData = async () => {
    try {
      const [appointmentsData, patientsData, categoriesData] = await Promise.all([
        getAppointments(),
        getPatients(),
        getCategories(),
      ])

      setAppointments(appointmentsData)
      setPatients(patientsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAppointment = () => {
    setSelectedAppointment(null)
    setIsDialogOpen(true)
  }

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsDialogOpen(true)
  }

  const handleAppointmentSaved = () => {
    loadData()
    setIsDialogOpen(false)
  }

  const handleFilter = (filtered: Appointment[]) => {
    setFilteredAppointments(filtered)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="text-lg font-medium text-gray-700">Lade Termine...</div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="container mx-auto p-8">
        {/* Beautiful Header */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-indigo-600 to-cyan-600 border-0 shadow-2xl overflow-hidden">
            <div className="p-8 text-white relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">Terminverwaltung</h1>
                    <p className="text-indigo-100 text-lg">
                      {format(new Date(), "EEEE, dd. MMMM yyyy", { locale: de })}
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                        <span className="text-sm font-medium">{appointments.length} Termine</span>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                        <span className="text-sm font-medium">{patients.length} Patienten</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="secondary"
                      className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                    >
                      <Search className="mr-2 h-4 w-4" />
                      Suchen
                    </Button>
                    <Button
                      onClick={handleCreateAppointment}
                      className="bg-white text-indigo-600 hover:bg-gray-50 shadow-lg font-semibold"
                      size="lg"
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Neuer Termin
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Filter Section */}
        <div className="mb-8">
          <FilterBar appointments={appointments} patients={patients} categories={categories} onFilter={handleFilter} />
        </div>

        {/* Navigation Tabs */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100/80 p-1 rounded-xl">
                <TabsTrigger
                  value="list"
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                >
                  <List className="h-4 w-4" />
                  <span className="font-medium">Liste</span>
                </TabsTrigger>
                <TabsTrigger
                  value="weekly"
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                >
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Woche</span>
                </TabsTrigger>
                <TabsTrigger
                  value="monthly"
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span className="font-medium">Monat</span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="list" className="space-y-4">
                  <AppointmentList appointments={filteredAppointments} onEdit={handleEditAppointment} />
                </TabsContent>

                <TabsContent value="weekly" className="space-y-4">
                  <WeeklyView appointments={filteredAppointments} onEdit={handleEditAppointment} />
                </TabsContent>

                <TabsContent value="monthly" className="space-y-4">
                  <MonthlyView appointments={filteredAppointments} onEdit={handleEditAppointment} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </Card>

        {/* Modern Dialog */}
        <ModernAppointmentDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          appointment={selectedAppointment}
          patients={patients}
          categories={categories}
          onSaved={handleAppointmentSaved}
        />
      </div>
    </div>
  )
}
