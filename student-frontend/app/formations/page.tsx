'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FormationsPage() {
  const [formations, setFormations] = useState([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch formations
        const formRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/formations`);
        const formData = await formRes.json();
        setFormations(formData);

        // Fetch student profile
        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/students/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profileData = await profileRes.json();
        setStudent(profileData);

        // Pre-select already enrolled formations
        const enrolledIds = profileData.formations?.map((f: any) => f.id) || [];
        setSelectedIds(enrolledIds);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCheckboxChange = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const handleEnroll = async () => {
    const token = localStorage.getItem('token');
    if (!student || !token) return;

    const updatedData = {
      name: student.name,
      email: student.email,
      password: 'placeholder', // won't be updated
      department_id: student.department.id,
      formation_ids: selectedIds,
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/students/${student.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (res.ok) {
      alert('Enrollment updated!');
    } else {
      alert('Failed to enroll.');
    }
  };

  if (loading) return <p>Loading formations...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Available Formations</h1>
      <ul className="space-y-2 mb-4">
        {formations.map((formation: any) => (
          <li key={formation.id} className="border p-3 rounded">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={selectedIds.includes(formation.id)}
                onChange={() => handleCheckboxChange(formation.id)}
              />
              <span>
                <strong>{formation.title}</strong> — {formation.description}
              </span>
            </label>
          </li>
        ))}
      </ul>

      <button
        onClick={handleEnroll}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Save Enrollment
      </button>
    </div>
  );
}
