"use client"
import useCoursesStore from "../stores/coursesStore";
import styles from "../styles/ProgressOverview.module.css";
import useAuthStore from "../stores/authStore";
import { useEffect, useState } from "react";

const TotalProgress = () => {
  const { enrolledCourses, courses, calculateProgress, fetchEnrolledCourses } = useCoursesStore();
  const { user } = useAuthStore();
  const [totalProgress, setTotalProgress] = useState(0);
  const [completedCourses, setCompletedCourses] = useState(0);

  useEffect(() => {
    if (user?.user_id) {
      fetchEnrolledCourses(user.user_id);
    }
  }, [user?.user_id]);

  useEffect(() => {
    if (enrolledCourses.length > 0 && courses.length > 0) {
      const enrolledWithProgress = enrolledCourses.map(enrollment => {
        const course = courses.find(c => c.id === enrollment.course_id);
        const progress = calculateProgress(enrollment.course_id);
        return {
          ...course,
          progress: Math.round(progress),
          isCompleted: progress >= 100
        };
      }).filter(course => course.id);

      const validCourses = enrolledWithProgress.filter(course => !isNaN(course.progress));
      const avgProgress = validCourses.length > 0
        ? validCourses.reduce((sum, course) => sum + course.progress, 0) / validCourses.length
        : 0;

      const completedCount = enrolledWithProgress.filter(course => course.isCompleted).length;

      setTotalProgress(Math.round(avgProgress));
      setCompletedCourses(completedCount);
    } else {
      setTotalProgress(0);
      setCompletedCourses(0);
    }
  }, [enrolledCourses, courses]);

  return (
    <div className={styles.progressContainer}>
      <h2 className={styles.progressTitle}>Overall Learning Progress</h2>
      <div className={styles.progressCircle}>
        <div 
          className={styles.circleBackground} 
          style={{ 
            background: `conic-gradient(#4CAF50 ${totalProgress}%, #e0e0e0 ${totalProgress}% 100%)`
          }}
        >
          <div className={styles.circleInner}>
            <span className={styles.progressPercent}>{totalProgress}%</span>
          </div>
        </div>
      </div>
      <div className={styles.progressStats}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{enrolledCourses.length}</span>
          <span className={styles.statLabel}>Courses</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{completedCourses}</span>
          <span className={styles.statLabel}>Completed</span>
        </div>
      </div>
    </div>
  );
};

export default TotalProgress;