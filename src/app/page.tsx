"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Calendar, List, Grid3X3, Search, Users, Clock, TrendingUp } from "lucide-react"
import { AppointmentList } from "@/components/appointment-list"
import { WeeklyView } from "@/components/weekly-view"
import { MonthlyView } from "@/components/monthly-view"
import { ModernAppointmentDialog } from "@/components/modern-appointment-dialog"
import { FilterBar } from "@/components/filter-bar"
import { ThemeSwitcher } from "@/components/theme-switcher"
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

  // Calculate statistics
  const todayAppointments = appointments.filter(apt => {
    if (!apt.start_time) return false
    const today = new Date()
    const aptDate = new Date(apt.start_time)
    return aptDate.toDateString() === today.toDateString()
  })

  const upcomingAppointments = appointments.filter(apt => {
    if (!apt.start_time) return false
    const now = new Date()
    const aptDate = new Date(apt.start_time)
    return aptDate > now
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <Card className="p-12 bg-white/90 backdrop-blur-sm border-0 shadow-strong animate-fade-in-up">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin mx-auto" style={{ animationDelay: '-0.5s' }}></div>
            </div>
            <div className="space-y-2">
              <div className="text-xl font-semibold text-gray-800">Lade Termine...</div>
              <div className="text-sm text-gray-500">Bitte warten Sie einen Moment</div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="container mx-auto p-6 lg:p-8">
        {/* Enhanced Header */}
        <div className="mb-8 animate-fade-in-up">
          <Card className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 border-0 shadow-strong overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-black/5"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="p-8 lg:p-12 text-white relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent">
                      Terminverwaltung
                    </h1>
                    <p className="text-indigo-100 text-lg lg:text-xl font-medium">
                      {format(new Date(), "EEEE, dd. MMMM yyyy", { locale: de })}
                    </p>
                  </div>
                  
                  {/* Enhanced Stats */}
                  <div className="flex flex-wrap gap-4">
                    <div className="glass rounded-xl px-4 py-3 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{appointments.length}</div>
                          <div className="text-sm text-indigo-100">Termine</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="glass rounded-xl px-4 py-3 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <Users className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{patients.length}</div>
                          <div className="text-sm text-indigo-100">Patienten</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="glass rounded-xl px-4 py-3 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{todayAppointments.length}</div>
                          <div className="text-sm text-indigo-100">Heute</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="glass rounded-xl px-4 py-3 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <TrendingUp className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
                          <div className="text-sm text-indigo-100">Anstehend</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <ThemeSwitcher />
                  <Button
                    variant="secondary"
                      className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 hover:text-white transition-all duration-200 shadow-lg"
                      size="lg"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Suchen
                  </Button>
                  <Button
                    onClick={handleCreateAppointment}
                    className="bg-white text-indigo-600 hover:bg-gray-50 shadow-glow hover-lift font-semibold focus-ring"
                    size="lg"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Neuer Termin
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Enhanced Filter Section */}
        <div className="mb-8 animate-slide-in-right">
          <FilterBar appointments={appointments} patients={patients} categories={categories} onFilter={handleFilter} />
        </div>

        {/* Enhanced Navigation Tabs */}
        <Card className="mb-8 bg-white/90 backdrop-blur-sm border-0 shadow-medium hover-lift">
          <div className="p-6 lg:p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100/80 p-2 rounded-2xl shadow-soft">
                <TabsTrigger
                  value="list"
                  className="flex items-center gap-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-soft data-[state=active]:text-indigo-600 transition-all duration-200 hover-scale py-3"
                >
                  <List className="h-5 w-5" />
                  <span className="font-semibold">Liste</span>
                </TabsTrigger>
                <TabsTrigger
                  value="weekly"
                  className="flex items-center gap-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-soft data-[state=active]:text-indigo-600 transition-all duration-200 hover-scale py-3"
                >
                  <Calendar className="h-5 w-5" />
                  <span className="font-semibold">Woche</span>
                </TabsTrigger>
                <TabsTrigger
                  value="monthly"
                  className="flex items-center gap-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-soft data-[state=active]:text-indigo-600 transition-all duration-200 hover-scale py-3"
                >
                  <Grid3X3 className="h-5 w-5" />
                  <span className="font-semibold">Monat</span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-8">
                <TabsContent value="list" className="space-y-6 animate-fade-in-up">
                  <AppointmentList appointments={filteredAppointments} onEdit={handleEditAppointment} />
                </TabsContent>

                <TabsContent value="weekly" className="space-y-6 animate-fade-in-up">
                  <WeeklyView appointments={filteredAppointments} onEdit={handleEditAppointment} />
                </TabsContent>

                <TabsContent value="monthly" className="space-y-6 animate-fade-in-up">
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
