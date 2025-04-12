'use client'
import { useEffect, useState } from "react";
import { getFormations, deleteFormation, createFormation, updateFormation } from "@/services/api";

interface Formation {
  id: number;
  title: string;
  description?: string;
}

export default function FormationsPage() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Formation, 'id'>>({ 
    title: '', 
    description: '' 
  });
  const [showForm, setShowForm] = useState(false);

  const fetchFormations = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem("admin_token");
      if (!token) {
        throw new Error("Admin authentication required");
      }

      const data = await getFormations(token);
      setFormations(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch formations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormations();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this formation?")) return;

    try {
      const token = localStorage.getItem("admin_token");
      if (!token) return;

      await deleteFormation(token, id);
      fetchFormations(); // Refresh the list
    } catch (err: any) {
      setError(err.message || "Failed to delete formation");
    }
  };

  const handleEdit = (formation: Formation) => {
    setEditingId(formation.id);
    setFormData({
      title: formation.title,
      description: formation.description || ''
    });
    setShowForm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        throw new Error("Admin authentication required");
      }

      if (editingId) {
        await updateFormation(token, editingId, formData);
      } else {
        await createFormation(token, formData);
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({ title: '', description: '' });
      fetchFormations();
    } catch (err: any) {
      setError(err.message || "Failed to save formation");
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ title: '', description: '' });
  };

  return (
    <main className="p-6 bg-gray-900 min-h-screen text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-purple-400">Formations</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
        >
          Add New Formation
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 text-red-300 rounded-md border border-red-700/50">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-6 bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-purple-300">
            {editingId ? 'Edit Formation' : 'Create New Formation'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelForm}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-800 rounded animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {formations.map((f) => (
            <div key={f.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg text-purple-300">{f.title}</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(f)}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(f.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
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