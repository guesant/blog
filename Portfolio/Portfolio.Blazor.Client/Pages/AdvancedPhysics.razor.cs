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
    private string InputLabel => L["legacy_5b6220fefc5c"];
    private string SpeedLabel => L["legacy_d0a57448000f"];
    private string AngleLabel => L["legacy_4579fb011bff"];
    private string GravityLabel => L["legacy_e96205651caf"];
    private string RadiusLabel => L["legacy_9d2a70ea99bd"];
    private string MassLabel => L["legacy_3d20f927558a"];
    private string SubmitLabel => L["legacy_37565a968d31"];
    private string ErrorLabel => L["legacy_587a6f4aea8e"];
    private string RangeLabel => L["legacy_4ba8b2a0e6ed"];
    private string HeightLabel => L["legacy_29efc6917bd6"];
    private string FlightLabel => L["legacy_ef68f89da814"];
    private string TrajectoryLabel => L["legacy_f2cac35ef942"];
    private string AngularLabel => L["legacy_cd822757b03d"];
    private string PeriodLabel => L["legacy_005bbc980509"];
    private string AccelerationLabel => L["legacy_62c15cbb8194"];
    private string ForceLabel => L["legacy_329f6c120c6e"];
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
