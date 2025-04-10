'use client'
import { useEffect, useState } from "react";
import { getStudents, deleteStudent } from "@/services/api";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStudents = () => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    setLoading(true);
    getStudents(token)
      .then(setStudents)
      .catch((err) => setError(err.message || "Failed to fetch students"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    try {
      await deleteStudent(token, id);
      fetchStudents(); // Refresh the list after deletion
    } catch (err: any) {
      setError(err.message || "Failed to delete student");
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
              {students.map((s: any) => (
                <tr key={s.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="p-3 border-b border-gray-700">{s.name}</td>
                  <td className="p-3 border-b border-gray-700 text-gray-400">{s.email}</td>
                  <td className="p-3 border-b border-gray-700">
                    {s.department?.name || <span className="text-gray-500">—</span>}
                  </td>
                  <td className="p-3 border-b border-gray-700">
                    {s.formations?.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {s.formations.map((f: any) => (
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
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Delete
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