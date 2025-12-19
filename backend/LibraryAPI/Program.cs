using Microsoft.EntityFrameworkCore;
using LibraryAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Configure SQLite database with Entity Framework
builder.Services.AddDbContext<LibraryDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add controllers
builder.Services.AddControllers();

// Configure CORS to allow frontend to communicate with backend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "http://localhost:5173") 
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Enable CORS
app.UseCors("AllowReactApp");

app.UseHttpsRedirection();

app.UseAuthorization();

// Add a root endpoint to show the API is running
app.MapGet("/", () => new
{
    message = "✅ Library Management API is running successfully!",
   
});

// Map controller routes
app.MapControllers();

// Create database and apply migrations on startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<LibraryDbContext>();
        // This will create the database if it doesn't exist and apply any pending migrations
        context.Database.EnsureCreated();
        Console.WriteLine("✅ Database created successfully!");
        Console.WriteLine("✅ API is ready!");
        Console.WriteLine($"📚 Test the API at: http://localhost:5238/api/books");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ An error occurred while creating the database: {ex.Message}");
    }
}

app.Run();