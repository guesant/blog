namespace Portfolio.Blazor.Data.Entities;

public sealed class LanguageTranslation
{
    public int Id { get; set; }
    public int LanguageId { get; set; }
    public string Locale { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public Language? Language { get; set; }
}
