'use client';

import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchProfile = async () => {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/students/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setStudent(data);
      } else {
        alert('Unauthorized');
        setStudent(null);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (!student) return <p>Please log in to view your profile.</p>;

  return (
    <div className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h1 className="text-2xl font-bold mb-4 text-white">Your Profile</h1>
      <p className="text-gray-300"><strong>Name:</strong> {student.name}</p>
      <p className="text-gray-300"><strong>Email:</strong> {student.email}</p>
      <p className="text-gray-300"><strong>Department:</strong> {student.department?.name || 'N/A'}</p>
      <h3 className="mt-4 font-semibold text-white">Formations:</h3>
      <ul className="list-disc list-inside text-gray-300">
        {student.formations?.length > 0 ? (
          student.formations.map((f: any) => (
            <li key={f.id}>{f.title}</li>
          ))
        ) : (
          <li>No formations enrolled</li>
        )}
      </ul>
    </div>
  );
}
