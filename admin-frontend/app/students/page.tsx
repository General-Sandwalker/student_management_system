'use client'
import { useEffect, useState } from "react";
import { getStudents, deleteStudent, updateStudent, getDepartments, getFormations } from "@/services/api";
import { Check, X, Pencil, Trash2 } from 'lucide-react';

interface Student {
  id: number;
  name: string;
  email: string;
  department?: {
    id: number;
    name: string;
  };
  formations?: Array<{
    id: number;
    title: string;
    description?: string;
  }>;
}

interface Department {
  id: number;
  name: string;
}

interface Formation {
  id: number;
  title: string;
  description?: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<{
    name: string;
    email: string;
    password: string;
    department_id?: number;
    formation_ids?: number[];
  }>({
    name: '',
    email: '',
    password: '',
    department_id: undefined,
    formation_ids: []
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem("admin_token");
      if (!token) {
        throw new Error("Admin authentication required");
      }

      const [studentsData, deptsData, formsData] = await Promise.all([
        getStudents(token),
        getDepartments(token),
        getFormations(token)
      ]);

      setStudents(studentsData);
      setDepartments(deptsData);
      setFormations(formsData);
    } catch (err: any) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
      await deleteStudent(token, id);
      setStudents(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete student");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (student: Student) => {
    setEditingId(student.id);
    setEditFormData({
      name: student.name,
      email: student.email,
      password: '',
      department_id: student.department?.id,
      formation_ids: student.formations?.map(f => f.id) || []
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'department_id' ? (value ? parseInt(value) : undefined) : value
    }));
  };

  const handleFormationToggle = (formationId: number) => {
    setEditFormData(prev => {
      const currentIds = prev.formation_ids || [];
      const newIds = currentIds.includes(formationId)
        ? currentIds.filter(id => id !== formationId)
        : [...currentIds, formationId];
      return { ...prev, formation_ids: newIds };
    });
  };

  const handleUpdate = async (id: number) => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setError("Admin authentication required");
      return;
    }

    try {
      setLoading(true);
      const updatedStudent = await updateStudent(token, id, editFormData);
      setStudents(prev => prev.map(s => s.id === id ? updatedStudent : s));
      setEditingId(null);
    } catch (err: any) {
      setError(err.message || "Failed to update student");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <main className="p-6 bg-gray-900 min-h-screen text-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-purple-400">Students</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 text-red-300 rounded-md border border-red-700/50">
          {error}
        </div>
      )}

      {loading && !editingId ? (
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
                <tr key={s.id} className="hover:bg-gray-800/50 transition-colors group">
                  <td className="p-3 border-b border-gray-700">
                    {editingId === s.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          name="name"
                          value={editFormData.name}
                          onChange={handleEditChange}
                          className="w-full px-2 py-1 bg-gray-700 rounded text-white"
                        />
                        <input
                          type="password"
                          name="password"
                          value={editFormData.password}
                          onChange={handleEditChange}
                          placeholder="New password (leave blank to keep current)"
                          className="w-full px-2 py-1 bg-gray-700 rounded text-white"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span>{s.name}</span>
                        <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                          ID: {s.id}
                        </span>
                      </div>
                    )}
                  </td>

                  <td className="p-3 border-b border-gray-700 text-gray-400">
                    {editingId === s.id ? (
                      <input
                        type="email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1 bg-gray-700 rounded text-white"
                      />
                    ) : (
                      s.email
                    )}
                  </td>

                  <td className="p-3 border-b border-gray-700">
                    {editingId === s.id ? (
                      <select
                        name="department_id"
                        value={editFormData.department_id || ''}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1 bg-gray-700 rounded text-white"
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      s.department?.name || <span className="text-gray-500">—</span>
                    )}
                  </td>

                  <td className="p-3 border-b border-gray-700">
                    {editingId === s.id ? (
                      <div className="max-h-40 overflow-y-auto">
                        {formations.map((f) => (
                          <label key={f.id} className="flex items-center gap-2 py-1">
                            <input
                              type="checkbox"
                              checked={editFormData.formation_ids?.includes(f.id) || false}
                              onChange={() => handleFormationToggle(f.id)}
                              className="form-checkbox text-purple-500"
                            />
                            <span>{f.title}</span>
                          </label>
                        ))}
                      </div>
                    ) : s.formations?.length ? (
                      <div className="flex flex-wrap gap-1">
                        {s.formations.map((f) => (
                          <span
                            key={f.id}
                            className="px-2 py-1 bg-gray-700 rounded text-sm hover:bg-purple-600 transition-colors"
                            title={f.description}
                          >
                            {f.title}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>

                  <td className="p-3 border-b border-gray-700 flex gap-2">
                    {editingId === s.id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(s.id)}
                          className="px-3 py-1 bg-green-600/20 text-green-400 rounded-md hover:bg-green-600/30 transition-colors flex items-center gap-1"
                          disabled={loading}
                        >
                          {loading ? 'Saving...' : (
                            <>
                              <Check className="w-4 h-4" />
                              Save
                            </>
                          )}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1 bg-gray-600/20 text-gray-400 rounded-md hover:bg-gray-600/30 transition-colors flex items-center gap-1"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(s)}
                          className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-md hover:bg-blue-600/30 transition-colors flex items-center gap-1"
                        >
                          <Pencil className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="px-3 py-1 bg-red-600/20 text-red-400 rounded-md hover:bg-red-600/30 transition-colors flex items-center gap-1"
                          disabled={deletingId === s.id}
                        >
                          {deletingId === s.id ? 'Deleting...' : (
                            <>
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </>
                          )}
                        </button>
                      </>
                    )}
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