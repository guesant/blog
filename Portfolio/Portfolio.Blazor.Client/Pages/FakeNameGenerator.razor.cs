using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

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
    private string Action => L["legacy_7ade41fac7a1"];
    private string Title => L["legacy_cd0443858bdc"];
    private string Description => L["legacy_02997b2d2b4c"];
    private string InputLabel => L["legacy_d9825dc0fc2f"];
    private string CountLabel => L["legacy_ebfc81d5cecc"];
    private string UsernameLabel => L["legacy_e1664b6361eb"];
    private string EmailLabel => L["legacy_901a4e8fa0e7"];
    private string GenerateLabel => L["legacy_cc7df97fb1b2"];
    private string ResultLabel => L["legacy_2f0452494fcb"];
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
