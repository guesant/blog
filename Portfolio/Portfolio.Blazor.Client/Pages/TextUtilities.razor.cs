using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

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
            TextUtilityMode.RemoveLineBreaks => L["legacy_26f5c063dfb7"],
            TextUtilityMode.TrimWhitespace => L["legacy_3cd3bec34cf7"],
            TextUtilityMode.RemoveDuplicateLines => L["legacy_c53f803e651d"],
            TextUtilityMode.RemoveAccents => L["legacy_11f26056ef5c"],
            TextUtilityMode.Slugify => L["legacy_4d18a93cb1ea"],
            TextUtilityMode.Repeat => L["legacy_36e2b9b0f669"],
            _ => L["legacy_d334da01781a"],
        };
    private string Description =>
        Mode switch
        {
            TextUtilityMode.RemoveLineBreaks => L["legacy_546497c60aad"],
            TextUtilityMode.TrimWhitespace => L["legacy_c8b749a7f2e0"],
            TextUtilityMode.RemoveDuplicateLines => L["legacy_b1ca8f7136b4"],
            TextUtilityMode.RemoveAccents => L["legacy_ea960cf22f6f"],
            TextUtilityMode.Slugify => L["legacy_250dac09ac7f"],
            TextUtilityMode.Repeat => L["legacy_9eac6c404dd7"],
            _ => L["legacy_02665766c4a2"],
        };
    private string InputLabel => L["legacy_c4c61716670f"];
    private string OutputLabel => L["legacy_f2a7eb87e63d"];
    private string CountLabel => L["legacy_743f2df2b4ac"];
    private string SubmitLabel => L["legacy_71b7d65336f8"];
    private string ErrorLabel => L["legacy_213e25a65d3a"];
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
