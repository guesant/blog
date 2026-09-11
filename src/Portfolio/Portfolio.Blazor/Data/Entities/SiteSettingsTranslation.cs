using Portfolio.Blazor.Data;

namespace Portfolio.Blazor.Data.Entities;

public sealed class SiteSettingsTranslation
{
    public int Id { get; set; }
    public int SiteSettingsId { get; set; }
    public string Locale { get; set; } = string.Empty;
    public string? CopyrightTemplate { get; set; }
    public string? MaintenanceEyebrow { get; set; }
    public string? MaintenanceTitle { get; set; }
    public string? MaintenanceDescription { get; set; }

    [JsonOrEmpty]
    public string? Seo { get; set; }

    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public SiteSettings? SiteSettings { get; set; }
}
