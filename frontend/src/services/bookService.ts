import axios from "axios";
import type { Book, CreateBookDto, UpdateBookDto } from "../types/Book";

// Base URL for the API backend port
const API_BASE_URL = "http://localhost:5238/api/books";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Service for interacting with the Books API
export const bookService = {
  // Get all books from the API

  getAllBooks: async (): Promise<Book[]> => {
    try {
      const response = await api.get<Book[]>("");
      return response.data;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  },

  // Get a single book by ID
  getBookById: async (id: number): Promise<Book> => {
    try {
      const response = await api.get<Book>(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching book with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new book
  createBook: async (book: CreateBookDto): Promise<Book> => {
    try {
      const response = await api.post<Book>("", book);
      return response.data;
    } catch (error) {
      console.error("Error creating book:", error);
      throw error;
    }
  },

  // Update an existing book
  updateBook: async (id: number, book: UpdateBookDto): Promise<Book> => {
    try {
      const response = await api.put<Book>(`/${id}`, book);
      return response.data;
    } catch (error) {
      console.error(`Error updating book with ID ${id}:`, error);
      throw error;
    }
  },

  //Delete a book
  deleteBook: async (id: number): Promise<void> => {
    try {
      await api.delete(`/${id}`);
    } catch (error) {
      console.error(`Error deleting book with ID ${id}:`, error);
      throw error;
    }
  },
};
