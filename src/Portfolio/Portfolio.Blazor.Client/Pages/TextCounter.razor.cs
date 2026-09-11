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

    private string Action => L["tools_text_counter"];
    private string Title => ToolsL["text_counter_title"];
    private string Description => ToolsL["text_counter_lead"];
    private string InputLabel => L["text"];
    private string SubmitLabel => L["count_action"];
    private string CharactersLabel => L["characters"];
    private string CharactersWithoutSpacesLabel => L["characters_without_spaces"];
    private string WordsLabel => L["no_it_is_not_a_palindrome"];
    private string SentencesLabel => L["sentences"];
    private string LinesLabel => L["lines"];
    private string ParagraphsLabel => L["paragraphs"];

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
