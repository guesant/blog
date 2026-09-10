namespace Portfolio.Blazor.Data.Entities;

public sealed class SnippetTranslation
{
    public int Id { get; set; }
    public int SnippetId { get; set; }
    public string Locale { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public Snippet? Snippet { get; set; }
}
