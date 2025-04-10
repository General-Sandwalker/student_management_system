'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import DashboardCard from '@/components/DashboardCard'

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    students: 0,
    departments: 0,
    formations: 0,
    admins: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    console.log("Token from storage:", token) // Debug log
    
    if (!token) {
      console.log("Redirecting to login...") // Debug log
      router.push('/login')
      return
    }

    const fetchStats = async () => {
      try {
        console.log("Fetching stats with token:", token);
        
        const response = await fetch('http://localhost:8000/admin/stats', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include' // Important for session/cookie auth
        });
    
        console.log("Response received:", response);
    
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('admin_token');
          router.push('/login');
          return;
        }
    
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || 'Failed to fetch stats');
        }
    
        const data = await response.json();
        console.log("Stats data:", data);
        setStats(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        localStorage.removeItem('admin_token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    fetchStats()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-800 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-purple-400">Admin Dashboard</h1>
        
        {error && (
          <div className="mb-6 p-3 bg-red-900/50 text-red-300 rounded-md border border-red-700/50">
            {error}
          </div>
        )}

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
            color="purple"
          />
          <DashboardCard 
            title="Formations" 
            value={stats.formations} 
            icon="📚" 
            link="/formations"
            color="purple"
          />
          <DashboardCard 
            title="Admins" 
            value={stats.admins} 
            icon="👨‍💼"
            link="/admins"
            color="purple"
          />
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-purple-300">Recent Activity</h2>
          <div className="text-gray-400 italic">
            Activity feed will be displayed here
          </div>
        </div>
      </main>
    </div>
  )
}
