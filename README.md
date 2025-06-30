# 🗓 Vocare Fullstack Calendar Prototype

This is a fullstack prototype for the **Vocare tech challenge** — a small, responsive scheduling app designed for managing appointments (Termine), clients (Patienten), and categories. It is built using **Next.js**, **Tailwind CSS**, **shadcn/ui**, and **Supabase**.

---

## ✨ Features

- 📅 Appointment list view (calendar & filters planned)
- ✅ Create/Edit appointment structure (UI in progress)
- 🔍 Filter by patient, category, date
- 🎨 Tailwind theming + responsive design
- 🔐 Supabase integration with working schema

---

## 🛠 Tech Stack

| Area         | Tool                  |
|--------------|-----------------------|
| Frontend     | [Next.js](https://nextjs.org/) (App Router + TypeScript) |
| Styling      | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Backend      | Supabase (PostgreSQL + Auth) |
| UI Components| shadcn/ui (Dialog, HoverCard, etc.) |
| Hosting      | Vercel  |

---

## 📂 Project Structure (Summary)

src/
├── app/appointments/ # Main calendar view
├── components/appointments/ # AppointmentCard, filters, form
├── lib/ # Supabase client + server setup
├── types/ # Shared TypeScript models



---

## 🚧 Supabase Note

The credentials provided in the challenge PDF **did not work** for me (`Invalid API key` errors).

➡️ To proceed, I set up my **own Supabase project** using the exact schema provided in the PDF.  
No schema fields were changed or added.

If needed, I can share access to my Supabase instance for review.

---

## 🌍 Language Note

Apologies for mixing **German** in some of the UI and text 🙏  
I'm currently learning German (B1 level), and I used AI to help me generate and translate some UI labels.

However, I chose to write most of the code and documentation in **English**, so I can be 100% confident about what I’m building and communicating.

---

## 📦 How to Run Locally

   ```bash
   git clone https://github.com/skander2001/vocare
   cd vocare


npm install


NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key


npm run dev


---

Let me know if you want the same `README.md` in German too (for the hiring team), or if you’d like me to fill in your GitHub repo name and Supabase URL for submission.
