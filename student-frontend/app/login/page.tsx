'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Invalid credentials');
      }

      localStorage.setItem('token', data.access_token);
      router.push('/profile');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Student Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="student@example.com"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block mb-1 font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <div className="text-center text-sm">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </div>
      </form>
    </main>
  );
}