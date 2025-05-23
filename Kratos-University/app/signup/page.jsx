"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Signup.module.css';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import useAuthStore from '../stores/authStore';

export default function SignUp() {
  axios.defaults.baseURL = "http://localhost:8000/student";

  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [departments,setDepartements] = useState([]);
  const router = useRouter();

  const {register,checkAuth} = useAuthStore();
  

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    departmentId: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMsg("");
  if (formData.username.length < 3) {
    setErrorMsg("Username must be at least 3 characters long.");
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    setErrorMsg("Please enter a valid email address.");
    return;
  }
  if (formData.password.length < 8) {
    setErrorMsg("Password must be at least 8 characters long.");
    return;
  }
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  if (!passwordRegex.test(formData.password)) {
    setErrorMsg("Password must contain at least one uppercase letter, one lowercase letter, and one number.");
    return;
  }
  if (formData.password !== confirmedPassword) {
    setErrorMsg("Passwords do not match.");
    return;
  }
  if (!formData.departmentId) {
    setErrorMsg("Please select a department.");
    return;
  }
  try {
    await register(formData);
    router.push("/home");
  } catch (err) {
    setErrorMsg(err.message);
  }
};

  useEffect(()=>{
    if(checkAuth()){
      router.push('/home');
      return;
    }
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:8000/student/getDepartments');
        setDepartements(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    }
    fetchDepartments();
  },[])

  return (
      <div className={styles.signupContainer}>
        <div className={styles.signupCard}>
          <div className={styles.logo}>
            <span className={styles.logoPart1}>Edu</span>
            <span className={styles.logoPart2}>Quest</span>
          </div>
          <h1 className={styles.title}>Create Your Account</h1>
          <p className={styles.subtitle}>Join thousands of learners worldwide</p>

          <form onSubmit={handleSubmit} className={styles.signupForm}>
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.label}>Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                placeholder="Create a password"
                required
                minLength="8"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Confirm Password</label>
              <input
                type="password"
                id="confirmedPassword"
                name="confirmedPassword"
                value={confirmedPassword}
                onChange={(e) => setConfirmedPassword(e.target.value)}
                className={styles.input}
                placeholder="Confirm your password"
                required
                minLength="8"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="departmentId" className={styles.label}>Department</label>
              <select
                id="departmentId"
                name="departmentId"
                value={formData.department}
                onChange={handleChange}
                className={styles.select}
                required
              >
                <option value="">Select your department</option>
                {departments.map(dep=>{
                  return <option key={dep.id} value={dep.id}>{dep.name}</option>
                })}
                {/* <option value="Engineering">Engineering</option>
                <option value="Business">Business</option>
                <option value="Arts">Arts</option>
                <option value="Science">Science</option>
                <option value="Other">Other</option> */}
              </select>
            </div>

            {errorMsg && <div className={styles.errorMessage}>{errorMsg}</div>}
            <button type="submit" className={styles.submitButton}>Sign Up</button>
          </form>

          <p className={styles.loginPrompt}>
            Already have an account? <Link href="/login" className={styles.loginLink}>Log in</Link>
          </p>
        </div>
      </div>
  );
}