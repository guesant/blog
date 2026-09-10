namespace Portfolio.Blazor.Data.Entities;

public sealed class ResumeLanguage
{
    public int Id { get; set; }
    public int ResumeId { get; set; }
    public int LanguageId { get; set; }
    public string? Proficiency { get; set; }
    public int? Order { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public Resume? Resume { get; set; }
    public Language? Language { get; set; }
}
