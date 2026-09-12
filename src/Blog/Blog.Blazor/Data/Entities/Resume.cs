namespace Blog.Blazor.Data.Entities;

public sealed class Resume
{
    public int Id { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public List<ResumeTranslation> Translations { get; set; } = [];
    public List<ResumeSkill> Skills { get; set; } = [];
    public List<ResumeLanguage> Languages { get; set; } = [];
    public List<ResumeSelectedCase> SelectedCases { get; set; } = [];
}
