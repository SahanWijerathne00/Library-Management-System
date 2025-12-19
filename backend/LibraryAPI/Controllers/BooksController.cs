using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryAPI.Data;
using LibraryAPI.Models;
using LibraryAPI.DTOs;

namespace LibraryAPI.Controllers
{
    /// <summary>
    /// API Controller for managing book operations (CRUD)
    /// Base route: /api/books
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly LibraryDbContext _context;
        private readonly ILogger<BooksController> _logger;

        // Constructor - injects database context and logger
        public BooksController(LibraryDbContext context, ILogger<BooksController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// GET: api/books
        /// Retrieves all books from the database
        /// </summary>
        /// <returns>List of all books</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<BookResponseDto>>> GetBooks()
        {
            try
            {
                _logger.LogInformation("Fetching all books from database");

                // Retrieve all books and map to DTOs
                var books = await _context.Books
                    .Select(b => new BookResponseDto
                    {
                        Id = b.Id,
                        Title = b.Title,
                        Author = b.Author,
                        Description = b.Description,
                        CreatedAt = b.CreatedAt,
                        UpdatedAt = b.UpdatedAt
                    })
                    .ToListAsync();

                _logger.LogInformation($"Successfully retrieved {books.Count} books");
                return Ok(books);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching books");
                return StatusCode(500, new { message = "An error occurred while retrieving books", error = ex.Message });
            }
        }

        /// <summary>
        /// GET: api/books/5
        /// Retrieves a specific book by ID
        /// </summary>
        /// <param name="id">Book ID</param>
        /// <returns>Book details</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<BookResponseDto>> GetBook(int id)
        {
            try
            {
                _logger.LogInformation($"Fetching book with ID: {id}");

                // Find book by ID
                var book = await _context.Books.FindAsync(id);

                // Return 404 if book not found
                if (book == null)
                {
                    _logger.LogWarning($"Book with ID {id} not found");
                    return NotFound(new { message = $"Book with ID {id} not found" });
                }

                // Map to DTO and return
                var bookDto = new BookResponseDto
                {
                    Id = book.Id,
                    Title = book.Title,
                    Author = book.Author,
                    Description = book.Description,
                    CreatedAt = book.CreatedAt,
                    UpdatedAt = book.UpdatedAt
                };

                _logger.LogInformation($"Successfully retrieved book: {book.Title}");
                return Ok(bookDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while fetching book with ID: {id}");
                return StatusCode(500, new { message = "An error occurred while retrieving the book", error = ex.Message });
            }
        }

        /// <summary>
        /// POST: api/books
        /// Creates a new book record
        /// </summary>
        /// <param name="createBookDto">Book data to create</param>
        /// <returns>Created book details</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<BookResponseDto>> CreateBook([FromBody] CreateBookDto createBookDto)
        {
            try
            {
                // Validate model state
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Invalid model state for CreateBook request");
                    return BadRequest(ModelState);
                }

                _logger.LogInformation($"Creating new book: {createBookDto.Title}");

                // Create new Book entity from DTO
                var book = new Book
                {
                    Title = createBookDto.Title,
                    Author = createBookDto.Author,
                    Description = createBookDto.Description,
                    CreatedAt = DateTime.UtcNow
                };

                // Add to database and save changes
                _context.Books.Add(book);
                await _context.SaveChangesAsync();

                // Map to response DTO
                var bookResponseDto = new BookResponseDto
                {
                    Id = book.Id,
                    Title = book.Title,
                    Author = book.Author,
                    Description = book.Description,
                    CreatedAt = book.CreatedAt,
                    UpdatedAt = book.UpdatedAt
                };

                _logger.LogInformation($"Successfully created book with ID: {book.Id}");

                // Return 201 Created with location header
                return CreatedAtAction(nameof(GetBook), new { id = book.Id }, bookResponseDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating book");
                return StatusCode(500, new { message = "An error occurred while creating the book", error = ex.Message });
            }
        }

        /// <summary>
        /// PUT: api/books/5
        /// Updates an existing book record
        /// </summary>
        /// <param name="id">Book ID to update</param>
        /// <param name="updateBookDto">Updated book data</param>
        /// <returns>Updated book details</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<BookResponseDto>> UpdateBook(int id, [FromBody] UpdateBookDto updateBookDto)
        {
            try
            {
                // Validate model state
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning($"Invalid model state for UpdateBook request (ID: {id})");
                    return BadRequest(ModelState);
                }

                _logger.LogInformation($"Updating book with ID: {id}");

                // Find existing book
                var book = await _context.Books.FindAsync(id);

                // Return 404 if book not found
                if (book == null)
                {
                    _logger.LogWarning($"Book with ID {id} not found for update");
                    return NotFound(new { message = $"Book with ID {id} not found" });
                }

                // Update book properties
                book.Title = updateBookDto.Title;
                book.Author = updateBookDto.Author;
                book.Description = updateBookDto.Description;
                book.UpdatedAt = DateTime.UtcNow;

                // Save changes to database
                await _context.SaveChangesAsync();

                // Map to response DTO
                var bookResponseDto = new BookResponseDto
                {
                    Id = book.Id,
                    Title = book.Title,
                    Author = book.Author,
                    Description = book.Description,
                    CreatedAt = book.CreatedAt,
                    UpdatedAt = book.UpdatedAt
                };

                _logger.LogInformation($"Successfully updated book with ID: {id}");
                return Ok(bookResponseDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while updating book with ID: {id}");
                return StatusCode(500, new { message = "An error occurred while updating the book", error = ex.Message });
            }
        }

        /// <summary>
        /// DELETE: api/books/5
        /// Deletes a book record
        /// </summary>
        /// <param name="id">Book ID to delete</param>
        /// <returns>Success message</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteBook(int id)
        {
            try
            {
                _logger.LogInformation($"Deleting book with ID: {id}");

                // Find book to delete
                var book = await _context.Books.FindAsync(id);

                // Return 404 if book not found
                if (book == null)
                {
                    _logger.LogWarning($"Book with ID {id} not found for deletion");
                    return NotFound(new { message = $"Book with ID {id} not found" });
                }

                // Remove book from database
                _context.Books.Remove(book);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Successfully deleted book with ID: {id}");
                return Ok(new { message = $"Book '{book.Title}' has been successfully deleted", id = id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while deleting book with ID: {id}");
                return StatusCode(500, new { message = "An error occurred while deleting the book", error = ex.Message });
            }
        }
    }
}