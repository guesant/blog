using Blog.Blazor.Data;

namespace Blog.Blazor.Data.Entities;

public sealed class ProjectTranslation
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public string Locale { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Purpose { get; set; } = string.Empty;
    public string? Problem { get; set; }
    public string? CurrentFocus { get; set; }
    public string? Status { get; set; }

    [JsonOrEmpty]
    public string? Metrics { get; set; }

    public string? Body { get; set; }

    [JsonOrEmpty]
    public string? Seo { get; set; }

    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public Project? Project { get; set; }
}
