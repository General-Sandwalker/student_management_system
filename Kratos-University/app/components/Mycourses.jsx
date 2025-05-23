"use client"
import useCoursesStore from "../stores/coursesStore";
import styles from "../styles/Mycourses.module.css";
import TotalProgress from "./TotalProgress";
import Link from "next/link";
import useAuthStore from "../stores/authStore";

const EnrolledCourses = ({ setSection }) => {
  const { enrolledCourses, courses, calculateProgress , getNextLesson } = useCoursesStore();
  const { user } = useAuthStore();

  const enrolledCoursesWithProgress = enrolledCourses.map(enrollment => {
    const course = courses.find(c => c.id == enrollment.course_id);
    return {
      ...course,
      progress: calculateProgress(enrollment.course_id),
      nextLesson: getNextLesson(enrollment.course_id) || "No lessons available",
      lastAccessed: new Date(enrollment.last_activity_date).toLocaleDateString()
    };
  }).filter(course => course.id); // Filter out undefined courses

  return (
    <div className={styles.bigContainer}>
      <TotalProgress />
      <div className={styles.coursesContainer}>
        {enrolledCoursesWithProgress.length > 0 ? (
          <div className={styles.coursesGrid}>
            {enrolledCoursesWithProgress.map((course) => (
              <div key={course.id} className={styles.courseCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.courseTitle}>{course.title}</h3>
                  <span className={`${styles.badge} ${styles[course.level.toLowerCase()]}`}>
                    {course.level}
                  </span>
                </div>
                <p className={styles.courseDescription}>{course.description}</p>
                
                <div className={styles.progressContainer}>
                  <div className={styles.progressLabels}>
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill} 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className={styles.courseMeta}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaIcon}>📖</span>
                    <span>Next: {course.nextLesson}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaIcon}>⏱️</span>
                    <span>Last accessed: {course.lastAccessed}</span>
                  </div>
                </div>

                <Link href={`/course/${course.id}`} className={styles.continueButton}>
                  Continue Learning
                </Link>
              </div>
            ))}

            <div className={`${styles.courseCard} ${styles.discoverCard}`}>
              <div className={styles.discoverContent}>
                <span className={styles.discoverIcon}>📚</span>
                <h3 className={styles.discoverTitle}>Discover New Courses</h3>
                <p className={styles.discoverText}>
                  Explore our catalog and find your next learning opportunity
                </p>
                <button onClick={() => setSection("home")} className={styles.browseButton}>
                  Browse Courses
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📚</span>
            <h3>No Enrolled Courses</h3>
            <p>You haven't enrolled in any courses yet.</p>
            <button onClick={() => setSection("home")} className={styles.browseButton}>
              Browse Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrolledCourses;