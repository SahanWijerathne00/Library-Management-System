import React from "react";
import type { Book } from "../types/Book";
import { FaEdit, FaTrash, FaBook } from "react-icons/fa";

interface BookListProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

/**
 * Component to display a list of books
 */
const BookList: React.FC<BookListProps> = ({
  books,
  onEdit,
  onDelete,
  loading,
}) => {
  // Show loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading books...</p>
      </div>
    );
  }

  // Show message if no books exist
  if (books.length === 0) {
    return (
      <div className="no-books">
        <FaBook size={50} />
        <h3>No books in the library</h3>
        <p>Add your first book to get started!</p>
      </div>
    );
  }

  return (
    <div className="book-list">
      {books.map((book) => (
        <div key={book.id} className="book-card">
          <div className="book-header">
            <h3>{book.title}</h3>
            <div className="book-actions">
              <button
                className="btn-edit"
                onClick={() => onEdit(book)}
                title="Edit book"
              >
                <FaEdit />
              </button>
              <button
                className="btn-delete"
                onClick={() => onDelete(book.id)}
                title="Delete book"
              >
                <FaTrash />
              </button>
            </div>
          </div>

          <div className="book-body">
            <p className="book-author">
              <strong>Author:</strong> {book.author}
            </p>
            {book.description && (
              <p className="book-description">{book.description}</p>
            )}
          </div>

          <div className="book-footer">
            <small>
              Added: {new Date(book.createdAt).toLocaleDateString()}
            </small>
            {book.updatedAt && (
              <small>
                Updated: {new Date(book.updatedAt).toLocaleDateString()}
              </small>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookList;
