using Blog.Blazor.Data;

namespace Blog.Blazor.Data.Entities;

public sealed class ResourceTranslation
{
    public int Id { get; set; }
    public int ResourceId { get; set; }
    public string Locale { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? AlternativeTitle { get; set; }
    public string? Description { get; set; }
    public string? PersonalNote { get; set; }
    public string? ReasonFound { get; set; }

    [JsonOrEmpty]
    public string? Seo { get; set; }

    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public Resource? Resource { get; set; }
}
