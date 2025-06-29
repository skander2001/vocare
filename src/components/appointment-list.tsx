"use client"

import { format, isSameDay, parseISO } from "date-fns"
import { de } from "date-fns/locale"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, User, Edit2 } from "lucide-react"
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
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border-0 shadow-lg p-12">
        <div className="text-center space-y-4">
          <div className="text-gray-400 text-lg">
            Termine vor dem {format(new Date(), "dd.MM.yyyy", { locale: de })} laden
          </div>
          <div className="text-gray-500 text-sm">Keine weiteren Termine gefunden</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border-0 shadow-lg p-6">
        <div className="text-center text-gray-500 text-sm">
          Termine vor dem {format(new Date(), "dd.MM.yyyy", { locale: de })} laden
        </div>
      </div>

      {/* Appointments by Date */}
      {sortedDates.map((dateKey) => {
        const dayAppointments = groupedAppointments[dateKey]
        const date = parseISO(dateKey)
        const isToday = isSameDay(date, new Date())

        return (
          <div key={dateKey} className="space-y-4">
            {/* Date Header */}
            <div className="bg-gray-100/80 backdrop-blur-sm rounded-xl border-0 shadow-sm p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  {format(date, "EEEE, dd. MMMM", { locale: de })}
                </h3>
                {isToday && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                    Heute
                  </Badge>
                )}
              </div>
            </div>

            {/* Appointments for this date */}
            <div className="space-y-3">
              {dayAppointments.map((appointment) => (
                <Card
                  key={appointment.id}
                  className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group"
                  onClick={() => onEdit(appointment)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Category Color Indicator */}
                        <div
                          className="w-3 h-3 rounded-full mt-2 flex-shrink-0"
                          style={{
                            backgroundColor: appointment.categories?.color || "#6b7280",
                          }}
                        />

                        {/* Appointment Details */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-800 text-lg">
                              {appointment.title || "Unbenannter Termin"}
                            </h4>
                            {appointment.categories && (
                              <Badge
                                variant="secondary"
                                style={{
                                  backgroundColor: appointment.categories.color + "20",
                                  color: appointment.categories.color ?? undefined,
                                  border: `1px solid ${appointment.categories.color}30`,
                                }}
                              >
                                {appointment.categories.label}
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-1 text-sm text-gray-600">
                            {/* Time */}
                            {appointment.start_time && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span>
                                  {format(parseISO(appointment.start_time), "HH:mm", { locale: de })} Uhr
                                  {appointment.end_time && (
                                    <span> bis {format(parseISO(appointment.end_time), "HH:mm", { locale: de })} Uhr</span>
                                  )}
                                </span>
                              </div>
                            )}

                            {/* Location */}
                            {appointment.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span>{appointment.location}</span>
                              </div>
                            )}

                            {/* Patient */}
                            {appointment.patients && (
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-400" />
                                <span>
                                  {appointment.patients.firstname} {appointment.patients.lastname}
                                </span>
                              </div>
                            )}

                            {/* Notes */}
                            {appointment.notes && <div className="mt-2 text-gray-500 text-sm">{appointment.notes}</div>}
                          </div>
                        </div>
                      </div>

                      {/* Edit Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100"
                        onClick={(e) => {
                          e.stopPropagation()
                          onEdit(appointment)
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      })}

      {/* Footer Message */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border-0 shadow-lg p-6">
        <div className="text-center text-gray-500 text-sm">Keine weiteren Termine gefunden</div>
      </div>
    </div>
  )
}
