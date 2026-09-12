using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class MechanicalEnergy
{
    private string CanonicalPath => RequestPath;
    private string _massText = "2";
    private string _speedText = "5";
    private string _heightText = "3";
    private string _gravityText = "9.80665";
    private MechanicalEnergyResult _result = PhysicsCalculator.MechanicalEnergy(2, 5, 3);
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "mass")]
    private string? QueryMass { get; set; }

    [SupplyParameterFromQuery(Name = "speed")]
    private string? QuerySpeed { get; set; }

    [SupplyParameterFromQuery(Name = "height")]
    private string? QueryHeight { get; set; }

    [SupplyParameterFromQuery(Name = "gravity")]
    private string? QueryGravity { get; set; }
    private string Action => L["tools_mechanical_energy"];
    private string Title => ToolsL["mechanical_energy_title"];
    private string Description => ToolsL["mechanical_energy_lead"];
    private string InputLabel => L["parameters"];
    private string MassLabel => L["mass_kg"];
    private string SpeedLabel => L["speed_m_s"];
    private string HeightLabel => L["height_m"];
    private string GravityLabel => L["gravity_m_s2"];
    private string KineticLabel => L["kinetic_energy_j"];
    private string PotentialLabel => L["potential_energy_j"];
    private string TotalLabel => L["total_mechanical_energy_j"];
    private string SubmitLabel => L["calculate"];
    private string ErrorLabel => L["provide_valid_mass_speed_height_and_gravity"];
    private string MassText
    {
        get => _massText;
        set
        {
            _massText = value;
            Recalculate();
        }
    }
    private string SpeedText
    {
        get => _speedText;
        set
        {
            _speedText = value;
            Recalculate();
        }
    }
    private string HeightText
    {
        get => _heightText;
        set
        {
            _heightText = value;
            Recalculate();
        }
    }
    private string GravityText
    {
        get => _gravityText;
        set
        {
            _gravityText = value;
            Recalculate();
        }
    }
    private double? MassNumber
    {
        get => ParseNullable(MassText);
        set => MassText = FormatInput(value);
    }
    private double? SpeedNumber
    {
        get => ParseNullable(SpeedText);
        set => SpeedText = FormatInput(value);
    }
    private double? HeightNumber
    {
        get => ParseNullable(HeightText);
        set => HeightText = FormatInput(value);
    }
    private double? GravityNumber
    {
        get => ParseNullable(GravityText);
        set => GravityText = FormatInput(value);
    }
    private MechanicalEnergyResult Result => _result;

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _massText = QueryMass ?? _massText;
        _speedText = QuerySpeed ?? _speedText;
        _heightText = QueryHeight ?? _heightText;
        _gravityText = QueryGravity ?? _gravityText;
        Recalculate();
        _queryInitialized = true;
    }

    private void Calculate() => Recalculate();

    private void Recalculate() =>
        _result = PhysicsCalculator.MechanicalEnergy(
            Parse(_massText),
            Parse(_speedText),
            Parse(_heightText),
            Parse(_gravityText)
        );

    private static double Parse(string value) =>
        double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var result)
            ? result
            : double.NaN;

    private static double? ParseNullable(string value) =>
        double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var result)
            ? result
            : null;

    private static string FormatInput(double? value) =>
        value?.ToString(CultureInfo.InvariantCulture) ?? string.Empty;

    private static string Energy(double value) =>
        value.ToString("N3", CultureInfo.InvariantCulture);
}
