using System.ComponentModel.DataAnnotations;
using Portfolio.Blazor.Data;

namespace Portfolio.Blazor.Data.Entities;

// IMPORTANT: content_relations/relation_types (the generic "authored-by"/
// "published-by" attribution graph shared by every content type, 55 relation
// types wide) are intentionally NOT mapped or written here. Only ~4 rows
// exist for Findings today; a generic relation editor is disproportionate to
// that usage. Do not touch those two tables from this CRUD.
public sealed class Resource
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Slug is required.")]
    public string Slug { get; set; } = string.Empty;
    public string PublicId { get; set; } = string.Empty;
    public bool Hidden { get; set; }
    public int Order { get; set; }

    [Required(ErrorMessage = "Type is required.")]
    public string Type { get; set; } = "article";

    public int? LanguageId { get; set; }
    public string? Authors { get; set; }
    public string? Organizations { get; set; }
    public DateOnly? PublishedDateIso { get; set; }
    public DateOnly? FoundDateIso { get; set; }
    public string? ConsumptionState { get; set; }
    public string? Rating { get; set; }
    public string? EditorialState { get; set; }
    public string? Visibility { get; set; }

    [JsonOrEmpty]
    public string? TypeDetails { get; set; }

    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public Language? Language { get; set; }
    public List<ResourceTranslation> Translations { get; set; } = [];
    public List<ResourceLink> Links { get; set; } = [];
    public List<ResourceIdentifier> Identifiers { get; set; } = [];
}
