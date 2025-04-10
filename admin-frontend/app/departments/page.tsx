'use client'
import { useEffect, useState } from "react";
import { getDepartments, deleteDepartment } from "@/services/api";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDepartments = () => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    setLoading(true);
    getDepartments(token)
      .then(data => {
        setDepartments(data);
      })
      .catch((err) => setError(err.message || "Failed to fetch departments"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;
  
    setDeletingId(id);
    try {
      await deleteDepartment(token, id);
      await fetchDepartments();
    } catch (err: any) {
      setError(err.message || "Failed to delete department");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="p-6 bg-gray-900 min-h-screen text-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-purple-400">Departments</h1>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((d: any) => (
            <div key={d.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg text-purple-300">{d.name}</h3>
                <button
                  onClick={() => handleDelete(d.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                  disabled={deletingId === d.id}
                >
                  {deletingId === d.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
              <p className="text-gray-400 mt-2">
                {d.student_count} students
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}