using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class CssClampCalculator
{
    private string CanonicalPath => RequestPath;
    private double _minSize = 16,
        _maxSize = 32,
        _minViewport = 320,
        _maxViewport = 1280;
    private CssClampResult _result = CssClampEngine.Calculate(16, 32, 320, 1280);
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "minSize")]
    private double? QueryMinSize { get; set; }

    [SupplyParameterFromQuery(Name = "maxSize")]
    private double? QueryMaxSize { get; set; }

    [SupplyParameterFromQuery(Name = "minVw")]
    private double? QueryMinViewport { get; set; }

    [SupplyParameterFromQuery(Name = "maxVw")]
    private double? QueryMaxViewport { get; set; }
    private string Action => L["legacy_080681072133"];
    private string Title => ToolsL["css_clamp_calculator_title"];
    private string Description => ToolsL["css_clamp_calculator_lead"];
    private string InputLabel => L["legacy_d9825dc0fc2f"];
    private string MinSizeLabel => L["legacy_c0446431e838"];
    private string MaxSizeLabel => L["legacy_4b1a011deaa3"];
    private string MinViewportLabel => L["legacy_884fbc11c83f"];
    private string MaxViewportLabel => L["legacy_a835c06b7309"];
    private string CalculateLabel => L["legacy_53519f340509"];
    private string InvalidLabel => L["legacy_c253d22ad0a8"];
    private string OutputLabel => L["legacy_1d1c0e33dc3c"];
    private string CopyLabel => L["legacy_a3b71416a5f3"];
    private string PreviewText => L["legacy_96d90049ff5e"];
    private double MinSize
    {
        get => _minSize;
        set
        {
            _minSize = value;
            Recalculate();
        }
    }
    private double MaxSize
    {
        get => _maxSize;
        set
        {
            _maxSize = value;
            Recalculate();
        }
    }
    private double MinViewport
    {
        get => _minViewport;
        set
        {
            _minViewport = value;
            Recalculate();
        }
    }
    private double MaxViewport
    {
        get => _maxViewport;
        set
        {
            _maxViewport = value;
            Recalculate();
        }
    }
    private CssClampResult Result => _result;

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        if (QueryMinSize.HasValue)
            _minSize = QueryMinSize.Value;
        if (QueryMaxSize.HasValue)
            _maxSize = QueryMaxSize.Value;
        if (QueryMinViewport.HasValue)
            _minViewport = QueryMinViewport.Value;
        if (QueryMaxViewport.HasValue)
            _maxViewport = QueryMaxViewport.Value;
        Recalculate();
        _queryInitialized = true;
    }

    private void Recalculate() =>
        _result = CssClampEngine.Calculate(_minSize, _maxSize, _minViewport, _maxViewport);
}
