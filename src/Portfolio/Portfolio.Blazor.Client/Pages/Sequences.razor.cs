using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class Sequences
{
    private string CanonicalPath => RequestPath;
    private string _firstText = "2",
        _differenceText = "3",
        _ratioText = "0.5",
        _termsText = "5";
    private SequenceResult _result = SequenceCalculator.Calculate(2, 3, .5, 5);
    private bool _queryInitialized;
    private readonly Debouncer _debouncer = new(TimeSpan.FromMilliseconds(300));

    [SupplyParameterFromQuery(Name = "first")]
    private string? QueryFirst { get; set; }

    [SupplyParameterFromQuery(Name = "difference")]
    private string? QueryDifference { get; set; }

    [SupplyParameterFromQuery(Name = "ratio")]
    private string? QueryRatio { get; set; }

    [SupplyParameterFromQuery(Name = "terms")]
    private string? QueryTerms { get; set; }
    private bool IsCombined => Slug == "sequences";
    private bool IsArithmetic => Slug is "arithmetic-progression" or "sequences";
    private string Slug => RequestRouteSegment("sequences");
    private string Action => LocalizedUrls.Current($"/tools/{Slug}");
    private string Title =>
        Slug switch
        {
            "arithmetic-progression" => ToolsL["arithmetic_progression_title"],
            "geometric-progression" => ToolsL["geometric_progression_title"],
            _ => L["arithmetic_and_geometric_sequences"],
        };
    private string Description =>
        Slug switch
        {
            "arithmetic-progression" => ToolsL["arithmetic_progression_lead"],
            "geometric-progression" => ToolsL["geometric_progression_lead"],
            _ => L["arithmetic_and_geometric_sequences"],
        };
    private string InputLabel => L["calculate_terms_and_sums_of_sequences_locally"];
    private string FirstLabel => L["input_values"];
    private string DifferenceLabel => L["first_term"];
    private string RatioLabel => L["difference_ap"];
    private string TermsLabel => L["ratio_gp"];
    private string SubmitLabel => L["calculate"];
    private string ErrorLabel => L["calculate"];
    private string InfiniteLabel => L["provide_finite_values_and_between_1_and_100_000"];
    private string ChartLabel => L["infinite_gp_sum_r_1"];
    private SiteChartConfig SequenceConfig =>
        new()
        {
            Type = SiteChartType.Line,
            Data = new SiteChartData
            {
                Labels = Enumerable
                    .Range(1, Math.Min(ParseTerms(), 100))
                    .Select(index => index.ToString(CultureInfo.InvariantCulture))
                    .ToList(),
                Datasets = BuildDatasets(),
            },
        };
    private string FirstText
    {
        get => _firstText;
        set
        {
            _firstText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string DifferenceText
    {
        get => _differenceText;
        set
        {
            _differenceText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string RatioText
    {
        get => _ratioText;
        set
        {
            _ratioText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string TermsText
    {
        get => _termsText;
        set
        {
            _termsText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private SequenceResult Result => _result;

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        if (QueryFirst is null && Slug is "arithmetic-progression" or "geometric-progression")
        {
            _firstText = "1";
            _differenceText = "2";
            _ratioText = "2";
            _termsText = Slug == "arithmetic-progression" ? "10" : "8";
        }
        _firstText = QueryFirst ?? _firstText;
        _differenceText = QueryDifference ?? _differenceText;
        _ratioText = QueryRatio ?? _ratioText;
        _termsText = QueryTerms ?? _termsText;
        Recalculate();
        _queryInitialized = true;
    }

    private void Calculate() => Recalculate();

    private void Recalculate() =>
        _result = SequenceCalculator.Calculate(
            Parse(_firstText),
            Parse(_differenceText),
            Parse(_ratioText),
            int.TryParse(_termsText, out var terms) ? terms : 0
        );

    private List<SiteChartDataset> BuildDatasets()
    {
        var terms = Enumerable.Range(1, Math.Min(ParseTerms(), 100)).ToArray();
        var datasets = new List<SiteChartDataset>();
        if (IsArithmetic || IsCombined)
            datasets.Add(
                new SiteLineDataset
                {
                    Label = "aₙ",
                    Data = terms
                        .Select(index =>
                            (object)(Parse(_firstText) + (index - 1) * Parse(_differenceText))
                        )
                        .ToList(),
                }
            );
        if (!IsArithmetic || IsCombined)
            datasets.Add(
                new SiteLineDataset
                {
                    Label = "gₙ",
                    Data = terms
                        .Select(index =>
                            (object)(Parse(_firstText) * Math.Pow(Parse(_ratioText), index - 1))
                        )
                        .ToList(),
                }
            );
        return datasets;
    }

    private int ParseTerms() =>
        int.TryParse(_termsText, NumberStyles.Integer, CultureInfo.InvariantCulture, out var terms)
            ? Math.Clamp(terms, 1, 100)
            : 1;

    private static double Parse(string value) =>
        double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var result)
            ? result
            : double.NaN;

    private static string Format(double value) =>
        value.ToString("G12", CultureInfo.InvariantCulture);

    public void Dispose()
    {
        _debouncer.Dispose();
        GC.SuppressFinalize(this);
    }
}
