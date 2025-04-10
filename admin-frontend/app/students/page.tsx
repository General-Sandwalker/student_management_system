'use client'
import { useEffect, useState } from "react";
import { getStudents, deleteStudent } from "@/services/api";

interface Student {
  id: number;
  name: string;
  email: string;
  department?: {
    name: string;
  };
  formations?: Array<{
    id: number;
    title: string;
  }>;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem("admin_token");
      if (!token) {
        throw new Error("Admin authentication required");
      }
      
      const data = await getStudents(token);
      setStudents(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setError("Admin authentication required");
      return;
    }

    if (!confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      setDeletingId(id);
      const response = await deleteStudent(token, id);
      
      if (response) {
        // Update state optimistically
        setStudents(prev => prev.filter(s => s.id !== id));
      } else {
        throw new Error("No response from server");
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete student");
      // Re-fetch if deletion fails
      await fetchStudents();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="p-6 bg-gray-900 min-h-screen text-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-purple-400">Students</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 text-red-300 rounded-md border border-red-700/50">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-800 rounded animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-3 text-left text-purple-300 border-b border-gray-700">Name</th>
                <th className="p-3 text-left text-purple-300 border-b border-gray-700">Email</th>
                <th className="p-3 text-left text-purple-300 border-b border-gray-700">Department</th>
                <th className="p-3 text-left text-purple-300 border-b border-gray-700">Formations</th>
                <th className="p-3 text-left text-purple-300 border-b border-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="p-3 border-b border-gray-700">{s.name}</td>
                  <td className="p-3 border-b border-gray-700 text-gray-400">{s.email}</td>
                  <td className="p-3 border-b border-gray-700">
                    {s.department?.name || <span className="text-gray-500">—</span>}
                  </td>
                  <td className="p-3 border-b border-gray-700">
                    {s.formations?.length ? (
                      <div className="flex flex-wrap gap-1">
                        {s.formations.map((f) => (
                          <span key={f.id} className="px-2 py-1 bg-gray-700 rounded text-sm">
                            {f.title}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="p-3 border-b border-gray-700">
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="px-3 py-1 bg-red-600/20 text-red-400 rounded-md hover:bg-red-600/30 transition-colors"
                      disabled={deletingId === s.id}
                    >
                      {deletingId === s.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}