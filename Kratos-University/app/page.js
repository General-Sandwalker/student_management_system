"use client"
import React from 'react';
import styles from './styles/Home.module.css';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();
    const handleStartLearning = () => {
        router.push('/signup');
    }

    const handleExploreCourses = () => {
        router.push('/login');
    }
  return (
    <div className={styles.body}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.titlePart1}>Kratos</span>
            <span className={styles.titlePart2}>University</span>
          </h1>
          <p className={styles.heroSubtitle}>Embark on your personalized learning adventure</p>
          <div className={styles.ctaContainer}>
            <button className={`${styles.ctaButton} ${styles.primary}`} onClick={handleStartLearning}>Start Learning</button>
            <button className={`${styles.ctaButton} ${styles.secondary}`} onClick={handleExploreCourses}>Explore Courses</button>
          </div>
        </div>
        <div className={styles.heroIllustration}>
          <div className={styles.book}></div>
          <div className={styles.graduationCap}></div>
          <div className={styles.lightBulb}></div>
        </div>
      </div>

      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Why Choose Kratos-University?</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={`${styles.featureIcon} ${styles.personalized}`}></div>
            <h3>Personalized Paths</h3>
            <p>Learning journeys tailored to your goals and pace</p>
          </div>
          <div className={styles.featureCard}>
            <div className={`${styles.featureIcon} ${styles.interactive}`}></div>
            <h3>Interactive Content</h3>
            <p>Engaging lessons with hands-on activities</p>
          </div>
          <div className={styles.featureCard}>
            <div className={`${styles.featureIcon} ${styles.community}`}></div>
            <h3>Vibrant Community</h3>
            <p>Connect with fellow learners and mentors</p>
          </div>
        </div>
      </section>

      <section className={styles.coursePreview}>
        <h2 className={styles.sectionTitle}>Featured Courses</h2>
        <div className={styles.courseCards}>
          <div className={styles.courseCard}>
            <div className={styles.courseImage}></div>
            <div className={styles.courseInfo}>
              <h3>Modern Web Development</h3>
              <p>Master React, Next.js, and modern JavaScript</p>
              <span className={styles.difficulty}>Intermediate</span>
            </div>
          </div>
          <div className={styles.courseCard}>
            <div className={styles.courseImage}></div>
            <div className={styles.courseInfo}>
              <h3>Data Science Fundamentals</h3>
              <p>Python, Pandas, and data visualization</p>
              <span className={styles.difficulty}>Beginner</span>
            </div>
          </div>
          <div className={styles.courseCard}>
            <div className={styles.courseImage}></div>
            <div className={styles.courseInfo}>
              <h3>Creative Writing Workshop</h3>
              <p>Develop your storytelling skills</p>
              <span className={styles.difficulty}>All Levels</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.testimonials}>
        <h2 className={styles.sectionTitle}>What Our Learners Say</h2>
        <div className={styles.testimonialCards}>
          <div className={styles.testimonialCard}>
            <div className={styles.quote}>"Kratos-University transformed how I learn. The interactive lessons made complex topics easy to understand."</div>
            <div className={styles.author}>- Sarah K.</div>
          </div>
          <div className={styles.testimonialCard}>
            <div className={styles.quote}>"I went from complete beginner to landing my first developer job in 6 months!"</div>
            <div className={styles.author}>- Michael T.</div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>Kratos-University</div>
          <div className={styles.footerLinks}>
            <a href="#">About Us</a>
            <a href="#">Courses</a>
            <a href="#">Pricing</a>
            <a href="#">Contact</a>
          </div>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialIcon}><svg xmlns="http://www.w3.org/2000/svg" className='icons' viewBox="0 0 128 128"><rect fill="#3d5a98" x="4.83" y="4.83" width="118.35" height="118.35" rx="6.53" ry="6.53"/><path fill="#fff" d="M86.48 123.17V77.34h15.38l2.3-17.86H86.48v-11.4c0-5.17 1.44-8.7 8.85-8.7h9.46v-16A126.56 126.56 0 0091 22.7c-13.62 0-23 8.3-23 23.61v13.17H52.62v17.86H68v45.83z"/></svg></a>
            <a href="#" className={styles.socialIcon}><svg xmlns="http://www.w3.org/2000/svg" className='icons' viewBox="0 0 128 128"><path fill="#1d9bf0" d="M114.896 37.888c.078 1.129.078 2.257.078 3.396 0 34.7-26.417 74.72-74.72 74.72v-.02A74.343 74.343 0 0 1 0 104.21c2.075.25 4.16.375 6.25.38a52.732 52.732 0 0 0 32.615-11.263A26.294 26.294 0 0 1 14.331 75.09c3.937.76 7.993.603 11.857-.453-12.252-2.475-21.066-13.239-21.066-25.74v-.333a26.094 26.094 0 0 0 11.919 3.287C5.5 44.139 1.945 28.788 8.913 16.787a74.535 74.535 0 0 0 54.122 27.435 26.277 26.277 0 0 1 7.598-25.09c10.577-9.943 27.212-9.433 37.154 1.139a52.696 52.696 0 0 0 16.677-6.376A26.359 26.359 0 0 1 112.92 28.42 52.227 52.227 0 0 0 128 24.285a53.35 53.35 0 0 1-13.104 13.603z"/></svg></a>
            <a href="#" className={styles.socialIcon}><svg xmlns="http://www.w3.org/2000/svg" className='icons' viewBox="0 0 128 128"><g fill="#181616"><path fillRule="evenodd" clipRule="evenodd" d="M64 5.103c-33.347 0-60.388 27.035-60.388 60.388 0 26.682 17.303 49.317 41.297 57.303 3.017.56 4.125-1.31 4.125-2.905 0-1.44-.056-6.197-.082-11.243-16.8 3.653-20.345-7.125-20.345-7.125-2.747-6.98-6.705-8.836-6.705-8.836-5.48-3.748.413-3.67.413-3.67 6.063.425 9.257 6.223 9.257 6.223 5.386 9.23 14.127 6.562 17.573 5.02.542-3.903 2.107-6.568 3.834-8.076-13.413-1.525-27.514-6.704-27.514-29.843 0-6.593 2.36-11.98 6.223-16.21-.628-1.52-2.695-7.662.584-15.98 0 0 5.07-1.623 16.61 6.19C53.7 35 58.867 34.327 64 34.304c5.13.023 10.3.694 15.127 2.033 11.526-7.813 16.59-6.19 16.59-6.19 3.287 8.317 1.22 14.46.593 15.98 3.872 4.23 6.215 9.617 6.215 16.21 0 23.194-14.127 28.3-27.574 29.796 2.167 1.874 4.097 5.55 4.097 11.183 0 8.08-.07 14.583-.07 16.572 0 1.607 1.088 3.49 4.148 2.897 23.98-7.994 41.263-30.622 41.263-57.294C124.388 32.14 97.35 5.104 64 5.104z"/><path d="M26.484 91.806c-.133.3-.605.39-1.035.185-.44-.196-.685-.605-.543-.906.13-.31.603-.395 1.04-.188.44.197.69.61.537.91zm2.446 2.729c-.287.267-.85.143-1.232-.28-.396-.42-.47-.983-.177-1.254.298-.266.844-.14 1.24.28.394.426.472.984.17 1.255zM31.312 98.012c-.37.258-.976.017-1.35-.52-.37-.538-.37-1.183.01-1.44.373-.258.97-.025 1.35.507.368.545.368 1.19-.01 1.452zm3.261 3.361c-.33.365-1.036.267-1.552-.23-.527-.487-.674-1.18-.343-1.544.336-.366 1.045-.264 1.564.23.527.486.686 1.18.333 1.543zm4.5 1.951c-.147.473-.825.688-1.51.486-.683-.207-1.13-.76-.99-1.238.14-.477.823-.7 1.512-.485.683.206 1.13.756.988 1.237zm4.943.361c.017.498-.563.91-1.28.92-.723.017-1.308-.387-1.315-.877 0-.503.568-.91 1.29-.924.717-.013 1.306.387 1.306.88zm4.598-.782c.086.485-.413.984-1.126 1.117-.7.13-1.35-.172-1.44-.653-.086-.498.422-.997 1.122-1.126.714-.123 1.354.17 1.444.663zm0 0"/></g></svg></a>
          </div>
        </div>
        <div className={styles.copyright}>© {new Date().getFullYear()} Kratos-University. All rights reserved.</div>
      </footer>
    </div>
  );
}