using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class TextCounter
{
    private string CanonicalPath => RequestPath;
    private string _text = string.Empty;
    private TextStatistics _statistics;
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "text")]
    private string? QueryText { get; set; }

    private string Action => L["legacy_3078942a68c1"];
    private string Title => L["legacy_95a42b1ab997"];
    private string Description => L["text_counter_description"];
    private string InputLabel => L["legacy_a5b167e7baff"];
    private string SubmitLabel => L["legacy_718517a8ab26"];
    private string CharactersLabel => L["legacy_4947adb6830a"];
    private string CharactersWithoutSpacesLabel => L["legacy_2d0b5336dd9c"];
    private string WordsLabel => L["legacy_2badb3241476"];
    private string SentencesLabel => L["legacy_651fdc2bba19"];
    private string LinesLabel => L["legacy_fe63ef856ae5"];
    private string ParagraphsLabel => L["legacy_9252aae5ccfa"];

    private string Text
    {
        get => _text;
        set
        {
            _text = value;
            _statistics = TextStatisticsCalculator.Analyze(_text);
        }
    }

    private TextStatistics Statistics => _statistics;

    protected override void OnParametersSet()
    {
        if (!_queryInitialized)
        {
            Text = QueryText ?? string.Empty;
            _queryInitialized = true;
        }
    }

    private void HandleSubmit()
    {
        _statistics = TextStatisticsCalculator.Analyze(Text);
    }
}
