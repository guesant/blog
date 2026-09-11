using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class ContrastChecker
{
    private string CanonicalPath => RequestPath;
    private string _foreground = "#000000";
    private string _background = "#ffffff";
    private ContrastResult _result = ContrastRatioCalculator.Calculate("#000000", "#ffffff");
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "foreground")]
    private string? QueryForeground { get; set; }

    [SupplyParameterFromQuery(Name = "background")]
    private string? QueryBackground { get; set; }
    private string Action => L["legacy_8dc841a7631d"];
    private string Title => ToolsL["contrast_checker_title"];
    private string Description => ToolsL["contrast_checker_lead"];
    private string ColorsLabel => L["legacy_fb16beca92ab"];
    private string ForegroundLabel => L["legacy_2eb6fd587389"];
    private string BackgroundLabel => L["legacy_cac11bc85975"];
    private string SampleText => L["legacy_d6bda1795d88"];
    private string RatioLabel => L["legacy_dd5724a41568"];
    private string BadgesLabel => L["legacy_d095417573d8"];
    private string AaNormalLabel => L["legacy_c1c90778022c"];
    private string AaLargeLabel => L["legacy_8168e9d4d890"];
    private string AaaNormalLabel => L["legacy_0a204d18a089"];
    private string AaaLargeLabel => L["legacy_eb612f20a857"];
    private string CheckLabel => L["legacy_c3e82d9fe12b"];

    private string Status(bool passes) =>
        passes ? (L["legacy_275d43744545"]) : (L["legacy_50357992e734"]);

    private static string BadgeClass(bool passes) =>
        $"tool-badge {(passes ? "tool-badge--pass" : "tool-badge--fail")}";

    private string Foreground
    {
        get => _foreground;
        set
        {
            _foreground = value;
            Recalculate();
        }
    }
    private string Background
    {
        get => _background;
        set
        {
            _background = value;
            Recalculate();
        }
    }
    private ContrastResult Result => _result;

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _foreground = QueryForeground ?? _foreground;
        _background = QueryBackground ?? _background;
        Recalculate();
        _queryInitialized = true;
    }

    private void Recalculate() =>
        _result = ContrastRatioCalculator.Calculate(_foreground, _background);
}
