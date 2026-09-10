namespace Portfolio.Blazor.Data.Entities;

public sealed class SnippetFile
{
    public int Id { get; set; }
    public int SnippetId { get; set; }
    public string Path { get; set; } = string.Empty;
    public string? Language { get; set; }
    public string Content { get; set; } = string.Empty;
    public int Order { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public Snippet? Snippet { get; set; }
}
