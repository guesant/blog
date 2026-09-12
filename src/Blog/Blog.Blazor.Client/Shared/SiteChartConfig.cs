namespace Blog.Blazor.Client.Shared;

public enum SiteChartType
{
    Line,
    Bar,
}

public sealed class SiteChartConfig
{
    public SiteChartType Type { get; set; } = SiteChartType.Line;
    public SiteChartData Data { get; set; } = new();
}

public sealed class SiteChartData
{
    public List<string> Labels { get; set; } = [];
    public List<SiteChartDataset> Datasets { get; set; } = [];
}

public abstract class SiteChartDataset
{
    public string? Label { get; set; }
    public List<object> Data { get; set; } = [];
}

public sealed class SiteLineDataset : SiteChartDataset;

public sealed class SiteBarDataset : SiteChartDataset;
