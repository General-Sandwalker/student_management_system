const API_URL = "http://localhost:8000";

export const login = async (email: string, password: string) => {
  const formData = new FormData();
  formData.append("username", email);
  formData.append("password", password);

  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json();
};

export const getStudents = async (token: string) => {
  const res = await fetch(`${API_URL}/students/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch students");
  return res.json();
};


export const getDepartments = async (token: string) => {
  const res = await fetch(`${API_URL}/departments/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch departments");
  return res.json();
};

export const getFormations = async (token: string) => {
  const res = await fetch(`${API_URL}/formations/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch formations");
  return res.json();
};

export const getAdminStats = async (token: string) => {
  const response = await fetch('http://localhost:8000/admins/stats', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch stats')
  }

  return await response.json()
}

export const deleteStudent = async (token: string, id: number) => {
  const response = await fetch(`http://localhost:8000/students/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to delete student');
  }
  return await response.json();
};

export const deleteDepartment = async (token: string, id: number) => {
  const response = await fetch(`http://localhost:8000/departments/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to delete department');
  }
  return await response.json();
};

export const deleteFormation = async (token: string, id: number) => {
  const response = await fetch(`http://localhost:8000/formations/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to delete formation');
  }
  return await response.json();
};