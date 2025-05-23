"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from "../stores/authStore";
import styles from "../styles/UserHome.module.css";
import Navbar from '../components/NavBar';
import Sidebar from '../components/SideBar';
import Content from '../components/Content';

const Dashboard = () => {
  const [section, setSection] = useState();
  const { checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(()=>{
    if(!checkAuth()){
      router.push('/login');
    }
  },[])
  

  return (
    <div className={styles.container}>
      <Navbar setSection={setSection} />
      <Sidebar />
      <Content section={section} setSection={setSection} />
    </div>
  );
};

export default Dashboard;