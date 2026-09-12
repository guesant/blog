using System.ComponentModel.DataAnnotations;

namespace Blog.Blazor.Data.Entities;

public sealed class ResourceIdentifier
{
    public int Id { get; set; }
    public int ResourceId { get; set; }

    [Required(ErrorMessage = "Kind is required.")]
    public string Kind { get; set; } = string.Empty;

    [Required(ErrorMessage = "Value is required.")]
    public string Value { get; set; } = string.Empty;
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public Resource? Resource { get; set; }
}
