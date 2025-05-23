"use client"
import { useEffect, useState } from 'react';
import useCoursesStore from '../../stores/coursesStore';
import styles from '../../styles/CourseDetail.module.css';
import { useParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import useAuthStore from '../../stores/authStore';

const CoursePage = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { 
    courses, 
    enrolledCourses, 
    enrollInCourse, 
    updateEnrollmentProgress,
    calculateProgress,
    fetchEnrolledCourses,
    fetchCourses
  } = useCoursesStore();
  const { user } = useAuthStore();
  
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeModule, setActiveModule] = useState(null);
  const [activeLesson, setActiveLesson] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (courses.length === 0) {
          console.log("Fetching courses...");
          await fetchCourses();
        }
        if (user?.user_id && enrolledCourses.length === 0) {
          console.log("Fetching enrolled courses...");
          await fetchEnrolledCourses(user.user_id);
        }
        const foundCourse = courses.find(c => c.id == id);
        console.log(courses);
        
        if (!foundCourse) {
          console.error(`Course with ID ${id} not found`);
          setIsLoading(false);
          return;
        }
        setCourse(foundCourse);
        const enrolled = enrolledCourses.some(c => c.course_id == id);
        setIsEnrolled(enrolled);
        if (foundCourse.modules?.length > 0 && !activeModule) {
          setActiveModule(foundCourse.modules[0]);
        }
        const savedProgress = calculateProgress(id);
        setProgress(savedProgress);
      } catch (error) {
        console.error("Error loading course data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id, courses, enrolledCourses, user?.user_id]);

  const handleEnroll = async () => {
    if (!user?.user_id) {
      router.push('/login');
      return;
    }
    
    try {
      setIsLoading(true);
      await enrollInCourse(id, user.user_id);
      await fetchEnrolledCourses(user.user_id);
      setIsEnrolled(true);
    } catch (error) {
      console.error("Error enrolling in course:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLessonComplete = async (lessonId) => {
    if (!user?.user_id) return;
    
    try {
      setIsLoading(true);
      if (lessonId === activeLesson) {
        setActiveLesson("");
        return;
      }
      
      setActiveLesson(lessonId);
      await updateEnrollmentProgress(id, user.user_id, lessonId);
      
      // Recalculate progress after update
      const newProgress = calculateProgress(id);
      setProgress(newProgress);
    } catch (error) {
      console.error("Error updating lesson progress:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading course...</div>;
  }

  if (!course) {
    return (
      <div className={styles.courseContainer}>
        <Link href="/home">
          <button className={styles.goBackbtn}>← Go Back</button>
        </Link>
        <div className={styles.errorMessage}>
          <h2>Course not found</h2>
          <p>The requested course could not be loaded.</p>
          <button onClick={() => router.push('/home')} className={styles.enrollButton}>
            Browse Available Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.courseContainer}>
      <Link href="/home">
        <button className={styles.goBackbtn}>← Go Back</button>
      </Link>
      
      <div className={styles.courseHeader}>
        <div className={styles.courseMeta}>
          <span className={`${styles.levelBadge} ${styles[course.level.toLowerCase()]}`}>
            {course.level}
          </span>
          <span className={styles.duration}>{course.duration}</span>
        </div>
        <h1 className={styles.courseTitle}>{course.title}</h1>
        <p className={styles.courseDescription}>{course.description}</p>
        
        {!isEnrolled ? (
          <button 
            onClick={handleEnroll} 
            className={styles.enrollButton}
            disabled={isLoading}
          >
            {isLoading ? 'Enrolling...' : 'Enroll in Course'}
          </button>
        ) : (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className={styles.progressText}>{progress}% Complete</span>
          </div>
        )}
      </div>

      {isEnrolled && (
        <div className={styles.courseContent}>
          <div className={styles.modulesSidebar}>
            <h3>Modules</h3>
            <ul className={styles.moduleList}>
              {course.modules?.map(module => (
                <li 
                  key={module.id}
                  className={`${styles.moduleItem} ${activeModule?.id === module.id ? styles.active : ''}`}
                  onClick={() => {
                    setActiveModule(module);
                    setActiveLesson("");
                  }}
                >
                  {module.title}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.lessonsContainer}>
            {activeModule && (
              <>
                <h2 className={styles.moduleTitle}>{activeModule.title}</h2>
                <ul className={styles.lessonList}>
                  {activeModule.lessons?.map(lesson => (
                    <li key={lesson.id} className={styles.lessonItem}>
                      <div className={styles.lessonContent}>
                        <h3>{lesson.title}</h3>
                        <button 
                          onClick={() => handleLessonComplete(lesson.id)}
                          className={styles.completeButton}
                          aria-label={activeLesson === lesson.id ? "Collapse lesson" : "Expand lesson"}
                          disabled={isLoading}
                        >
                          {activeLesson === lesson.id ? "↑" : "↓"}
                        </button>
                      </div>
                      {activeLesson === lesson.id && (
                        <div className={styles.lessonDetails}>
                          <ReactMarkdown>{lesson.content || "No content available for this lesson."}</ReactMarkdown>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePage;