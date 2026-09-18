namespace Blog.Blazor.Popularity;

public static class PopularityRanker
{
    public static List<RankedValue> Rank(List<CollectedValue> values)
    {
        var count = values.Count;
        var result = new List<RankedValue>(count);

        if (count == 1)
        {
            result.Add(new RankedValue(values[0].ResourceId, values[0].Value, 1.0));
            return result;
        }

        foreach (var item in values)
        {
            var smaller = values.Count(other => other.Value < item.Value);
            var rank = count <= 1 ? 1.0 : (double)smaller / (count - 1);
            result.Add(new RankedValue(item.ResourceId, item.Value, rank));
        }

        return result;
    }
}
