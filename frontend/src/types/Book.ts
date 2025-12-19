// Book interface - matches the backend DTO
export interface Book {
  id: number;
  title: string;
  author: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

// DTO for creating a new book (no id needed)
export interface CreateBookDto {
  title: string;
  author: string;
  description?: string;
}

// DTO for updating a book
export interface UpdateBookDto {
  title: string;
  author: string;
  description?: string;
}
