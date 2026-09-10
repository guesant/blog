using Portfolio.Blazor.Data;

namespace Portfolio.Blazor.Data.Entities;

public sealed class ResumeTranslation
{
    public int Id { get; set; }
    public int ResumeId { get; set; }
    public string Locale { get; set; } = string.Empty;
    public string? Summary { get; set; }

    [JsonOrEmpty]
    public string? Leadership { get; set; }

    [JsonOrEmpty]
    public string? Education { get; set; }

    [JsonOrEmpty]
    public string? Certificates { get; set; }

    [JsonOrEmpty]
    public string? Certifications { get; set; }

    [JsonOrEmpty]
    public string? Publications { get; set; }

    [JsonOrEmpty]
    public string? Recommendations { get; set; }

    [JsonOrEmpty]
    public string? TechnicalProductions { get; set; }

    [JsonOrEmpty]
    public string? Events { get; set; }

    [JsonOrEmpty]
    public string? Awards { get; set; }

    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public Resume? Resume { get; set; }
}
