"use client"
import { useState, useEffect } from 'react';
import React from 'react';
import styles from '../styles/Profile.module.css';
import axios from 'axios';
import useAuthStore  from '../stores/authStore';

const ProfilePage = () => {
  const [editMode, setEditMode] = useState(false);
  const [editBio, setEditBio] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { user }  = useAuthStore();

  const [user1, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinedDate: 'January 15, 2022',
    avatar: '/placeholder-avatar.jpg',
    bio: 'Frontend developer and UI enthusiast. Building beautiful interfaces with React and CSS.',
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add(styles.darkMode);
    } else {
      document.body.classList.remove(styles.darkMode);
    }
  }, [darkMode]);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("user", user);
        const response = await axios.get(`http://localhost:8000/student/getStudent/${user.user_id}`);
        const userData = response.data;
        setUser({
          ...user1,
          name: userData.name,
          email: userData.email,
          joinedDate: userData.joinedDate,
          bio: userData.bio,
        });
      }catch(error){
          console.error("Error fetching user data:", error);
      }
    }
    fetchUserData();
  },[]);


  const handleSaveChanges1 = async () => {
    try{
      await axios.put(`http://localhost:8000/student/changeemailname/${user.user_id}`,
        {
          email: user1.email,
          username: user1.name,
        }
      );
    }catch(error){
      console.error("Error saving changes:", error);
    }
    setEditMode(false);
  }


    const handleSaveChanges2 = async () => {

      try{
        await axios.put(`http://localhost:8000/student/updatebio/${user.user_id}`,
          {
            about: user1.bio,
          }
        );
    }catch(error){
      console.error("Error saving changes:", error);
    }
      setEditBio(false);
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileWrapper}>
        <div className={styles.sidebar}>
          <div className={styles.card}>
            <div className={styles.avatarContainer}>
              <div className={styles.avatarLetter}>{user1.name.substring(0, 3).toUpperCase()}</div>
            </div>
            <h2 className={styles.userName}>{user1.name}</h2>
            <p className={styles.userEmail}>{user1.email}</p>
          </div>
        </div>

        <div className={styles.mainContent}>
          {editMode ? (
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>Edit Personal Information</h2>
              <div className={styles.infoGroup}>
                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>Full Name</label>
                  <input
                    type="text"
                    className={styles.inputField}
                    value={user1.name}
                    onChange={(e) => setUser({ ...user1, name: e.target.value })}
                  />
                </div>
                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>Email</label>
                  <input
                    type="email"
                    className={styles.inputField}
                    value={user1.email}
                    onChange={(e) => setUser({ ...user1, email: e.target.value })}
                  />
                </div>
                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>Member Since</label>
                  <p className={styles.readOnlyField}>{user1.joinedDate}</p>
                </div>
              </div>
              <div className={styles.buttonGroup}>
                <button className={styles.saveButton} onClick={handleSaveChanges1}>
                  Save Changes
                </button>
                <button className={styles.cancelButton} onClick={() => setEditMode(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.card}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Personal Information</h2>
                <button
                  className={styles.editButton}
                  onClick={() => setEditMode(true)}
                >
                  Edit
                </button>
              </div>
              <div className={styles.infoGroup}>
                <div className={styles.infoItem}>
                  <h3 className={styles.infoLabel}>Full Name</h3>
                  <p className={styles.infoValue}>{user1.name}</p>
                </div>
                <div className={styles.infoItem}>
                  <h3 className={styles.infoLabel}>Email</h3>
                  <p className={styles.infoValue}>{user1.email}</p>
                </div>
                <div className={styles.infoItem}>
                  <h3 className={styles.infoLabel}>Member Since</h3>
                  <p className={styles.infoValue}>{user1.joinedDate}</p>
                </div>
              </div>
            </div>
          )}

          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>About Me</h2>
             {!editBio &&
              <button
              className={styles.editButton}
              onClick={() => setEditBio(true)}
            >
              Edit
            </button>} 
            </div>

            {editBio ? (
              
              (<>
                <textarea
                  className={styles.bioArea}
                  value={user1.bio}
                  onChange={(e) => setUser({ ...user1, bio: e.target.value })}
                />
                <div className={styles.buttonGroup}>
                  <button className={styles.saveButton} onClick={handleSaveChanges2}>
                    Save Changes
                  </button>
                  <button className={styles.cancelButton} onClick={() => setEditBio(false)}>
                    Cancel
                  </button>
                </div>
              </>
              )
            ) : (
              <p className={styles.userBio}>{user1.bio}</p>
            )}
          </div>

          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Preferences</h2>
            <div className={styles.preferences}>
              <div className={styles.preferenceItem}>
                <span>Dark Mode</span>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
              <div className={styles.preferenceItem}>
                <span>Email Notifications</span>
                <label className={styles.switch}>
                  <input type="checkbox" defaultChecked />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

