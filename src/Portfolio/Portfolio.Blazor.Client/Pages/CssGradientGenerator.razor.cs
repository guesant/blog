using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class CssGradientGenerator
{
    private string CanonicalPath => RequestPath;

    private sealed class StopState(int id, string color, int position)
    {
        public int Id { get; } = id;
        public string Color { get; set; } = color;
        public int Position { get; set; } = position;
    }

    private List<StopState> Stops { get; } = [new(1, "#4f46e5", 0), new(2, "#22d3ee", 100)];
    private int _nextId = 3;
    private string _type = "linear";
    private int _angle = 90;
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "type")]
    private string? QueryType { get; set; }

    [SupplyParameterFromQuery(Name = "angle")]
    private int? QueryAngle { get; set; }
    private string Action => L["tools_css_gradient_generator"];
    private string Title => ToolsL["css_gradient_generator_title"];
    private string Description => ToolsL["css_gradient_generator_lead"];
    private string InputLabel => L["parameters"];
    private string TypeLabel => L["type"];
    private static string LinearLabel => "linear";
    private static string RadialLabel => "radial";
    private string AngleLabel => L["angle"];
    private string ColorLabel => L["color"];
    private string PositionLabel => L["position"];
    private string RemoveLabel => L["remove"];
    private string AddLabel => L["add_stop"];
    private string GenerateLabel => L["generate"];
    private string OutputLabel => L["output"];
    private string CopyLabel => L["copy"];
    private string Type
    {
        get => _type;
        set => _type = value is "radial" ? "radial" : "linear";
    }
    private int Angle
    {
        get => _angle;
        set => _angle = Math.Clamp(value, 0, 360);
    }
    private static IReadOnlyList<SiteSelectOption> TypeOptions =>
        [new("linear", LinearLabel), new("radial", RadialLabel)];
    private string CssValue =>
        CssGradientFormatter.Format(
            Type,
            Angle,
            Stops.Select(stop => new GradientStop(stop.Color, stop.Position))
        );
    private string GradientValue => CssValue.Replace("background: ", string.Empty).TrimEnd(';');

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        if (QueryType is "linear" or "radial")
            _type = QueryType;
        if (QueryAngle.HasValue)
            _angle = Math.Clamp(QueryAngle.Value, 0, 360);
        _queryInitialized = true;
    }

    private void AddStop() => Stops.Add(new(_nextId++, "#22d3ee", 50));

    private void RemoveStop(StopState stop)
    {
        if (Stops.Count > 2)
            Stops.Remove(stop);
    }
}
