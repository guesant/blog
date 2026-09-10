using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class ExtendedTextTools
{
    private string CanonicalPath => RequestPath;
    private string _input = "Olá, mundo! Este texto pode ser transformado.";
    private string _numberText = "3";
    private string _modeText = "az";
    private ExtendedTextToolResult _result = Portfolio.Blazor.Core.ExtendedTextTools.Analyze(
        "text-case",
        "Olá, mundo! Este texto pode ser transformado."
    );
    private bool _queryInitialized;
    private bool _frequencyTablePending;
    private readonly Debouncer _debouncer = new(TimeSpan.FromMilliseconds(300));

    [SupplyParameterFromQuery(Name = "text")]
    private string? QueryText { get; set; }

    [SupplyParameterFromQuery(Name = "count")]
    private int? QueryCount { get; set; }

    [SupplyParameterFromQuery(Name = "mode")]
    private string? QueryMode { get; set; }

    private string Slug => RequestRouteSegment("text-case");
    private string Action => LocalizedUrls.Current($"/tools/{Slug}");
    private string Title =>
        Slug switch
        {
            "text-case" => L["legacy_48d84b70fc63"],
            "case-style-converter" => L["legacy_3c5bd15831e4"],
            "dot-case-converter" => L["legacy_5d1c0cf2268e"],
            "duplicate-word-finder" => L["legacy_bc6dd768f040"],
            "palindrome-checker" => L["legacy_a3808ed7d722"],
            "word-frequency-counter" => L["legacy_039f08fd63d0"],
            "line-sorter" => L["legacy_a31935c406cf"],
            "reading-time-estimator" => L["legacy_13399cc7dda0"],
            "invisible-char-remover" => L["legacy_3a0f9cb9c931"],
            "lorem-ipsum-generator" => L["legacy_2ffbbe37e1da"],
            "pig-latin" => L["legacy_b71f1916495a"],
            "leetspeak" => L["legacy_dc1bedcb4357"],
            "uwu-speak" => L["legacy_1c800d938959"],
            _ => "text tools",
        };
    private string Description =>
        Slug switch
        {
            "text-case" => L["legacy_1a79ed9b8647"],
            "case-style-converter" => L["legacy_74004124558e"],
            "dot-case-converter" => L["legacy_cb1ee3eafb3d"],
            "duplicate-word-finder" => L["legacy_c7ac484fc4b6"],
            "palindrome-checker" => L["legacy_50053b984f0d"],
            "word-frequency-counter" => L["legacy_eaa3c29eacfb"],
            "line-sorter" => L["legacy_f1d6969c090b"],
            "reading-time-estimator" => L["legacy_f5f112712831"],
            "invisible-char-remover" => L["legacy_1949fda0f8fb"],
            "lorem-ipsum-generator" => L["legacy_87e497c7ec31"],
            "pig-latin" => L["legacy_0620049739e7"],
            "leetspeak" => L["legacy_5027c8e3368b"],
            "uwu-speak" => L["legacy_6ebd429b50bf"],
            _ => Title,
        };
    private string InputLabel => L["legacy_c4c61716670f"];
    private string ResultLabel => L["legacy_23470bef125e"];
    private string SubmitLabel => L["legacy_71b7d65336f8"];
    private static string FrequencyTableId => "extended-text-frequency-table";
    private string ErrorLabel => L["legacy_763c235cb82d"];
    private string ParagraphLabel => L["legacy_22988b478673"];
    private string SortModeLabel => L["legacy_7c97aa98a5a8"];
    private IReadOnlyList<SiteSelectOption> SortModeOptions =>
        [new("az", "A–Z"), new("za", "Z–A"), new("numeric", NumericLabel)];
    private string NumericLabel => L["legacy_4c302e056a19"];
    private string WordLabel => L["legacy_6e7c875b37ca"];
    private string CountLabel => L["legacy_52d5977065cc"];
    private string EmptyLabel => L["legacy_2222e1d3fbe0"];
    private string YesLabel => L["legacy_861928245c04"];
    private string CopyLabel => L["legacy_a3b71416a5f3"];
    private string NoLabel => L["legacy_dce6645d02c7"];
    private string WordsLabel => L["legacy_6d4afccb94df"];
    private string ReadingTime
    {
        get
        {
            var seconds = (int)
                Math.Ceiling(
                    Result.Count * 60d / Portfolio.Blazor.Core.ExtendedTextTools.WordsPerMinute
                );
            return L["estimated_time", seconds / 60, seconds % 60];
        }
    }
    private string Input
    {
        get => _input;
        set
        {
            _input = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string NumberText
    {
        get => _numberText;
        set
        {
            _numberText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string ModeText
    {
        get => _modeText;
        set
        {
            _modeText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private ExtendedTextToolResult Result => _result;

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _input = QueryText ?? _input;
        if (QueryCount.HasValue)
            _numberText = QueryCount.Value.ToString(CultureInfo.InvariantCulture);
        if (!string.IsNullOrWhiteSpace(QueryMode))
            _modeText = QueryMode!;
        Recalculate();
        _queryInitialized = true;
    }

    private void Recalculate()
    {
        _result = Portfolio.Blazor.Core.ExtendedTextTools.Analyze(
            Slug,
            _input,
            int.TryParse(_numberText, out var number) ? number : 0,
            _modeText
        );
        _frequencyTablePending = true;
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (
            RendererInfo.IsInteractive
            && _frequencyTablePending
            && Result.IsValid
            && Slug is "duplicate-word-finder" or "word-frequency-counter"
            && Result.Rows.Count > 0
        )
        {
            _frequencyTablePending = false;
            var rows = Result
                .Rows.Select(row => new[] { row.Label, row.Count.ToString() })
                .ToArray();
            await JS.InvokeVoidAsync(
                "tableEditor.initializeTabulator",
                FrequencyTableId,
                new[] { WordLabel, CountLabel },
                rows
            );
        }
    }

    public void Dispose()
    {
        _debouncer.Dispose();
        GC.SuppressFinalize(this);
    }
}
