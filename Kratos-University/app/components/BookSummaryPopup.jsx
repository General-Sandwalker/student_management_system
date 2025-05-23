"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import styles from "../styles/BookSummaryPopup.module.css"

const BookSummaryPopup = ({ bookId, onClose }) => {
  const [summary, setSummary] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBookSummary = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await axios.get(`http://localhost:8000/summary/${bookId}`)
        setSummary(response.data.summary_text)
      } catch (err) {
        console.error("Error fetching book summary:", err)
        setError(err.response?.data?.detail || "Failed to load book summary")
      } finally {
        setIsLoading(false)
      }
    }

    if (bookId) {
      fetchBookSummary()
    }
  }, [bookId])

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContainer}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        
        <h2 className={styles.popupTitle}>Book Summary ✨</h2>
        
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Generating fun summary...</p>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>⚠️ {error}</p>
            <button 
              className={styles.retryButton}
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className={styles.summaryContent}>
            <div 
              className={styles.summaryText}
              dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br />') }}
            />
            <div className={styles.summaryFooter}>
              <p className={styles.funNote}>This AI-generated summary is designed to be fun and engaging!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookSummaryPopup;