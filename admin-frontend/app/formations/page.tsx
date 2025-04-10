'use client'
import { useEffect, useState } from "react";
import { getFormations, deleteFormation } from "@/services/api";

export default function FormationsPage() {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFormations = () => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    setLoading(true);
    getFormations(token)
      .then(setFormations)
      .catch((err) => setError(err.message || "Failed to fetch formations"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFormations();
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    try {
      await deleteFormation(token, id);
      fetchFormations(); // Refresh the list after deletion
    } catch (err: any) {
      setError(err.message || "Failed to delete formation");
    }
  };

  return (
    <main className="p-6 bg-gray-900 min-h-screen text-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-purple-400">Formations</h1>

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
          {formations.map((f: any) => (
            <div key={f.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg text-purple-300">{f.title}</h3>
                <button 
                  onClick={() => handleDelete(f.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Delete
                </button>
              </div>
              <p className="text-gray-400 mt-2">
                {f.description || "No description available"}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}