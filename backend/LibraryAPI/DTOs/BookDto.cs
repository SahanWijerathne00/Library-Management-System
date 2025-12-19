using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.DTOs
{
    // Data Transfer Objects (DTOs) for Book entity
    // DTO for creating a new book - used in POST requests
    public class CreateBookDto
    {
        [Required(ErrorMessage = "Title is required")]
        [StringLength(200, MinimumLength = 1, ErrorMessage = "Title must be between 1 and 200 characters")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Author is required")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Author must be between 1 and 100 characters")]
        public string Author { get; set; } = string.Empty;

        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string? Description { get; set; }
    }

    // DTO for updating an existing book - used in PUT requests
    public class UpdateBookDto
    {
        [Required(ErrorMessage = "Title is required")]
        [StringLength(200, MinimumLength = 1, ErrorMessage = "Title must be between 1 and 200 characters")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Author is required")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Author must be between 1 and 100 characters")]
        public string Author { get; set; } = string.Empty;

        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string? Description { get; set; }
    }


    // DTO for returning book data - used in responses
    public class BookResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}