namespace Blog.Blazor.Popularity;

public sealed record LinkRow(int ResourceId, string Url, string? Platform, bool IsPrimary);

public sealed record ResourceRow(
    int Id,
    string Slug,
    long? PopularityValue,
    string? PopularityKind
);

public sealed record CollectedValue(int ResourceId, long Value);

public sealed record RankedValue(int ResourceId, long Value, double Rank);

public sealed record CollectResult(
    int CandidateCount,
    List<CollectedValue> Values,
    List<string> UnmatchedDetails
)
{
    public int UnmatchedCount => UnmatchedDetails.Count;
}
