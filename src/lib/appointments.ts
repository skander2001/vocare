import { supabase } from "./supabase"
import type { Appointment } from "@/types/index"

export async function getAppointments() {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .select(`
        *,
        patients!appointments_patient_fkey (
          id,
          firstname,
          lastname,
          pronoun
        ),
        categories!appointments_category_fkey (
          id,
          label,
          color,
          icon
        )
      `)
      .order("start_time", { ascending: true })

    if (error) {
      console.error("Supabase error:", error)
      return []
    }

    return data as Appointment[]
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return []
  }
}

export async function getPatients() {
  try {
    const { data, error } = await supabase.from("patients").select("*").order("lastname", { ascending: true })

    if (error) {
      console.error("Supabase error:", error)
      return []
    }

    return data
  } catch (error) {
    console.error("Error fetching patients:", error)
    return []
  }
}

export async function getCategories() {
  try {
    const { data, error } = await supabase.from("categories").select("*").order("label", { ascending: true })

    if (error) {
      console.error("Supabase error:", error)
      return []
    }

    return data
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function createAppointment(appointment: Partial<Appointment>) {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .insert([
        {
          title: appointment.title,
          start_time: appointment.start_time,
          end_time: appointment.end_time,
          location: appointment.location,
          patient: appointment.patient,
          category: appointment.category,
          notes: appointment.notes,
          updated_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }
    console.log(data)
    return data[0]
  } catch (error) {
    console.error("Error creating appointment:", error)
    throw error
  }
}

export async function updateAppointment(id: string, appointment: Partial<Appointment>) {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .update({
        title: appointment.title,
        start_time: appointment.start_time,
        end_time: appointment.end_time,
        location: appointment.location,
        patient: appointment.patient,
        category: appointment.category,
        notes: appointment.notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return data[0]
  } catch (error) {
    console.error("Error updating appointment:", error)
    throw error
  }
}

export async function deleteAppointment(id: string) {
  try {
    const { error } = await supabase.from("appointments").delete().eq("id", id)

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }
  } catch (error) {
    console.error("Error deleting appointment:", error)
    throw error
  }
}
