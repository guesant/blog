using pax.BlazorChartJs;

namespace Portfolio.Blazor.Client.Shared;

public partial class SiteChart
{
    [Parameter, EditorRequired]
    public SiteChartConfig ChartJsConfig { get; set; } = default!;

    [Parameter]
    public string? Id { get; set; }

    [Parameter]
    public string Role { get; set; } = "img";

    [Parameter]
    public string? AriaLabel { get; set; }

    [Parameter]
    public string? AriaLabelledBy { get; set; }

    [Parameter]
    public string? AriaDescribedBy { get; set; }

    [Parameter]
    public string Class { get; set; } = string.Empty;

    private pax.BlazorChartJs.ChartJsConfig BootstrapConfig =>
        new()
        {
            Type = ChartJsConfig.Type == SiteChartType.Bar ? ChartType.bar : ChartType.line,
            Data = new ChartJsData
            {
                Labels = ChartJsConfig.Data.Labels,
                Datasets = ChartJsConfig
                    .Data.Datasets.Select<SiteChartDataset, pax.BlazorChartJs.ChartJsDataset>(
                        dataset =>
                            dataset switch
                            {
                                SiteBarDataset bar => new BarDataset
                                {
                                    Label = bar.Label,
                                    Data = bar.Data,
                                },
                                _ => new LineDataset { Label = dataset.Label, Data = dataset.Data },
                            }
                    )
                    .ToList(),
            },
        };
}
