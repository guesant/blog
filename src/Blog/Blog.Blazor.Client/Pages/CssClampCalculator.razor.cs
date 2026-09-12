using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

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
    private string Action => L["tools_css_clamp_calculator"];
    private string Title => ToolsL["css_clamp_calculator_title"];
    private string Description => ToolsL["css_clamp_calculator_lead"];
    private string InputLabel => L["parameters"];
    private string MinSizeLabel => L["minimum_size_px"];
    private string MaxSizeLabel => L["maximum_size_px"];
    private string MinViewportLabel => L["minimum_viewport_px"];
    private string MaxViewportLabel => L["maximum_viewport_px"];
    private string CalculateLabel => L["calculate"];
    private string InvalidLabel => L["provide_positive_values_and_a_minimum_viewport"];
    private string OutputLabel => L["output"];
    private string CopyLabel => L["copy"];
    private string PreviewText => L["preview_text"];
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
