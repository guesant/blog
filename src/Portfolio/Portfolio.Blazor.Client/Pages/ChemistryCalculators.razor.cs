using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class ChemistryCalculators
{
    private string CanonicalPath => RequestPath;
    private string _c1Text = "1";
    private string _v1Text = "10";
    private string _c2Text = "0.2";
    private string _v2Text = string.Empty;
    private string _concentrationText = "0.001";
    private DilutionResult _dilution = ChemistryCalculator.Dilution(1, 10, 0.2, null);
    private PhResult _ph = ChemistryCalculator.Ph(0.001);
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "c1")]
    private string? QueryC1 { get; set; }

    [SupplyParameterFromQuery(Name = "v1")]
    private string? QueryV1 { get; set; }

    [SupplyParameterFromQuery(Name = "c2")]
    private string? QueryC2 { get; set; }

    [SupplyParameterFromQuery(Name = "v2")]
    private string? QueryV2 { get; set; }

    [SupplyParameterFromQuery(Name = "concentration")]
    private string? QueryConcentration { get; set; }
    private bool IsDilution =>
        Navigation.Uri.Contains("/dilution-calculator", StringComparison.OrdinalIgnoreCase);
    private string Action =>
        LocalizedUrls.Current($"/tools/{(IsDilution ? "dilution-calculator" : "ph-calculator")}");
    private string Title =>
        IsDilution ? (ToolsL["dilution_calculator_title"]) : (ToolsL["ph_calculator_title"]);
    private string Description =>
        IsDilution ? (ToolsL["dilution_calculator_lead"]) : (ToolsL["ph_calculator_lead"]);
    private string InputLabel => L["legacy_5b6220fefc5c"];
    private string ConcentrationLabel => L["legacy_d71836525f89"];
    private string SubmitLabel => L["legacy_37565a968d31"];
    private string ErrorLabel => L["legacy_4dcf843f6e91"];
    private string C1Text
    {
        get => _c1Text;
        set
        {
            _c1Text = value;
            Recalculate();
        }
    }
    private string V1Text
    {
        get => _v1Text;
        set
        {
            _v1Text = value;
            Recalculate();
        }
    }
    private string C2Text
    {
        get => _c2Text;
        set
        {
            _c2Text = value;
            Recalculate();
        }
    }
    private string V2Text
    {
        get => _v2Text;
        set
        {
            _v2Text = value;
            Recalculate();
        }
    }
    private string ConcentrationText
    {
        get => _concentrationText;
        set
        {
            _concentrationText = value;
            Recalculate();
        }
    }
    private DilutionResult Dilution => _dilution;
    private PhResult Ph => _ph;

    protected override void OnParametersSet()
    {
        if (!_queryInitialized)
        {
            _c1Text = QueryC1 ?? _c1Text;
            _v1Text = QueryV1 ?? _v1Text;
            _c2Text = QueryC2 ?? _c2Text;
            _v2Text = QueryV2 ?? _v2Text;
            _concentrationText = QueryConcentration ?? _concentrationText;
            Recalculate();
            _queryInitialized = true;
        }
    }

    private void HandleSubmit() => Recalculate();

    private void Recalculate()
    {
        _dilution = ChemistryCalculator.Dilution(
            ParseNullable(_c1Text),
            ParseNullable(_v1Text),
            ParseNullable(_c2Text),
            ParseNullable(_v2Text)
        );
        _ph = ChemistryCalculator.Ph(Parse(_concentrationText));
    }

    private static double Parse(string value) =>
        double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var result)
            ? result
            : double.NaN;

    private static double? ParseNullable(string value) =>
        double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var result)
            ? result
            : null;

    private static string Format(double value) =>
        value.ToString("G8", CultureInfo.InvariantCulture);
}
