using System.ComponentModel.DataAnnotations;

namespace Blog.Blazor.Data.Entities;

public sealed class Language
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Slug is required.")]
    public string Slug { get; set; } = string.Empty;
    public int Order { get; set; }

    [Required(ErrorMessage = "Code is required.")]
    public string Code { get; set; } = string.Empty;
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public List<LanguageTranslation> Translations { get; set; } = [];
}
