using Blog.Blazor.Data;

namespace Blog.Blazor.Data.Entities;

public sealed class CaseStudyTranslation
{
    public int Id { get; set; }
    public int CaseStudyId { get; set; }
    public string Locale { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Status { get; set; }
    public string? Meta { get; set; }
    public string? Summary { get; set; }
    public string? Context { get; set; }
    public string? Role { get; set; }
    public string? Result { get; set; }

    [JsonOrEmpty]
    public string? Metrics { get; set; }

    public string? Body { get; set; }

    [JsonOrEmpty]
    public string? Seo { get; set; }

    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public CaseStudy? CaseStudy { get; set; }
}
