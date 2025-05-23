"use client"
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Login.module.css';
import axios from 'axios';
import useAuthStore from '../stores/authStore';
import { useRouter } from 'next/navigation';

export default function Login() {

  axios.defaults.baseURL = "http://127.0.0.1:8000/auth";


  const {login,checkAuth} = useAuthStore();
  const [errorMsg, setErrorMsg] = useState('');



  useEffect(()=>{
    if(checkAuth()){
      router.push('/home');
    }
  },[])

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData);
      router.push('/home');
      setErrorMsg('');
      setErrorMsg(res.message || 'Login failed. Please try again.');

    } catch (error) {
      setErrorMsg(error.response?.data?.message || error.message || "An error occurred during login.");
    }
  };

  return (
    <>
      <Head>
        <title>Kratos-University - Log In</title>
        <meta name="description" content="Access your Kratos-University learning dashboard" />
      </Head>

      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.logo}>
            <span className={styles.logoPart1}>Edu</span>
            <span className={styles.logoPart2}>Quest</span>
          </div>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Continue your learning journey</p>

          <form onSubmit={handleSubmit} className={styles.loginForm}>
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
                placeholder="Enter your password"
                required
              />
            </div>

            <div className={styles.optionsContainer}>
              <div className={styles.rememberMe}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className={styles.checkbox}
                />
                <label htmlFor="rememberMe" className={styles.rememberLabel}>Remember me</label>
              </div>
              
              <Link href="/forgot-password" className={styles.forgotPassword}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" className={styles.loginButton}>Log In</button>
          </form>

          <div className={styles.socialLogin}>
            <p className={styles.socialDivider}>or continue with</p>
            <div className={styles.socialButtons}>
              <button type="button" className={styles.socialButton}>
                <span className={styles.googleIcon}></span>
              </button>
              <button type="button" className={styles.socialButton}>
                <span className={styles.microsoftIcon}></span>
              </button>
            </div>
          </div>

          <p className={styles.signupPrompt}>
            Don't have an account? <Link href="/signup" className={styles.signupLink}>Sign up</Link>
          </p>

          {errorMsg && <div className={styles.errorMessage}>{errorMsg}</div>}
        </div>
      </div>
    </>
  );
}