using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

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
    private string Action => L["tools_robots_txt_generator"];
    private string Title => ToolsL["robots_txt_generator_title"];
    private string Description => ToolsL["robots_txt_generator_lead"];
    private string UserAgentLabel => L["user_agent"];
    private string AllowLabel => L["allow_one_path_per_line"];
    private string DisallowLabel => L["disallow_one_path_per_line"];
    private string DelayLabel => L["crawl_delay_seconds_optional"];
    private string SitemapLabel => L["sitemap_url"];
    private string AddRuleLabel => L["add_rule"];
    private string RemoveLabel => L["remove_rule"];
    private string GenerateLabel => L["generate"];
    private string OutputLabel => L["output"];
    private string CopyLabel => L["copy"];
    private string Sitemap
    {
        get => _sitemap;
        set => _sitemap = value;
    }
    private string Output => Blog.Blazor.Core.RobotsTxtGenerator.Build(Rules, Sitemap);

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
