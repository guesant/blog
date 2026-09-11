using System.ComponentModel.DataAnnotations;

namespace Portfolio.Blazor.Data.Entities;

public sealed class ContactProfile
{
    public int Id { get; set; }
    public int SiteSettingsId { get; set; }

    [Required(ErrorMessage = "Platform is required.")]
    public string Platform { get; set; } = string.Empty;
    public string? Label { get; set; }

    [Required(ErrorMessage = "URL is required.")]
    public string Url { get; set; } = string.Empty;
    public int? Order { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public SiteSettings? SiteSettings { get; set; }
}
