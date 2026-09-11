using System.ComponentModel.DataAnnotations;

namespace Portfolio.Blazor.Data.Entities;

public sealed class ResourceLink
{
    public int Id { get; set; }
    public int ResourceId { get; set; }

    [Required(ErrorMessage = "URL is required.")]
    public string Url { get; set; } = string.Empty;
    public string? Label { get; set; }
    public string? Platform { get; set; }
    public string? Purpose { get; set; }
    public bool IsPrimary { get; set; }
    public bool IsFree { get; set; }
    public int? LanguageId { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public Resource? Resource { get; set; }
    public Language? Language { get; set; }
}
