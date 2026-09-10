using Portfolio.Blazor.Data;

namespace Portfolio.Blazor.Data.Entities;

public sealed class WritingTranslation
{
    public int Id { get; set; }
    public int WritingId { get; set; }
    public string Locale { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Excerpt { get; set; }
    public string? ReadingTime { get; set; }
    public string? Body { get; set; }

    [JsonOrEmpty]
    public string? Seo { get; set; }

    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public Writing? Writing { get; set; }
}
