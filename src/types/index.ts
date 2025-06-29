export interface Appointment {
  id: string
  created_at: string
  updated_at: string | null
  start_time: string | null
  end_time: string | null
  location: string | null
  patient: string | null
  category: string | null
  notes: string | null
  title: string | null
  patients?: Patient
  categories?: Category
}

export interface Patient {
  id: string
  firstname: string | null
  lastname: string | null
  birth_date: string | null
  care_level: number | null
  pronoun: string | null
  email: string | null
  active: boolean | null
}

export interface Category {
  id: string
  label: string | null
  description: string | null
  color: string | null
  icon: string | null
}
