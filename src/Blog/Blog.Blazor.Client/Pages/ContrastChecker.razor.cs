using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

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
    private string Action => L["tools_contrast_checker"];
    private string Title => ToolsL["contrast_checker_title"];
    private string Description => ToolsL["contrast_checker_lead"];
    private string ColorsLabel => L["colors"];
    private string ForegroundLabel => L["foreground"];
    private string BackgroundLabel => L["background"];
    private string SampleText => L["the_quick_brown_fox_jumps_over_the_lazy_dog"];
    private string RatioLabel => L["contrast_ratio"];
    private string BadgesLabel => L["accessibility_levels"];
    private string AaNormalLabel => L["aa_normal_text"];
    private string AaLargeLabel => L["aa_large_text"];
    private string AaaNormalLabel => L["aaa_normal_text"];
    private string AaaLargeLabel => L["aaa_large_text"];
    private string CheckLabel => L["check"];

    private string Status(bool passes) => passes ? (L["pass"]) : (L["fail"]);

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
