import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { AppContent } from "@/components/app-content"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HSC Paper 1 Tutoring",
  description: "Your ultimate resource for NSW HSC Paper 1 preparation",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AppContent>{children}</AppContent>
        </AuthProvider>
      </body>
    </html>
  )
}
