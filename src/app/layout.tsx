import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "next-themes"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Vocare App - Terminverwaltung",
  description: "Moderne Terminverwaltung für medizinische Praxen. Verwalten Sie Ihre Termine, Patienten und Kategorien einfach und effizient.",
  keywords: ["Terminverwaltung", "Medizin", "Praxis", "Patienten", "Termine", "Kalender"],
  authors: [{ name: "Vocare Team" }],
  creator: "Vocare App",
  publisher: "Vocare App",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://vocare-app.com"),
  openGraph: {
    title: "Vocare App - Terminverwaltung",
    description: "Moderne Terminverwaltung für medizinische Praxen",
    type: "website",
    locale: "de_DE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vocare App - Terminverwaltung",
    description: "Moderne Terminverwaltung für medizinische Praxen",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#4f46e5" />
        <meta name="msapplication-TileColor" content="#4f46e5" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
          storageKey="vocare-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
