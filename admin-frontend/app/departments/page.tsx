'use client'
import { useEffect, useState } from "react";
import { getDepartments, deleteDepartment, createDepartment, updateDepartment } from "@/services/api";

interface Department {
  id: number;
  name: string;
  student_count?: number;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem("admin_token");
      if (!token) throw new Error("Admin authentication required");

      const data = await getDepartments(token);
      setDepartments(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this department?")) return;

    try {
      const token = localStorage.getItem("admin_token");
      if (!token) return;

      setDeletingId(id);
      await deleteDepartment(token, id);
      await fetchDepartments();
    } catch (err: any) {
      setError(err.message || "Failed to delete department");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (department: Department) => {
    setEditingId(department.id);
    setFormData({ name: department.name });
    setShowForm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) throw new Error("Admin authentication required");

      if (editingId) {
        await updateDepartment(token, editingId, formData);
      } else {
        await createDepartment(token, formData);
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '' });
      fetchDepartments();
    } catch (err: any) {
      setError(err.message || "Failed to save department");
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '' });
  };

  return (
    <main className="p-6 bg-gray-900 min-h-screen text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-purple-400">Departments</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
        >
          Add New Department
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
            {editingId ? 'Edit Department' : 'Create New Department'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Department Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                required
                minLength={2}
                maxLength={50}
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
                {editingId ? 'Update Department' : 'Create Department'}
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
          {departments.map((d) => (
            <div key={d.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg text-purple-300">{d.name}</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(d)}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(d.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                    disabled={deletingId === d.id}
                  >
                    {deletingId === d.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-gray-400">
                  {d.student_count || 0} {d.student_count === 1 ? 'student' : 'students'}
                </span>
                <span className="text-xs text-gray-500">ID: {d.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}