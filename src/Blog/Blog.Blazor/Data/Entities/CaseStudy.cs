namespace Blog.Blazor.Data.Entities;

public sealed class CaseStudy
{
    public int Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string PublicId { get; set; } = string.Empty;
    public bool Hidden { get; set; }
    public int Order { get; set; }
    public string? Href { get; set; }
    public bool External { get; set; }
    public string? Visual { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool Nda { get; set; }
    public DateOnly? PublishedAt { get; set; }
    public bool ShowHistory { get; set; }

    public List<CaseStudyTranslation> Translations { get; set; } = [];
    public List<CaseStudyTechnology> CaseStudyTechnologies { get; set; } = [];
}
