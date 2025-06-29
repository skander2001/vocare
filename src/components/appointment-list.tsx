"use client"

import { format, isSameDay, parseISO } from "date-fns"
import { de } from "date-fns/locale"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, User, Edit2, Calendar, AlertCircle } from "lucide-react"
import type { Appointment } from "@/types/index"

interface AppointmentListProps {
  appointments: Appointment[]
  onEdit: (appointment: Appointment) => void
}

export function AppointmentList({ appointments, onEdit }: AppointmentListProps) {
  // Group appointments by date
  const groupedAppointments = appointments.reduce(
    (groups, appointment) => {
      if (!appointment.start_time) return groups

      const date = format(parseISO(appointment.start_time), "yyyy-MM-dd")
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(appointment)
      return groups
    },
    {} as Record<string, Appointment[]>,
  )

  const sortedDates = Object.keys(groupedAppointments).sort()

  if (appointments.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-0 shadow-medium p-16 animate-fade-in-up">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto">
            <Calendar className="h-10 w-10 text-indigo-500" />
          </div>
          <div className="space-y-2">
            <div className="text-xl font-semibold text-gray-700">Keine Termine gefunden</div>
            <div className="text-gray-500">Erstellen Sie Ihren ersten Termin um loszulegen</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header Info */}
      <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-2xl border border-indigo-100/50 shadow-soft p-6 animate-fade-in-up">
        <div className="flex items-center justify-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Calendar className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-indigo-700">
              Termine vor dem {format(new Date(), "dd.MM.yyyy", { locale: de })} laden
            </div>
            <div className="text-xs text-indigo-500 mt-1">Alle verfügbaren Termine werden angezeigt</div>
          </div>
        </div>
      </div>

      {/* Appointments by Date */}
      {sortedDates.map((dateKey, index) => {
        const dayAppointments = groupedAppointments[dateKey]
        const date = parseISO(dateKey)
        const isToday = isSameDay(date, new Date())
        const isPast = date < new Date() && !isToday

        return (
          <div key={dateKey} className="space-y-6 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
            {/* Enhanced Date Header */}
            <div className={`rounded-2xl border-0 shadow-soft p-6 ${
              isToday 
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' 
                : isPast 
                ? 'bg-gray-100/80 backdrop-blur-sm' 
                : 'bg-gradient-to-r from-indigo-50 to-cyan-50 border border-indigo-100/50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${
                    isToday 
                      ? 'bg-white/20 backdrop-blur-sm' 
                      : 'bg-white/80 backdrop-blur-sm'
                  }`}>
                    <Calendar className={`h-6 w-6 ${
                      isToday ? 'text-white' : 'text-indigo-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${
                      isToday ? 'text-white' : 'text-gray-800'
                    }`}>
                      {format(date, "EEEE, dd. MMMM", { locale: de })}
                    </h3>
                    <p className={`text-sm ${
                      isToday ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {dayAppointments.length} Termin{dayAppointments.length !== 1 ? 'e' : ''}
                    </p>
                  </div>
                </div>
                {isToday && (
                  <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-3 py-1">
                    Heute
                  </Badge>
                )}
                {isPast && (
                  <Badge variant="secondary" className="bg-gray-200 text-gray-600 px-3 py-1">
                    Vergangen
                  </Badge>
                )}
              </div>
            </div>

            {/* Enhanced Appointments for this date */}
            <div className="space-y-4">
              {dayAppointments.map((appointment, aptIndex) => (
                <Card
                  key={appointment.id}
                  className={`bg-white/90 backdrop-blur-sm border-0 shadow-soft hover-lift cursor-pointer group transition-all duration-300 ${
                    isPast ? 'opacity-75' : ''
                  }`}
                  onClick={() => onEdit(appointment)}
                  style={{ animationDelay: `${(index * 0.1) + (aptIndex * 0.05)}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-6 flex-1">
                        {/* Enhanced Category Color Indicator */}
                        <div className="relative">
                          <div
                            className="w-4 h-4 rounded-full mt-2 flex-shrink-0 shadow-soft"
                            style={{
                              backgroundColor: appointment.categories?.color || "#6b7280",
                            }}
                          />
                          <div
                            className="absolute inset-0 w-4 h-4 rounded-full animate-pulse-slow"
                            style={{
                              backgroundColor: appointment.categories?.color || "#6b7280",
                              opacity: 0.3,
                            }}
                          />
                        </div>

                        {/* Enhanced Appointment Details */}
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <h4 className="font-bold text-gray-800 text-xl">
                                  {appointment.title || "Unbenannter Termin"}
                                </h4>
                                {appointment.categories && (
                                  <Badge
                                    className="px-3 py-1 font-medium shadow-soft"
                                    style={{
                                      backgroundColor: appointment.categories.color + "15",
                                      color: appointment.categories.color ?? undefined,
                                      border: `1px solid ${appointment.categories.color}30`,
                                    }}
                                  >
                                    {appointment.categories.label}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Time */}
                            {appointment.start_time && (
                              <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-xl">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                  <Clock className="h-4 w-4 text-indigo-600" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-800">
                                    {format(parseISO(appointment.start_time), "HH:mm", { locale: de })} Uhr
                                  </div>
                                  {appointment.end_time && (
                                    <div className="text-sm text-gray-500">
                                      bis {format(parseISO(appointment.end_time), "HH:mm", { locale: de })} Uhr
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Location */}
                            {appointment.location && (
                              <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-xl">
                                <div className="p-2 bg-green-100 rounded-lg">
                                  <MapPin className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-800">Ort</div>
                                  <div className="text-sm text-gray-600">{appointment.location}</div>
                                </div>
                              </div>
                            )}

                            {/* Patient */}
                            {appointment.patients && (
                              <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-xl">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                  <User className="h-4 w-4 text-purple-600" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-800">Patient</div>
                                  <div className="text-sm text-gray-600">
                                    {appointment.patients.firstname} {appointment.patients.lastname}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Notes */}
                            {appointment.notes && (
                              <div className="flex items-start gap-3 p-3 bg-gray-50/80 rounded-xl md:col-span-2">
                                <div className="p-2 bg-amber-100 rounded-lg mt-1">
                                  <AlertCircle className="h-4 w-4 text-amber-600" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-800">Notizen</div>
                                  <div className="text-sm text-gray-600 mt-1">{appointment.notes}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Edit Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-indigo-50 hover:text-indigo-600 p-3 rounded-xl"
                        onClick={(e) => {
                          e.stopPropagation()
                          onEdit(appointment)
                        }}
                      >
                        <Edit2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      })}

      {/* Enhanced Footer Message */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200/50 shadow-soft p-8 animate-fade-in-up">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
            <Calendar className="h-6 w-6 text-gray-500" />
          </div>
          <div className="text-gray-600 font-medium">Keine weiteren Termine gefunden</div>
          <div className="text-sm text-gray-500">Alle verfügbaren Termine werden angezeigt</div>
        </div>
      </div>
    </div>
  )
}
