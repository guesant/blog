using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class TextUtilities
{
    private string CanonicalPath => RequestPath;
    private string _input = "Olá, mundo!";
    private string _countText = "3";
    private TextUtilityResult _result = new(true, "!odnum ,álO");
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "text")]
    private string? QueryText { get; set; }

    [SupplyParameterFromQuery(Name = "count")]
    private int? QueryCount { get; set; }
    private string Slug => RequestRouteSegment("text-reverser");
    private TextUtilityMode Mode =>
        Slug switch
        {
            "line-break-remover" => TextUtilityMode.RemoveLineBreaks,
            "whitespace-trimmer" => TextUtilityMode.TrimWhitespace,
            "duplicate-line-remover" => TextUtilityMode.RemoveDuplicateLines,
            "accent-remover" => TextUtilityMode.RemoveAccents,
            "slugify" => TextUtilityMode.Slugify,
            "text-repeater" => TextUtilityMode.Repeat,
            _ => TextUtilityMode.Reverse,
        };
    private string Action => LocalizedUrls.Current($"/tools/{Slug}");
    private string Title =>
        Mode switch
        {
            TextUtilityMode.RemoveLineBreaks => L["line_break_remover"],
            TextUtilityMode.TrimWhitespace => L["whitespace_trimmer"],
            TextUtilityMode.RemoveDuplicateLines => L["duplicate_line_remover"],
            TextUtilityMode.RemoveAccents => L["accent_remover"],
            TextUtilityMode.Slugify => L["slug_generator"],
            TextUtilityMode.Repeat => L["text_repeater"],
            _ => L["text_reverser"],
        };
    private string Description =>
        Mode switch
        {
            TextUtilityMode.RemoveLineBreaks => L["line_break_remover"],
            TextUtilityMode.TrimWhitespace => L["whitespace_trimmer"],
            TextUtilityMode.RemoveDuplicateLines => L["duplicate_line_remover"],
            TextUtilityMode.RemoveAccents => L["accent_remover"],
            TextUtilityMode.Slugify => L["slug_generator"],
            TextUtilityMode.Repeat => L["text_repeater"],
            _ => L["text_reverser"],
        };
    private string InputLabel => L["input"];
    private string OutputLabel => L["result_label"];
    private string CountLabel => L["result_label"];
    private string SubmitLabel => L["result"];
    private string ErrorLabel => L["transform"];
    private string Input
    {
        get => _input;
        set
        {
            _input = value;
            Recalculate();
        }
    }
    private string CountText
    {
        get => _countText;
        set
        {
            _countText = value;
            Recalculate();
        }
    }
    private TextUtilityResult Result => _result;

    protected override void OnParametersSet()
    {
        if (!_queryInitialized)
        {
            _input = QueryText ?? _input;
            if (QueryCount.HasValue)
            {
                _countText = QueryCount.Value.ToString();
            }

            Recalculate();
            _queryInitialized = true;
        }
    }

    private void HandleSubmit() => Recalculate();

    private void Recalculate() =>
        _result = TextUtilityCalculator.Transform(
            _input,
            Mode,
            int.TryParse(_countText, out var count) ? count : 0
        );
}
