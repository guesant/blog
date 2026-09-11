namespace Portfolio.Blazor.Data.Entities;

public sealed class TechnologyTranslation
{
    public int Id { get; set; }
    public int TechnologyId { get; set; }
    public string Locale { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public Technology? Technology { get; set; }
}
