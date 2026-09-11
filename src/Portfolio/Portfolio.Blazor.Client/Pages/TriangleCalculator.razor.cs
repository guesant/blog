using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class TriangleCalculator
{
    private string CanonicalPath => RequestPath;
    private double A = 3,
        B = 4,
        C = 5;
    private bool initialized;

    [SupplyParameterFromQuery(Name = "a")]
    private double? QueryA { get; set; }

    [SupplyParameterFromQuery(Name = "b")]
    private double? QueryB { get; set; }

    [SupplyParameterFromQuery(Name = "c")]
    private double? QueryC { get; set; }
    private string Action => L["legacy_3df114556dbe"];
    private string Title => ToolsL["triangle_calculator_page_title"];
    private string Description => ToolsL["triangle_calculator_lead"];
    private string CalculateLabel => L["legacy_53519f340509"];
    private string ErrorLabel => L["legacy_572e9b6409dc"];
    private TriangleResult Result => Portfolio.Blazor.Core.TriangleCalculator.Calculate(A, B, C);

    protected override void OnParametersSet()
    {
        if (initialized)
            return;
        A = QueryA ?? A;
        B = QueryB ?? B;
        C = QueryC ?? C;
        initialized = true;
    }
}
