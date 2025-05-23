"use client"
import { useEffect, useState } from "react"
import styles from "../styles/BookRecommendations.module.css"
import  useBooksStore from "../stores/bookStore"
import BookSummaryPopup from "./BookSummaryPopup"

const BookRecommendations = () => {

const { books, fetchBooks, scrapeBooks } = useBooksStore(); 
  const [renderBooks, setRenderBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: '',
    price_min: '',
    price_max: '',
    availability: 'all'
  });
  
  useEffect(() => {
    if (!searchTerm) {
      setRenderBooks([...books]);
      return;
    }
    
    const filteredBooks = books.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setRenderBooks(filteredBooks);
  }, [searchTerm, books]);

  useEffect(() => {
    fetchBooks(filters);
    }, [filters]);

  const handleScrape = () => {
    scrapeBooks();
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  }

  return (
    <>
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Book Recommendations</h1>
          <p className={styles.subtitle}>Browse all available books</p>
        </div>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search books..."
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

      <div className={styles.filterContainer}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Category</label>
          <input
            type="text"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className={styles.filterInput}
            placeholder="e.g., Fiction, Science"
          />
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Min Price</label>
          <input
            type="number"
            name="price_min"
            value={filters.price_min}
            onChange={handleFilterChange}
            className={styles.filterInput}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Max Price</label>
          <input
            type="number"
            name="price_max"
            value={filters.price_max}
            onChange={handleFilterChange}
            className={styles.filterInput}
            placeholder="100.00"
            min="0"
            step="0.01"
          />
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Availability</label>
          <select
            name="availability"
            value={filters.availability}
            onChange={handleFilterChange}
            className={styles.filterInput}
          >
            <option value="all">All</option>
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Preorder">Preorder</option>
          </select>
        </div>
        <button 
          className={styles.scrapeButton}
          onClick={handleScrape}
        >
          Scrape New Books
        </button>
      </div>

      {renderBooks.length === 0 ? (
        <h1 className={styles.noBooksMessage}>No books found</h1>
      ) : (
        <div className={styles.booksGrid}>
          {renderBooks.map((book) => (
            <div key={book.id} className={styles.bookCard}>
              {book.img_url && (
                <div className={styles.bookImageContainer}>
                  <img 
                    src={book.img_url} 
                    alt={book.title}
                    className={styles.bookImage}
                    onError={(e) => {
                      e.target.src = '/placeholder-book.jpg';
                    }}
                  />
                </div>
              )}
              
              <div className={styles.bookContent}>
                <div className={styles.bookHeader}>
                  <h3 className={styles.bookTitle}>{book.title}</h3>
                  <span className={`${styles.availabilityBadge} ${
                    book.availability === 'In Stock' ? styles.inStock :
                    book.availability === 'Out of Stock' ? styles.outOfStock :
                    styles.preorder
                  }`}>
                    {book.availability}
                  </span>
                </div>
                <p className={styles.bookCategory}>{book.category}</p>
                <div className={styles.bookDetails}>
                  <span className={styles.bookPrice}>${book.price.toFixed(2)}</span>
                  <span className={styles.bookDate}>
                    Added: {new Date(book.created_at).toLocaleDateString()}
                  </span>
                </div>
                <button className={styles.viewButton} onClick={() => setSelectedBookId(book.id)}>
                  Summarize Book
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    {selectedBookId && (
      <BookSummaryPopup
        bookId={selectedBookId}
        onClose={() => setSelectedBookId(null)}
      />
    )}
    </>
  )
}

export default BookRecommendations;