"use client"
import { useEffect, useState } from "react"
import styles from "../styles/HomeContent.module.css"
import useCoursesStore from "../stores/coursesStore"
import useAuthStore from "../stores/authStore"
import { useRouter } from "next/navigation"

const FavoritesComp = ({setSection}) => {

    const router = useRouter();
  const { 
    courses, 
    fetchCourses, 
    favoriteCourses, 
    fetchFavoriteCourses, 
    removeFromFavorites,
    isFavorite 
  } = useCoursesStore();
  
  const { user } = useAuthStore();
  const [favoriteCoursesList, setFavoriteCoursesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    fetchCourses();
    if (user?.user_id) {
      fetchFavoriteCourses(user.user_id);
    }
  }, [user?.user_id]);
  
  useEffect(() => {
    if (!courses.length) return;
    
    const favorites = courses.filter(course => 
      isFavorite(course.id) && 
      (course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       course.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFavoriteCoursesList(favorites);
  }, [searchTerm, courses, favoriteCourses]);

  const handleUnFav = (courseId) => {
    if (user?.user_id) {
      removeFromFavorites(courseId, user.user_id);
    }
  }


    const handleGotoCourse = (id) => {
    setSection("");
    router.push(`/course/${id}`);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Favorite Courses</h1>
          <p className={styles.subtitle}>Your personal collection</p>
        </div>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search favorites..."
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

      {favoriteCoursesList.length === 0 ? (
        <h1 className={styles.noCoursesMessage}>No favorite courses yet</h1>
      ) : (
        <div className={styles.coursesGrid}>
          {favoriteCoursesList.map((course) => (
            <div key={course.id} className={styles.courseCard} onClick={() => handleGotoCourse(course.id)}>
              <span className={styles.unfav} onClick={() => handleUnFav(course.id)}>★</span>
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FavoritesComp;