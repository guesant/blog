using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class CssBoxShadowGenerator
{
    private string CanonicalPath => RequestPath;

    private sealed class ShadowLayerState(
        int id,
        int x,
        int y,
        int blur,
        int spread,
        string color,
        bool inset
    )
    {
        public int Id { get; } = id;
        public int X { get; set; } = x;
        public int Y { get; set; } = y;
        public int Blur { get; set; } = blur;
        public int Spread { get; set; } = spread;
        public string Color { get; set; } = color;
        public bool Inset { get; set; } = inset;
    }

    private List<ShadowLayerState> Layers { get; } = [new(1, 0, 4, 12, 0, "#4f46e5", false)];
    private int _nextId = 2;

    [SupplyParameterFromQuery(Name = "x")]
    private int? QueryX { get; set; }

    [SupplyParameterFromQuery(Name = "y")]
    private int? QueryY { get; set; }

    [SupplyParameterFromQuery(Name = "blur")]
    private int? QueryBlur { get; set; }

    [SupplyParameterFromQuery(Name = "spread")]
    private int? QuerySpread { get; set; }

    [SupplyParameterFromQuery(Name = "color")]
    private string? QueryColor { get; set; }

    [SupplyParameterFromQuery(Name = "inset")]
    private bool? QueryInset { get; set; }
    private bool _queryInitialized;
    private string Action => L["legacy_abce337d2698"];
    private string Title => L["legacy_dc31d8a04f79"];
    private string Description => L["legacy_538477850730"];
    private static string BlurLabel => "blur";
    private static string SpreadLabel => "spread";
    private string ColorLabel => L["legacy_48541bef3bd6"];
    private static string InsetLabel => "inset";
    private string RemoveLabel => L["legacy_a5257096a74c"];
    private string AddLabel => L["legacy_0921377e659b"];
    private string GenerateLabel => L["legacy_cc7df97fb1b2"];
    private string OutputLabel => L["legacy_1d1c0e33dc3c"];
    private string CopyLabel => L["legacy_a3b71416a5f3"];
    private string CssValue =>
        BoxShadowFormatter.Format(
            Layers.Select(layer => new BoxShadowLayer(
                layer.X,
                layer.Y,
                layer.Blur,
                layer.Spread,
                layer.Color,
                layer.Inset
            ))
        );
    private string ShadowValue => CssValue.Replace("box-shadow: ", string.Empty).TrimEnd(';');

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        var layer = Layers[0];
        if (QueryX.HasValue)
            layer.X = QueryX.Value;
        if (QueryY.HasValue)
            layer.Y = QueryY.Value;
        if (QueryBlur.HasValue)
            layer.Blur = QueryBlur.Value;
        if (QuerySpread.HasValue)
            layer.Spread = QuerySpread.Value;
        if (!string.IsNullOrWhiteSpace(QueryColor))
            layer.Color = QueryColor!;
        if (QueryInset.HasValue)
            layer.Inset = QueryInset.Value;
        _queryInitialized = true;
    }

    private void AddLayer() => Layers.Add(new(_nextId++, 0, 4, 12, 0, "#4f46e5", false));

    private void RemoveLayer(ShadowLayerState layer)
    {
        if (Layers.Count > 1)
            Layers.Remove(layer);
    }
}
