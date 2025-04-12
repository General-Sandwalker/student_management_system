'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Department {
  id: number;
  name: string;
}

interface Formation {
  id: number;
  title: string;
  description?: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
  department?: Department;
  department_id?: number;  // Add this line
  formations?: Formation[];
}

export default function ProfilePage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Student>>({});
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

        // Fetch profile data
        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/students/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!profileRes.ok) {
          throw new Error('Failed to fetch profile');
        }

        const profileData = await profileRes.json();
        setStudent(profileData);
        setEditData({
          name: profileData.name,
          email: profileData.email,
          department_id: profileData.department?.id,
        });

        // Fetch departments for edit form
        const deptRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/departments`);
        if (!deptRes.ok) throw new Error('Failed to fetch departments');
        setDepartments(await deptRes.json());

        // Fetch formations for edit form
        const formRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/formations`);
        if (!formRes.ok) throw new Error('Failed to fetch formations');
        setFormations(await formRes.json());
      } catch (err: any) {
        console.error('Profile fetch error:', err);
        setError(err.message || 'Failed to load profile');
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: name === 'department_id' ? (value ? parseInt(value) : undefined) : value,
    }));
  };

  const handleSave = async () => {
    if (!student) return;

    try {
      setLoading(true);
      setError('');

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
          name: editData.name,
          email: editData.email,
          department_id: editData.department_id,
          formation_ids: student.formations?.map(f => f.id) || [],
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedData = await res.json();
      setStudent(updatedData);
      setIsEditing(false);
    } catch (err: any) {
      console.error('Update error:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-300">Loading your profile...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <p className="text-red-500 mb-4">{error || 'Please log in to view your profile.'}</p>
        <Link href="/login" className="text-blue-500 hover:underline">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Your Profile</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={editData.name || ''}
              onChange={handleEditChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={editData.email || ''}
              onChange={handleEditChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Department</label>
            <select
              name="department_id"
              value={editData.department_id || ''}
              onChange={handleEditChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="text-gray-400">Name</h3>
            <p className="text-white text-lg">{student.name}</p>
          </div>

          <div>
            <h3 className="text-gray-400">Email</h3>
            <p className="text-white text-lg">{student.email}</p>
          </div>

          <div>
            <h3 className="text-gray-400">Department</h3>
            <p className="text-white text-lg">{student.department?.name || 'Not assigned'}</p>
          </div>

          <div>
            <h3 className="text-gray-400">Formations</h3>
            <ul className="mt-2 space-y-1">
              {student.formations?.length ? (
                student.formations.map(f => (
                  <li key={f.id} className="text-white">
                    • {f.title}
                  </li>
                ))
              ) : (
                <li className="text-gray-400">No formations enrolled</li>
              )}
            </ul>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}