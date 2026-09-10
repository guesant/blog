using System.ComponentModel.DataAnnotations;

namespace Portfolio.Blazor.Data.Entities;

public sealed class Page
{
    public int Id { get; set; }

    // IMPORTANT: nothing in the schema stops a new slug from being created,
    // but every page's `fields` JSON is only ever read by hardcoded,
    // slug-specific components (InformationalPages.razor and friends) — a page
    // whose slug no route recognizes will save fine and simply never render
    // anywhere on the public site.
    [Required(ErrorMessage = "Slug is required.")]
    public string Slug { get; set; } = string.Empty;

    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public List<PageTranslation> Translations { get; set; } = [];
    public List<PageFeaturedCase> FeaturedCases { get; set; } = [];
    public List<PageFeaturedProject> FeaturedProjects { get; set; } = [];
    public List<PageFeaturedWriting> FeaturedWritings { get; set; } = [];
}
