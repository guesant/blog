using Blog.Blazor.Data;

namespace Blog.Blazor.Data.Entities;

public sealed class ExperimentTranslation
{
    public int Id { get; set; }
    public int ExperimentId { get; set; }
    public string Locale { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Purpose { get; set; } = string.Empty;
    public string? Body { get; set; }

    [JsonOrEmpty]
    public string? Seo { get; set; }

    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public Experiment? Experiment { get; set; }
}
