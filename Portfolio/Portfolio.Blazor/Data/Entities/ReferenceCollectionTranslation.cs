using Portfolio.Blazor.Data;

namespace Portfolio.Blazor.Data.Entities;

public sealed class ReferenceCollectionTranslation
{
    public int Id { get; set; }
    public int ReferenceCollectionId { get; set; }
    public string Locale { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Intro { get; set; }

    [JsonOrEmpty]
    public string? Seo { get; set; }

    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public ReferenceCollection? ReferenceCollection { get; set; }
}
