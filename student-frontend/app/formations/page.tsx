'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Formation {
  id: number;
  title: string;
  description?: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
  department?: {
    id: number;
    name: string;
  };
  formations?: Formation[];
}

export default function FormationsPage() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch formations
        const formRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/formations`);
        if (!formRes.ok) throw new Error('Failed to fetch formations');
        setFormations(await formRes.json());

        // Fetch student profile
        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/students/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!profileRes.ok) throw new Error('Failed to fetch student profile');
        const profileData = await profileRes.json();
        setStudent(profileData);

        // Pre-select enrolled formations
        setSelectedIds(profileData.formations?.map((f: Formation) => f.id) || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'An error occurred while loading data');
        if (err.message.includes('Unauthorized')) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleCheckboxChange = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const handleEnroll = async () => {
    if (!student) return;

    try {
      setIsSubmitting(true);
      setError('');
      setSuccess(false);

      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/students/${student.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: student.name,
          email: student.email,
          department_id: student.department?.id,
          formation_ids: selectedIds,
          password: password // Include the password from state
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to update enrollments');
      }

      const updatedStudent = await res.json();
      setStudent(updatedStudent);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update enrollments');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-700">Loading formations...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <p className="text-red-500">{error || 'Student data not available'}</p>
        <button 
          onClick={() => router.push('/login')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Available Formations</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Your enrollments have been updated successfully!
        </div>
      )}

      {formations.length === 0 ? (
        <p className="text-gray-600">No formations available at this time.</p>
      ) : (
        <>
          <ul className="space-y-3 mb-6">
            {formations.map((formation) => (
              <li 
                key={formation.id} 
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={selectedIds.includes(formation.id)}
                    onChange={() => handleCheckboxChange(formation.id)}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">{formation.title}</h3>
                    {formation.description && (
                      <p className="text-gray-600 mt-1">{formation.description}</p>
                    )}
                  </div>
                </label>
              </li>
            ))}
          </ul>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Confirm Password to Save Changes
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              {selectedIds.length} formation{selectedIds.length !== 1 ? 's' : ''} selected
            </p>
            <button
              onClick={handleEnroll}
              disabled={isSubmitting || !password}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Enrollments'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}