using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class FakeNameGenerator
{
    private string CanonicalPath => RequestPath;
    private string _countText = "5";
    private bool _includeUsername,
        _includeEmail,
        _queryInitialized;
    private FakeNameResult _result = RandomNumberTools.GenerateNames(5, false, false);

    [SupplyParameterFromQuery(Name = "count")]
    private int? QueryCount { get; set; }

    [SupplyParameterFromQuery(Name = "username")]
    private bool? QueryUsername { get; set; }

    [SupplyParameterFromQuery(Name = "email")]
    private bool? QueryEmail { get; set; }
    private string Action => L["tools_fake_name_generator"];
    private string Title => ToolsL["fake_name_generator_title"];
    private string Description => ToolsL["fake_name_generator_lead"];
    private string InputLabel => L["parameters"];
    private string CountLabel => L["how_many"];
    private string UsernameLabel => L["include_username"];
    private string EmailLabel => L["include_email"];
    private string GenerateLabel => L["generate"];
    private string ResultLabel => L["results"];
    private string CountText
    {
        get => _countText;
        set => _countText = value;
    }
    private bool IncludeUsername
    {
        get => _includeUsername;
        set => _includeUsername = value;
    }
    private bool IncludeEmail
    {
        get => _includeEmail;
        set => _includeEmail = value;
    }
    private FakeNameResult Result => _result;

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        if (QueryCount.HasValue)
            _countText = QueryCount.Value.ToString(CultureInfo.InvariantCulture);
        _includeUsername = QueryUsername == true;
        _includeEmail = QueryEmail == true;
        Generate();
        _queryInitialized = true;
    }

    private void Generate() =>
        _result = RandomNumberTools.GenerateNames(
            int.TryParse(_countText, out var count) ? count : 5,
            _includeUsername,
            _includeEmail
        );
}
