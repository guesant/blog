namespace Blog.Blazor.Data.Entities;

public sealed class SiteSettings
{
    public int Id { get; set; }
    public string? ShortName { get; set; }
    public string? PortfolioUrl { get; set; }
    public bool MaintenanceEnabled { get; set; }
    public string? ContactEmail { get; set; }
    public bool ContactAvailable { get; set; }
    public string? SourceRepositoryUrl { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public List<SiteSettingsTranslation> Translations { get; set; } = [];
    public List<ContactProfile> ContactProfiles { get; set; } = [];
}
