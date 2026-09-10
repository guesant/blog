using System.ComponentModel.DataAnnotations;

namespace Portfolio.Blazor.Data.Entities;

public sealed class ReferenceCollection
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Slug is required.")]
    public string Slug { get; set; } = string.Empty;
    public string PublicId { get; set; } = string.Empty;
    public bool Hidden { get; set; }
    public int Order { get; set; }
    public string? Image { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateOnly? PublishedAt { get; set; }

    public List<ReferenceCollectionTranslation> Translations { get; set; } = [];
    public List<ReferenceCollectionItem> Items { get; set; } = [];
}
