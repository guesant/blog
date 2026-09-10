using System.ComponentModel.DataAnnotations;

namespace Portfolio.Blazor.Data.Entities;

public sealed class Topic
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Slug is required.")]
    public string Slug { get; set; } = string.Empty;
    public string PublicId { get; set; } = string.Empty;
    public int Order { get; set; }
    public string Kind { get; set; } = "topic";
    public int? ParentId { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public List<TopicTranslation> Translations { get; set; } = [];
}
