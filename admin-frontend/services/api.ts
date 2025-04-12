const API_URL = "http://localhost:8000";

// ======================== Interfaces ========================
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
  }>;
}

interface StudentCreate {
  name: string;
  email: string;
  password: string;
  department_id?: number;
  formation_ids?: number[];
}

interface StudentUpdate extends Partial<StudentCreate> {}

interface Department {
  id: number;
  name: string;
  student_count?: number;
}

interface DepartmentCreate {
  name: string;
}

interface Formation {
  id: number;
  title: string;
  description?: string;
  students_count?: number;
}

interface FormationCreate {
  title: string;
  description?: string;
}

// ======================== Auth Service ========================
export const login = async (email: string, password: string) => {
  const formData = new FormData();
  formData.append("username", email);
  formData.append("password", password);

  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Login failed");
  }
  return response.json();
};

// ======================= Student Services =======================
export const getStudents = async (token: string): Promise<Student[]> => {
  const response = await fetch(`${API_URL}/students/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to fetch students");
  }
  return response.json();
};

export const createStudent = async (
  token: string,
  studentData: StudentCreate
): Promise<Student> => {
  const response = await fetch(`${API_URL}/students/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(studentData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to create student");
  }
  return response.json();
};

export const updateStudent = async (
  token: string,
  id: number,
  studentData: StudentUpdate
): Promise<Student> => {
  const response = await fetch(`${API_URL}/students/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...studentData,
      department_id: studentData.department_id || null,
      formation_ids: studentData.formation_ids || [],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to update student");
  }
  return response.json();
};

export const deleteStudent = async (
  token: string,
  id: number
): Promise<void> => {
  const response = await fetch(`${API_URL}/students/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to delete student");
  }
};

// ======================= Department Services =======================
export const getDepartments = async (token: string): Promise<Department[]> => {
  const response = await fetch(`${API_URL}/departments/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to fetch departments");
  }
  return response.json();
};

export const createDepartment = async (
  token: string,
  departmentData: DepartmentCreate
): Promise<Department> => {
  const response = await fetch(`${API_URL}/departments/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(departmentData),
  });

  if (!response.ok) {
    const error = await response.json();
    if (response.status === 409) {
      throw new Error(`Department "${departmentData.name}" already exists`);
    }
    throw new Error(error.detail || "Failed to create department");
  }
  return response.json();
};

export const updateDepartment = async (
  token: string,
  id: number,
  departmentData: DepartmentCreate
): Promise<Department> => {
  const response = await fetch(`${API_URL}/departments/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(departmentData),
  });

  if (!response.ok) {
    const error = await response.json();
    if (response.status === 409) {
      throw new Error(`Department "${departmentData.name}" already exists`);
    }
    throw new Error(error.detail || "Failed to update department");
  }
  return response.json();
};

export const deleteDepartment = async (
  token: string,
  id: number
): Promise<void> => {
  const response = await fetch(`${API_URL}/departments/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to delete department");
  }
};

// ======================= Formation Services =======================
export const getFormations = async (token: string): Promise<Formation[]> => {
  const response = await fetch(`${API_URL}/formations/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to fetch formations");
  }
  return response.json();
};

export const createFormation = async (
  token: string,
  formationData: FormationCreate
): Promise<Formation> => {
  const response = await fetch(`${API_URL}/formations/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formationData),
  });

  if (!response.ok) {
    const error = await response.json();
    if (response.status === 409) {
      throw new Error(`Formation "${formationData.title}" already exists`);
    }
    throw new Error(error.detail || "Failed to create formation");
  }
  return response.json();
};

export const updateFormation = async (
  token: string,
  id: number,
  formationData: FormationCreate
): Promise<Formation> => {
  const response = await fetch(`${API_URL}/formations/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formationData),
  });

  if (!response.ok) {
    const error = await response.json();
    if (response.status === 409) {
      throw new Error(`Formation "${formationData.title}" already exists`);
    }
    throw new Error(error.detail || "Failed to update formation");
  }
  return response.json();
};

export const deleteFormation = async (
  token: string,
  id: number
): Promise<void> => {
  const response = await fetch(`${API_URL}/formations/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to delete formation");
  }
};

// ======================= Admin Services =======================
export const getAdminStats = async (token: string) => {
  const response = await fetch(`${API_URL}/admins/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to fetch stats");
  }
  return response.json();
};