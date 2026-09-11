using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class AdvancedPhysics
{
    private string CanonicalPath => RequestPath;
    private string _speedText = "20",
        _angleText = "45",
        _gravityText = "9.80665",
        _radiusText = "2",
        _circularSpeedText = "4",
        _massText = "3";
    private ProjectileResult _projectile = PhysicsCalculator.Projectile(20, 45);
    private CircularMotionResult _circular = PhysicsCalculator.CircularMotion(2, 4, 3);
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "speed")]
    private string? QuerySpeed { get; set; }

    [SupplyParameterFromQuery(Name = "angle")]
    private string? QueryAngle { get; set; }

    [SupplyParameterFromQuery(Name = "gravity")]
    private string? QueryGravity { get; set; }

    [SupplyParameterFromQuery(Name = "radius")]
    private string? QueryRadius { get; set; }

    [SupplyParameterFromQuery(Name = "mass")]
    private string? QueryMass { get; set; }
    private bool IsProjectile =>
        Navigation.Uri.Contains("projectile-motion", StringComparison.OrdinalIgnoreCase);
    private string Action =>
        LocalizedUrls.Current($"/tools/{(IsProjectile ? "projectile-motion" : "circular-motion")}");
    private string Title =>
        IsProjectile ? (ToolsL["projectile_motion_title"]) : (ToolsL["circular_motion_title"]);
    private string Description =>
        IsProjectile ? (ToolsL["projectile_motion_lead"]) : (ToolsL["circular_motion_lead"]);
    private string InputLabel => L["parameters"];
    private string SpeedLabel => L["speed_m_s"];
    private string AngleLabel => L["angle_degrees"];
    private string GravityLabel => L["gravity_m_s2"];
    private string RadiusLabel => L["radius_m"];
    private string MassLabel => L["mass_kg_optional"];
    private string SubmitLabel => L["calculate"];
    private string ErrorLabel => L["provide_valid_values_for_the_model"];
    private string RangeLabel => L["range"];
    private string HeightLabel => L["maximum_height"];
    private string FlightLabel => L["flight_time"];
    private string TrajectoryLabel => L["projectile_trajectory"];
    private string AngularLabel => L["angular_velocity"];
    private string PeriodLabel => L["period"];
    private string AccelerationLabel => L["centripetal_acceleration"];
    private string ForceLabel => L["centripetal_force"];
    private readonly Debouncer _debouncer = new(TimeSpan.FromMilliseconds(300));
    private string SpeedText
    {
        get => _speedText;
        set
        {
            _speedText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string AngleText
    {
        get => _angleText;
        set
        {
            _angleText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string GravityText
    {
        get => _gravityText;
        set
        {
            _gravityText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string RadiusText
    {
        get => _radiusText;
        set
        {
            _radiusText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string CircularSpeedText
    {
        get => _circularSpeedText;
        set
        {
            _circularSpeedText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string MassText
    {
        get => _massText;
        set
        {
            _massText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private ProjectileResult Projectile => _projectile;
    private CircularMotionResult Circular => _circular;
    private bool ResultIsValid => IsProjectile ? Projectile.IsValid : Circular.IsValid;
    private SiteChartConfig TrajectoryConfig =>
        new()
        {
            Type = SiteChartType.Line,
            Data = new SiteChartData
            {
                Labels = Projectile.Trajectory.Select(point => Format(point.X)).ToList(),
                Datasets =
                [
                    new SiteLineDataset
                    {
                        Label = TrajectoryLabel,
                        Data = Projectile.Trajectory.Select(point => (object)point.Y).ToList(),
                    },
                ],
            },
        };

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _speedText = QuerySpeed ?? _speedText;
        _angleText = QueryAngle ?? _angleText;
        _gravityText = QueryGravity ?? _gravityText;
        _radiusText = QueryRadius ?? _radiusText;
        _massText = QueryMass ?? _massText;
        Recalculate();
        _queryInitialized = true;
    }

    private void Calculate() => Recalculate();

    private void Recalculate()
    {
        _projectile = PhysicsCalculator.Projectile(
            Parse(_speedText),
            Parse(_angleText),
            Parse(_gravityText)
        );
        _circular = PhysicsCalculator.CircularMotion(
            Parse(_radiusText),
            Parse(_circularSpeedText),
            ParseNullable(_massText)
        );
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
        double.IsFinite(value) ? value.ToString("G8", CultureInfo.InvariantCulture) : "∞";

    public void Dispose()
    {
        _debouncer.Dispose();
        GC.SuppressFinalize(this);
    }
}
