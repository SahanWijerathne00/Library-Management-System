import { useState, useEffect } from "react";
import type { Book, CreateBookDto, UpdateBookDto } from "./types/Book";
import { bookService } from "./services/bookService";
import BookList from "./components/BookList";
import BookForm from "./components/BookForm";
import { FaBook, FaPlus } from "react-icons/fa";
import "./App.css";

// Main App Component - Library Management System

function App() {
  // State management
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Fetch all books on component mount

  useEffect(() => {
    fetchBooks();
  }, []);

  // Fetch all books from API

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await bookService.getAllBooks();
      setBooks(data);
    } catch (err) {
      setError(
        "Failed to load books. Please make sure the backend is running."
      );
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  //Handle creating a new book
  const handleCreateBook = async (bookData: CreateBookDto) => {
    try {
      setError("");
      const newBook = await bookService.createBook(bookData);
      setBooks([...books, newBook]);
      setShowForm(false);
      showSuccess("Book added successfully!");
    } catch (err) {
      setError("Failed to create book. Please try again.");
      console.error("Error creating book:", err);
    }
  };

  // Handle updating an existing book
  const handleUpdateBook = async (bookData: UpdateBookDto) => {
    if (!bookToEdit) return;

    try {
      setError("");
      const updatedBook = await bookService.updateBook(bookToEdit.id, bookData);
      setBooks(
        books.map((book) => (book.id === bookToEdit.id ? updatedBook : book))
      );
      setShowForm(false);
      setBookToEdit(null);
      showSuccess("Book updated successfully!");
    } catch (err) {
      setError("Failed to update book. Please try again.");
      console.error("Error updating book:", err);
    }
  };

  // Handle deleting a book
  const handleDeleteBook = async (id: number) => {
    // Confirm message
    const book = books.find((b) => b.id === id);
    if (!book) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${book.title}" by ${book.author}?`
    );

    if (!confirmDelete) return;

    try {
      setError("");
      await bookService.deleteBook(id);
      setBooks(books.filter((book) => book.id !== id));
      showSuccess("Book deleted successfully!");
    } catch (err) {
      setError("Failed to delete book. Please try again.");
      console.error("Error deleting book:", err);
    }
  };

  // Handle edit button click
  const handleEditClick = (book: Book) => {
    setBookToEdit(book);
    setShowForm(true);
    setError("");
  };

  //Handle add new book button click
  const handleAddClick = () => {
    setBookToEdit(null);
    setShowForm(true);
    setError("");
  };

  // Handle form cancel
  const handleFormCancel = () => {
    setShowForm(false);
    setBookToEdit(null);
    setError("");
  };

  // Handle form submit
  const handleFormSubmit = (bookData: CreateBookDto | UpdateBookDto) => {
    if (bookToEdit) {
      handleUpdateBook(bookData as UpdateBookDto);
    } else {
      handleCreateBook(bookData as CreateBookDto);
    }
  };

  // Show success message temporarily
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <FaBook size={40} />
            <h1>Library Management System</h1>
          </div>
          {!showForm && (
            <button className="btn-add" onClick={handleAddClick}>
              <FaPlus /> Add New Book
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}

        {/* Error Message */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Show Form or Book List */}
        {showForm ? (
          <BookForm
            bookToEdit={bookToEdit}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        ) : (
          <>
            <div className="book-count">
              <h2>{loading ? "Loading..." : `Total Books: ${books.length}`}</h2>
            </div>
            <BookList
              books={books}
              onEdit={handleEditClick}
              onDelete={handleDeleteBook}
              loading={loading}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>&copy; 2025 Library Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
