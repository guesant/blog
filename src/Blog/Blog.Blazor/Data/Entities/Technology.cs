using System.ComponentModel.DataAnnotations;

namespace Blog.Blazor.Data.Entities;

public sealed class Technology
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Slug is required.")]
    public string Slug { get; set; } = string.Empty;
    public string PublicId { get; set; } = string.Empty;
    public int Order { get; set; }
    public bool Hidden { get; set; }
    public string? Code { get; set; }
    public string? Logo { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public List<TechnologyTranslation> Translations { get; set; } = [];
}
