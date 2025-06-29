"use client"

import { useState } from "react"
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from "date-fns"
import { de } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar, Clock, User, MapPin } from "lucide-react"
import type { Appointment } from "@/types/index"

interface WeeklyViewProps {
  appointments: Appointment[]
  onEdit: (appointment: Appointment) => void
}

export function WeeklyView({ appointments, onEdit }: WeeklyViewProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date())

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const timeSlots = Array.from({ length: 12 }, (_, i) => i + 8) // 8:00 to 19:00

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter((apt) => apt.start_time && isSameDay(new Date(apt.start_time), day))
  }

  const previousWeek = () => setCurrentWeek(subWeeks(currentWeek, 1))
  const nextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1))

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-blue-500" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {format(weekStart, "dd. MMMM", { locale: de })} -{" "}
                {format(addDays(weekStart, 6), "dd. MMMM yyyy", { locale: de })}
              </h2>
              <p className="text-sm text-gray-600">Wochenansicht</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={previousWeek} className="hover:bg-blue-50 bg-transparent">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={nextWeek} className="hover:bg-blue-50 bg-transparent">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Grid */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border-0 shadow-lg overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-8 border-b border-gray-100">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50"></div>
          {weekDays.map((day) => {
            const isToday = isSameDay(day, new Date())
            return (
              <div
                key={day.toISOString()}
                className={`p-4 text-center border-r border-gray-100 last:border-r-0 ${
                  isToday
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : "bg-gradient-to-r from-blue-50 to-purple-50"
                }`}
              >
                <div className="font-medium text-sm">{format(day, "EEE", { locale: de })}</div>
                <div className={`text-lg font-bold ${isToday ? "text-white" : "text-gray-800"}`}>
                  {format(day, "dd", { locale: de })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Time Slots */}
        {timeSlots.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-b border-gray-50 last:border-b-0 min-h-[80px]">
            {/* Time Label */}
            <div className="p-4 bg-gray-50/50 border-r border-gray-100 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">{hour.toString().padStart(2, "0")}:00</span>
            </div>

            {/* Day Columns */}
            {weekDays.map((day) => {
              const dayAppointments = getAppointmentsForDay(day).filter((apt) => {
                if (!apt.start_time) return false
                const aptHour = new Date(apt.start_time).getHours()
                return aptHour === hour
              })

              return (
                <div
                  key={`${day.toISOString()}-${hour}`}
                  className="p-2 border-r border-gray-100 last:border-r-0 hover:bg-blue-50/30 transition-colors"
                >
                  {dayAppointments.map((appointment) => (
                    <HoverCard key={appointment.id}>
                      <HoverCardTrigger asChild>
                        <div
                          className="p-3 rounded-lg cursor-pointer hover:shadow-md transition-all duration-200 mb-2"
                          style={{
                            background: `linear-gradient(135deg, ${appointment.categories?.color || "#6b7280"}20, ${appointment.categories?.color || "#6b7280"}10)`,
                            borderLeft: `4px solid ${appointment.categories?.color || "#6b7280"}`,
                          }}
                          onClick={() => onEdit(appointment)}
                        >
                          <div className="font-medium text-sm text-gray-800 truncate mb-1">
                            {appointment.title || "Unbenannter Termin"}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Clock className="h-3 w-3" />
                            {appointment.start_time && format(new Date(appointment.start_time), "HH:mm")}
                            {appointment.end_time && ` - ${format(new Date(appointment.end_time), "HH:mm")}`}
                          </div>
                          {appointment.patients && (
                            <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                              <User className="h-3 w-3" />
                              <span className="truncate">
                                {appointment.patients.firstname} {appointment.patients.lastname}
                              </span>
                            </div>
                          )}
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80 bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h4 className="font-semibold text-gray-800 flex-1">
                              {appointment.title || "Unbenannter Termin"}
                            </h4>
                            {appointment.categories && (
                              <Badge
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

                          {appointment.start_time && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="h-4 w-4 text-blue-500" />
                              <span>
                                {format(new Date(appointment.start_time), "dd.MM.yyyy HH:mm", { locale: de })}
                                {appointment.end_time && ` - ${format(new Date(appointment.end_time), "HH:mm")}`}
                              </span>
                            </div>
                          )}

                          {appointment.patients && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <User className="h-4 w-4 text-green-500" />
                              <span>
                                {appointment.patients.firstname} {appointment.patients.lastname}
                              </span>
                            </div>
                          )}

                          {appointment.location && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="h-4 w-4 text-red-500" />
                              <span>{appointment.location}</span>
                            </div>
                          )}

                          {appointment.notes && (
                            <div className="pt-2 border-t border-gray-100">
                              <p className="text-sm text-gray-600">{appointment.notes}</p>
                            </div>
                          )}
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ))}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
