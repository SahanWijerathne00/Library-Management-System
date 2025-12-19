import React, { useState, useEffect } from "react";
import type { Book, CreateBookDto, UpdateBookDto } from "../types/Book";
import { FaSave, FaTimes } from "react-icons/fa";

interface BookFormProps {
  bookToEdit?: Book | null;
  onSubmit: (book: CreateBookDto | UpdateBookDto) => void;
  onCancel: () => void;
}

// Form component for creating or editing books
const BookForm: React.FC<BookFormProps> = ({
  bookToEdit,
  onSubmit,
  onCancel,
}) => {
  // Form state
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Populate form when editing
  useEffect(() => {
    if (bookToEdit) {
      setTitle(bookToEdit.title);
      setAuthor(bookToEdit.author);
      setDescription(bookToEdit.description || "");
    }
  }, [bookToEdit]);

  // Validate form fields
  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length > 200) {
      newErrors.title = "Title cannot exceed 200 characters";
    }

    if (!author.trim()) {
      newErrors.author = "Author is required";
    } else if (author.length > 100) {
      newErrors.author = "Author cannot exceed 100 characters";
    }

    if (description.length > 1000) {
      newErrors.description = "Description cannot exceed 1000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate before submitting
    if (!validate()) {
      return;
    }

    // Create book object
    const bookData: CreateBookDto | UpdateBookDto = {
      title: title.trim(),
      author: author.trim(),
      description: description.trim() || undefined,
    };

    // Submit the form
    onSubmit(bookData);

    // Reset form if creating new book
    if (!bookToEdit) {
      setTitle("");
      setAuthor("");
      setDescription("");
      setErrors({});
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    setTitle("");
    setAuthor("");
    setDescription("");
    setErrors({});
    onCancel();
  };

  return (
    <div className="book-form-container">
      <h2>{bookToEdit ? "Edit Book" : "Add New Book"}</h2>
      <form onSubmit={handleSubmit} className="book-form">
        {/* Title Field */}
        <div className="form-group">
          <label htmlFor="title">
            Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={errors.title ? "error" : ""}
            placeholder="Enter book title"
            maxLength={200}
          />
          {errors.title && (
            <span className="error-message">{errors.title}</span>
          )}
        </div>

        {/* Author Field */}
        <div className="form-group">
          <label htmlFor="author">
            Author <span className="required">*</span>
          </label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className={errors.author ? "error" : ""}
            placeholder="Enter author name"
            maxLength={100}
          />
          {errors.author && (
            <span className="error-message">{errors.author}</span>
          )}
        </div>

        {/* Description Field */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={errors.description ? "error" : ""}
            placeholder="Enter book description (optional)"
            rows={4}
            maxLength={1000}
          />
          {errors.description && (
            <span className="error-message">{errors.description}</span>
          )}
          <small className="char-count">
            {description.length}/1000 characters
          </small>
        </div>

        {/* Form Buttons */}
        <div className="form-buttons">
          <button type="submit" className="btn-primary">
            <FaSave /> {bookToEdit ? "Update Book" : "Add Book"}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleCancel}
          >
            <FaTimes /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;
