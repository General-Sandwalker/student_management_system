'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardCard from '@/components/DashboardCard'

interface AdminStats {
  students: number
  departments: number
  formations: number
  admins: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats>({
    students: 0,
    departments: 0,
    formations: 0,
    admins: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('admin_token')
      
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const response = await fetch('http://localhost:8000/admin/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        })

        // Check for HTML responses
        const contentType = response.headers.get('content-type')
        if (!contentType?.includes('application/json')) {
          const text = await response.text()
          throw new Error(`Server returned: ${text.substring(0, 100)}`)
        }

        if (response.status === 401) {
          localStorage.removeItem('admin_token')
          router.push('/login')
          return
        }

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.detail || `HTTP ${response.status}`)
        }

        const data: AdminStats = await response.json()
        setStats(data)
      } catch (err) {
        console.error('Dashboard error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [router])

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <h1 className="text-2xl font-bold mb-6 text-purple-400">Admin Dashboard</h1>
        <div className="p-4 bg-red-900/50 text-red-300 rounded-lg">
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h1 className="text-2xl font-bold mb-6 text-purple-400">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard 
          title="Students" 
          value={stats.students} 
          icon="👨‍🎓"
          link="/students"
          color="purple"
        />
        <DashboardCard 
          title="Departments" 
          value={stats.departments} 
          icon="🏛️"
          link="/departments"
          color="blue"
        />
        <DashboardCard 
          title="Formations" 
          value={stats.formations} 
          icon="📚"
          link="/formations"
          color="green"
        />
        <DashboardCard 
          title="Admins" 
          value={stats.admins} 
          icon="👨‍💼"
          link="/dashboard"
          color="red"
        />
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h1 className="text-2xl font-bold mb-6 text-purple-400">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-800 rounded-lg animate-pulse"></div>
        ))}
      </div>
    </div>
  )
}