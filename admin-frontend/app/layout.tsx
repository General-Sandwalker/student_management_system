'use client'
import './globals.css'
import { Inter } from 'next/font/google'
import { ReactNode, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { usePathname, useRouter } from 'next/navigation'


const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Protect admin routes
    if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')) {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        router.push('/login')
      }
    }
  }, [pathname, router])

  return (
    <html lang="en">
      <head>
        <title>Admin Panel | Student Management System</title>
        <meta name="description" content="Manage students, departments, and formations" />
      </head>
      <body className={`${inter.className} bg-gray-50 text-gray-800`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  )
}

function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const showNavbar = !pathname?.startsWith('/login')
  return (
    <div>
      {showNavbar && <Navbar />}
      {children}
    </div>
  )
}