"use client"

import { useState } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
} from "date-fns"
import { de } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Appointment } from "@/types/index"

interface MonthlyViewProps {
  appointments: Appointment[]
  onEdit: (appointment: Appointment) => void
}

export function MonthlyView({ appointments, onEdit }: MonthlyViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const calendarDays = []
  let day = calendarStart
  while (day <= calendarEnd) {
    calendarDays.push(day)
    day = addDays(day, 1)
  }

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter((apt) => apt.start && isSameDay(new Date(apt.start), day))
  }

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{format(currentMonth, "MMMM yyyy", { locale: de })}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((dayName) => (
          <div key={dayName} className="p-2 text-center font-medium text-sm text-muted-foreground">
            {dayName}
          </div>
        ))}

        {calendarDays.map((day) => {
          const dayAppointments = getAppointmentsForDay(day)
          const isToday = isSameDay(day, new Date())
          const isCurrentMonth = isSameMonth(day, currentMonth)

          return (
            <Card
              key={day.toISOString()}
              className={`min-h-[100px] ${isToday ? "ring-2 ring-primary" : ""} ${!isCurrentMonth ? "opacity-50" : ""}`}
            >
              <CardContent className="p-2">
                <div className="text-sm font-medium mb-1">{format(day, "d")}</div>

                <div className="space-y-1">
                  {dayAppointments.slice(0, 2).map((appointment) => (
                    <HoverCard key={appointment.id}>
                      <HoverCardTrigger asChild>
                        <div
                          className="p-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity"
                          style={{
                            backgroundColor: appointment.categories?.color + "20" || "#f3f4f6",
                            borderLeft: `2px solid ${appointment.categories?.color || "#6b7280"}`,
                          }}
                          onClick={() => onEdit(appointment)}
                        >
                          <div className="font-medium truncate">{appointment.title || "Termin"}</div>
                          {appointment.start && (
                            <div className="text-muted-foreground">{format(new Date(appointment.start), "HH:mm")}</div>
                          )}
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="font-semibold">{appointment.title || "Unbenannter Termin"}</h4>
                          {appointment.start && (
                            <p className="text-sm">
                              <strong>Zeit:</strong>{" "}
                              {format(new Date(appointment.start), "dd.MM.yyyy HH:mm", { locale: de })}
                              {appointment.end && ` - ${format(new Date(appointment.end), "HH:mm")}`}
                            </p>
                          )}
                          {appointment.patients && (
                            <p className="text-sm">
                              <strong>Patient:</strong> {appointment.patients.firstname} {appointment.patients.lastname}
                            </p>
                          )}
                          {appointment.location && (
                            <p className="text-sm">
                              <strong>Ort:</strong> {appointment.location}
                            </p>
                          )}
                          {appointment.notes && (
                            <p className="text-sm">
                              <strong>Notizen:</strong> {appointment.notes}
                            </p>
                          )}
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ))}
                  {dayAppointments.length > 2 && (
                    <div className="text-xs text-muted-foreground">+{dayAppointments.length - 2} weitere</div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
