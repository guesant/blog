using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class VectorCalculator
{
    private string CanonicalPath => RequestPath;
    private string _axText = "1";
    private string _ayText = "2";
    private string _azText = "3";
    private string _bxText = "4";
    private string _byText = "5";
    private string _bzText = "6";
    private VectorCalculationResult _result = Portfolio.Blazor.Core.VectorCalculator.Calculate(
        [1, 2, 3],
        [4, 5, 6]
    );
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "ax")]
    private string? QueryAX { get; set; }

    [SupplyParameterFromQuery(Name = "ay")]
    private string? QueryAY { get; set; }

    [SupplyParameterFromQuery(Name = "az")]
    private string? QueryAZ { get; set; }

    [SupplyParameterFromQuery(Name = "bx")]
    private string? QueryBX { get; set; }

    [SupplyParameterFromQuery(Name = "by")]
    private string? QueryBY { get; set; }

    [SupplyParameterFromQuery(Name = "bz")]
    private string? QueryBZ { get; set; }
    private string Action => L["legacy_d57407602bf1"];
    private string Title => L["legacy_6f867cb17f9e"];
    private string Description => L["legacy_012f07b2ce06"];
    private string InputLabel => L["legacy_08d2fc2bc5c7"];
    private static string VectorALabel => "A";
    private static string VectorBLabel => "B";
    private string DotLabel => L["legacy_e1746d94093d"];
    private string AngleLabel => L["legacy_8c0c0f7ef16e"];
    private string CrossLabel => L["legacy_eff28853259a"];
    private string SubmitLabel => L["legacy_53519f340509"];
    private string ErrorLabel => L["legacy_c1572143146a"];
    private string AXText
    {
        get => _axText;
        set
        {
            _axText = value;
            Recalculate();
        }
    }
    private string AYText
    {
        get => _ayText;
        set
        {
            _ayText = value;
            Recalculate();
        }
    }
    private string AZText
    {
        get => _azText;
        set
        {
            _azText = value;
            Recalculate();
        }
    }
    private string BXText
    {
        get => _bxText;
        set
        {
            _bxText = value;
            Recalculate();
        }
    }
    private string BYText
    {
        get => _byText;
        set
        {
            _byText = value;
            Recalculate();
        }
    }
    private string BZText
    {
        get => _bzText;
        set
        {
            _bzText = value;
            Recalculate();
        }
    }
    private VectorCalculationResult Result => _result;

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _axText = QueryAX ?? _axText;
        _ayText = QueryAY ?? _ayText;
        _azText = QueryAZ ?? _azText;
        _bxText = QueryBX ?? _bxText;
        _byText = QueryBY ?? _byText;
        _bzText = QueryBZ ?? _bzText;
        Recalculate();
        _queryInitialized = true;
    }

    private void Calculate() => Recalculate();

    private void Recalculate() =>
        _result = Portfolio.Blazor.Core.VectorCalculator.Calculate(
            [Parse(_axText), Parse(_ayText), Parse(_azText)],
            [Parse(_bxText), Parse(_byText), Parse(_bzText)]
        );

    private static double Parse(string value) =>
        double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var result)
            ? result
            : double.NaN;

    private static string Format(double value) =>
        value.ToString("G6", CultureInfo.InvariantCulture);
}
