using System.ComponentModel.DataAnnotations;

namespace Portfolio.Blazor.Data.Entities;

public sealed class CreditEntry
{
    public int Id { get; set; }
    public string? Url { get; set; }

    [Required(ErrorMessage = "Category is required.")]
    public string Category { get; set; } = string.Empty;
    public int Order { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsAutomatic { get; set; }
    public bool Active { get; set; }
    public string? PackageManager { get; set; }
    public string? PackageName { get; set; }

    public List<CreditEntryTranslation> Translations { get; set; } = [];
}
