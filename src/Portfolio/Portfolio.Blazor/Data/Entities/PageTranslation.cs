using System.ComponentModel.DataAnnotations;
using Portfolio.Blazor.Data;

namespace Portfolio.Blazor.Data.Entities;

public sealed class PageTranslation
{
    public int Id { get; set; }
    public int PageId { get; set; }
    public string Locale { get; set; } = string.Empty;

    // IMPORTANT: `fields` structure varies per page slug (see
    // Home.razor/InformationalPages.razor for how each page interprets its
    // own JSON). The admin editor (SitePageFieldsInput, PageEdit.razor) maps
    // known slugs to their known field set via PageFieldCatalog; a slug not
    // in the catalog gracefully falls back to free-form key/value rows, so
    // this stays safe even for a page kind the catalog doesn't know about.
    [Required(ErrorMessage = "Fields is required.")]
    [JsonOrEmpty]
    public string Fields { get; set; } = string.Empty;

    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public Page? Page { get; set; }
}
