import React from 'react';
import styles from '../styles/UserHome.module.css';
import ContactPage from './Contact';
import ProfilePage from './Profile';
import HomeComp from './HomeComp';
import EnrolledCourses from './Mycourses';
import FavoritesComp from './FavoritesComp';
import StudyImg from '../../public/image.png';
import Image from 'next/image';
import BookRecommendations from './BookRecommendations';

const Content = ({section , setSection}) => {
    return (
        <>
        { !section && (
        <main className={styles.mainContent}>
          <section className={styles.hero}>
            <div className={styles.heroContent}>
              <h1>Transform Your Learning Experience</h1>
              <p>Join thousands of students advancing their careers with our interactive courses</p>
              <div className={styles.heroButtons}>
                <button onClick={()=>setSection("home")} className={styles.primaryButton}>Browse Courses</button>
              </div>
            </div>
            <div className={styles.heroImage}>
              <Image src={StudyImg} className={styles.imageStudy} alt="just placeholder" />
            </div>
          </section>
    
          <section className={styles.features}>
            <h2>Why Choose Kratos-University?</h2>
            <div className={styles.featureGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>📚</div>
                <h3>Expert-Led Courses</h3>
                <p>Learn from industry professionals with real-world experience</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🔄</div>
                <h3>Flexible Learning</h3>
                <p>Study at your own pace, anytime, anywhere</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🎯</div>
                <h3>Practical Skills</h3>
                <p>Gain hands-on experience with projects and exercises</p>
              </div>
            </div>
          </section>
        </main>
        )}
        {section === "contact" && (<ContactPage/>)}
        {section === "profile" && (<ProfilePage />)}
        {section === "home" && (<HomeComp/>)}
        {section === "mycourses" && <EnrolledCourses setSection={setSection}/>}
        {section === "fav" && <FavoritesComp setSection={setSection}/>}
        {section === "books" && <BookRecommendations />}
        {section && !["contact", "profile", "home","mycourses","fav","books"].includes(section) && <CourseContent section={section}/>}
        </>
      );
};

export default Content;