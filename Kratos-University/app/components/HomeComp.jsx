"use client"
import { useEffect, useState } from "react"
import styles from "../styles/HomeContent.module.css"
import useCoursesStore from "../stores/coursesStore"
import useAuthStore from "../stores/authStore"

const HomeComp = () => {
  const { courses, fetchCourses, enrollInCourse, isEnrolled, fetchEnrolledCourses,isFavorite,fetchFavoriteCourses,addToFavorites,removeFromFavorites } = useCoursesStore();
  const { user } = useAuthStore();
  const [renderCourses, setRenderCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    fetchCourses();
    if (user?.user_id) {
      fetchEnrolledCourses(user.user_id);
      fetchFavoriteCourses(user.user_id);
    }
  }, [user?.user_id]);
  
  useEffect(() => {
    if (!searchTerm) {
      setRenderCourses([...courses]);
      return;
    }
    
    const filteredCourses = courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setRenderCourses(filteredCourses);
  }, [searchTerm, courses]);

  const handleEnroll = (courseId) => {
    if (user?.user_id) {
      enrollInCourse(courseId, user.user_id);
    }
  }

  const handleFav = (courseId) => {
    if (user?.user_id) {
      console.log(courseId);
      addToFavorites(courseId, user.user_id);
    }
  }

  const handleUnFav = (courseId) => {
    if (user?.user_id) {
      console.log(courseId, user.user_id);
      removeFromFavorites(courseId, user.user_id);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Courses</h1>
          <p className={styles.subtitle}>Browse all available courses</p>
        </div>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <svg className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>

      {renderCourses.length === 0 ? (
        <h1 className={styles.noCoursesMessage}>Nothing Is Here</h1>
      ) : (
        <div className={styles.coursesGrid}>
          {renderCourses.map((course) => (
            <div key={course.id} className={styles.courseCard}>
              {isFavorite(course.id) ? (<span className={styles.unfav} onClick={()=>handleUnFav(course.id)}>★</span>) : (<span className={styles.fav} onClick={()=>handleFav(course.id)}>☆</span>)}
              <div className={styles.courseContent}>
                <div className={styles.courseHeader}>
                  <h3 className={styles.courseTitle}>{course.title}</h3>
                  <span className={`${styles.levelBadge} ${styles[course.level.toLowerCase()]}`}>
                    {course.level}
                  </span>
                </div>
                <p className={styles.courseDescription}>{course.description}</p>
                <div className={styles.courseDetails}>
                  <span className={styles.courseDuration}>Duration: {course.duration}</span>
                </div>
                {!isEnrolled(course.id) ? 
                (<button 
                  className={styles.enrollButton} 
                  onClick={() => handleEnroll(course.id)}
                  disabled={!user?.user_id}
                >
                  <svg className={styles.enrollIcon} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7h20L12 2z"></path>
                    <path d="M2 17l10 5 10-5V7H2v10z"></path>
                    <path d="M12 12l4 4-4-4z"></path>
                  </svg>
                  Enroll
                </button>) :
                (<button className={styles.enrollButton} disabled>
                  Already Enrolled
                </button>)
                }
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HomeComp;