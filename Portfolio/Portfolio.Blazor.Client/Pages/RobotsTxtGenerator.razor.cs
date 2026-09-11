using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class RobotsTxtGenerator
{
    private string CanonicalPath => RequestPath;
    private List<RobotsRule> Rules { get; } = [new()];
    private string _sitemap = string.Empty;
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "userAgent")]
    private string? QueryUserAgent { get; set; }

    [SupplyParameterFromQuery(Name = "allow")]
    private string? QueryAllow { get; set; }

    [SupplyParameterFromQuery(Name = "disallow")]
    private string? QueryDisallow { get; set; }

    [SupplyParameterFromQuery(Name = "delay")]
    private string? QueryDelay { get; set; }

    [SupplyParameterFromQuery(Name = "sitemap")]
    private string? QuerySitemap { get; set; }
    private string Action => L["legacy_0c4fe0ae8a55"];
    private string Title => ToolsL["robots_txt_generator_title"];
    private string Description => ToolsL["robots_txt_generator_lead"];
    private string UserAgentLabel => L["legacy_3d361c7e6d13"];
    private string AllowLabel => L["legacy_a6afdae7964d"];
    private string DisallowLabel => L["legacy_3aafbf448b67"];
    private string DelayLabel => L["legacy_95a345155056"];
    private string SitemapLabel => L["legacy_84a973a45cf2"];
    private string AddRuleLabel => L["legacy_b5b29071a011"];
    private string RemoveLabel => L["legacy_89f09a9e2949"];
    private string GenerateLabel => L["legacy_cc7df97fb1b2"];
    private string OutputLabel => L["legacy_1d1c0e33dc3c"];
    private string CopyLabel => L["legacy_a3b71416a5f3"];
    private string Sitemap
    {
        get => _sitemap;
        set => _sitemap = value;
    }
    private string Output => Portfolio.Blazor.Core.RobotsTxtGenerator.Build(Rules, Sitemap);

    private void AddRule() => Rules.Add(new());

    private void RemoveRule(RobotsRule rule)
    {
        if (Rules.Count > 1)
            Rules.Remove(rule);
    }

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        Rules[0].UserAgent = QueryUserAgent ?? "*";
        Rules[0].Allow = QueryAllow ?? string.Empty;
        Rules[0].Disallow = QueryDisallow ?? string.Empty;
        Rules[0].Delay = QueryDelay ?? string.Empty;
        _sitemap = QuerySitemap ?? string.Empty;
        _queryInitialized = true;
    }
}
