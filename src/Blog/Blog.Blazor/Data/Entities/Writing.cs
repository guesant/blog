using System.ComponentModel.DataAnnotations;

namespace Blog.Blazor.Data.Entities;

public sealed class Writing
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Slug is required.")]
    public string Slug { get; set; } = string.Empty;
    public string PublicId { get; set; } = string.Empty;
    public bool Hidden { get; set; }
    public DateTime? DateIso { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool ShowHistory { get; set; }

    [Required(ErrorMessage = "Type is required.")]
    public string Type { get; set; } = "article";

    public List<WritingTranslation> Translations { get; set; } = [];
}
