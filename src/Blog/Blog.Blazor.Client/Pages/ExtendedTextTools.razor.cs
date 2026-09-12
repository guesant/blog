using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class ExtendedTextTools
{
    private string CanonicalPath => RequestPath;
    private string _input = "Olá, mundo! Este texto pode ser transformado.";
    private string _numberText = "3";
    private string _modeText = "az";
    private ExtendedTextToolResult _result = Blog.Blazor.Core.ExtendedTextTools.Analyze(
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
            "text-case" => ToolsL["text_case_title"],
            "case-style-converter" => ToolsL["case_style_converter_title"],
            "dot-case-converter" => ToolsL["dot_case_converter_title"],
            "duplicate-word-finder" => ToolsL["duplicate_word_finder_title"],
            "palindrome-checker" => ToolsL["palindrome_checker_title"],
            "word-frequency-counter" => ToolsL["word_frequency_counter_title"],
            "line-sorter" => ToolsL["line_sorter_title"],
            "reading-time-estimator" => ToolsL["reading_time_estimator_title"],
            "invisible-char-remover" => ToolsL["invisible_char_remover_title"],
            "lorem-ipsum-generator" => ToolsL["lorem_ipsum_generator_title"],
            "pig-latin" => ToolsL["pig_latin_title"],
            "leetspeak" => ToolsL["leetspeak_title"],
            "uwu-speak" => ToolsL["uwu_speak_title"],
            _ => L["text_tools"],
        };
    private string Description =>
        Slug switch
        {
            "text-case" => ToolsL["text_case_lead"],
            "case-style-converter" => ToolsL["case_style_converter_lead"],
            "dot-case-converter" => ToolsL["dot_case_converter_lead"],
            "duplicate-word-finder" => ToolsL["duplicate_word_finder_lead"],
            "palindrome-checker" => ToolsL["palindrome_checker_lead"],
            "word-frequency-counter" => ToolsL["word_frequency_counter_lead"],
            "line-sorter" => ToolsL["line_sorter_lead"],
            "reading-time-estimator" => ToolsL["reading_time_estimator_lead"],
            "invisible-char-remover" => ToolsL["invisible_char_remover_lead"],
            "lorem-ipsum-generator" => ToolsL["lorem_ipsum_generator_lead"],
            "pig-latin" => ToolsL["pig_latin_lead"],
            "leetspeak" => ToolsL["leetspeak_lead"],
            "uwu-speak" => ToolsL["uwu_speak_lead"],
            _ => Title,
        };
    private string InputLabel => L["input"];
    private string ResultLabel => L["result"];
    private string SubmitLabel => L["result"];
    private static string FrequencyTableId => "extended-text-frequency-table";
    private string ErrorLabel => L["word_frequency_pt"];
    private string ParagraphLabel => L["number_of_paragraphs"];
    private string SortModeLabel => L["paragraphs_1_20"];
    private IReadOnlyList<SiteSelectOption> SortModeOptions =>
        [new("az", "A–Z"), new("za", "Z–A"), new("numeric", NumericLabel)];
    private string NumericLabel => L["sort_order"];
    private string WordLabel => L["word"];
    private string CountLabel => L["occurrence_count"];
    private string EmptyLabel => L["occurrence_count"];
    private string YesLabel => L["yes_it_is_a_palindrome"];
    private string CopyLabel => L["copy"];
    private string NoLabel => L["no_it_is_not_a_palindrome"];
    private string WordsLabel => L["words"];
    private string ReadingTime
    {
        get
        {
            var seconds = (int)
                Math.Ceiling(
                    Result.Count * 60d / Blog.Blazor.Core.ExtendedTextTools.WordsPerMinute
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
        _result = Blog.Blazor.Core.ExtendedTextTools.Analyze(
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
