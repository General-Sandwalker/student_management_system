'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Department {
  id: number;
  name: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    departmentId: '',
  });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setDepartmentsLoading(true);
        setError('');
        
        // Verify the backend URL is set
        if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
          throw new Error('Backend URL is not configured');
        }

        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const endpoint = `${backendUrl}/departments`;
        
        console.log('Fetching departments from:', endpoint); // Debug log
        
        const res = await fetch(endpoint);
        
        console.log('Departments response status:', res.status); // Debug log
        
        if (!res.ok) {
          throw new Error(`Failed to fetch departments (status: ${res.status})`);
        }

        const data = await res.json();
        setDepartments(data);
      } catch (err) {
        console.error('Department fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load departments');
      } finally {
        setDepartmentsLoading(false);
      }
    };

    fetchDepartments();
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/students/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          department_id: parseInt(formData.departmentId),
          formation_ids: [],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Registration failed');
      }

      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <main className="max-w-md mx-auto p-6">
        <div className="p-4 bg-green-100 text-green-700 rounded text-center">
          <p className="font-bold">Registration successful!</p>
          <p>Redirecting to login page...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Student Registration</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            className="w-full border p-2 rounded"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="student@example.com"
            className="w-full border p-2 rounded"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="w-full border p-2 rounded"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>

        <div>
          <label htmlFor="departmentId" className="block mb-1 font-medium text-white">
            Department
          </label>
          {departmentsLoading ? (
            <div className="w-full border p-2 rounded bg-gray-700 text-gray-300">
              Loading departments...
            </div>
          ) : departments.length > 0 ? (
            <select
              id="departmentId"
              name="departmentId"
              className="w-full border p-2 rounded bg-gray-800 text-white"
              value={formData.departmentId}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="w-full border p-2 rounded bg-red-800 text-red-300">
              No departments available. {error && `(${error})`}
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-800 text-red-300 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={isLoading || !formData.departmentId || departmentsLoading || departments.length === 0}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>

        <div className="text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </div>
      </form>
    </main>
  );
}