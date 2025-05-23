"use client"
import React, { useEffect } from 'react';
import useCoursesStore from '../stores/coursesStore';
import styles from '../styles/Sidebar.module.css';
import { useRouter } from 'next/navigation';
import useAuthStore from '../stores/authStore';

const Sidebar = () => {
  const { enrolledCourses, courses, calculateProgress, fetchEnrolledCourses, fetchCourses ,getNextLesson } = useCoursesStore();
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.user_id) {
      fetchCourses();
      fetchEnrolledCourses(user.user_id);
    }
  }, [user?.user_id]);

  const enrolledCoursesWithProgress = enrolledCourses.map(enrollment => {
    const course = courses.find(c => c.id == enrollment.course_id);
    return {
      ...course,
      progress: calculateProgress(enrollment.course_id),
      nextLesson: getNextLesson(enrollment.course_id) || "No lessons available"
    };
  }).filter(course => course.id); // Filter out undefined courses

  const handleGotoCourse = (id) => {
    router.push(`/course/${id}`);
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        <h2 className={styles.sidebarTitle}>My Courses</h2>
        <ul className={styles.sidebarCourses}>
          {enrolledCoursesWithProgress.map(course => (
            <li key={course.id} className={styles.sidebarCourseItem} onClick={() => handleGotoCourse(course.id)}>
              <div className={styles.courseInfo}>
                <h3 className={styles.courseTitle}>{course.title}</h3>
              </div>
              <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <span className={styles.progressText}>{course.progress}%</span>
              </div>
              <div className={styles.nextLesson}>
                <span>Next: {course.nextLesson}</span>
              </div>
            </li>
          ))}
          {enrolledCoursesWithProgress.length === 0 && (
            <li className={styles.sidebarNothing}>No enrolled courses</li>
          )}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;