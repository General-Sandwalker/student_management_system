// stores/booksStore.js
import { create } from "zustand";
import axios from "axios";

const useBooksStore = create((set, get) => ({
  books: [],
  favoriteBooks: [],
  isLoading: false,
  error: null,

  fetchBooks: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.price_min) params.append('price_min', filters.price_min);
      if (filters.price_max) params.append('price_max', filters.price_max);
      if (filters.availability && filters.availability !== 'all') {
        params.append('availability', filters.availability);
      }

      const response = await axios.get(`http://127.0.0.1:8000/recommendations?${params.toString()}`);
      set({ books: response.data.books, isLoading: false });
    } catch (error) {
      console.error("Error fetching books:", error);
      set({ error: "Failed to load books", isLoading: false });
    }
  },

  scrapeBooks: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.post('http://127.0.0.1:8000/recommendations/scrape');
      console.log("Books scraped:", response.data);
      await get().fetchBooks();
      set({ isLoading: false });
    } catch (error) {
      console.error("Error scraping books:", error);
      set({ error: "Failed to scrape books", isLoading: false });
    }
  },

  isFavorite: (book_id) => {
    return get().favoriteBooks.some(id => id == book_id);
  },

  clearError: () => set({ error: null })
}));

export default useBooksStore;