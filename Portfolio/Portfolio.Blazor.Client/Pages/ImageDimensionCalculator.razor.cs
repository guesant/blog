using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class ImageDimensionCalculator
{
    private string CanonicalPath => RequestPath;
    private int? _originalWidth;
    private int? _originalHeight;
    private int? _targetWidth;
    private int? _targetHeight;
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "originalWidth")]
    private int? QueryOriginalWidth { get; set; }

    [SupplyParameterFromQuery(Name = "originalHeight")]
    private int? QueryOriginalHeight { get; set; }

    [SupplyParameterFromQuery(Name = "targetWidth")]
    private int? QueryTargetWidth { get; set; }

    [SupplyParameterFromQuery(Name = "targetHeight")]
    private int? QueryTargetHeight { get; set; }
    private string Action => L["legacy_a953c5d85114"];
    private string Title => L["legacy_96ebfb731562"];
    private string Description => L["legacy_34e68937aa37"];
    private string OptionalFileLabel => L["legacy_494dcb7851f5"];
    private string OriginalWidthLabel => L["legacy_1b63cae6ba99"];
    private string OriginalHeightLabel => L["legacy_b9b337101126"];
    private string TargetWidthLabel => L["legacy_7ccca359675e"];
    private string TargetHeightLabel => L["legacy_79116963bcf3"];
    private string ResultWidthLabel => L["legacy_93a43e4aa46b"];
    private string ResultHeightLabel => L["legacy_057e0acf661c"];
    private string CalculateLabel => L["legacy_53519f340509"];
    private int? OriginalWidth
    {
        get => _originalWidth;
        set
        {
            _originalWidth = value;
            Recalculate();
        }
    }
    private int? OriginalHeight
    {
        get => _originalHeight;
        set
        {
            _originalHeight = value;
            Recalculate();
        }
    }
    private int? TargetWidth
    {
        get => _targetWidth;
        set
        {
            _targetWidth = value;
            if (value is > 0)
                _targetHeight = null;
            Recalculate();
        }
    }
    private int? TargetHeight
    {
        get => _targetHeight;
        set
        {
            _targetHeight = value;
            if (value is > 0)
                _targetWidth = null;
            Recalculate();
        }
    }
    private ImageDimensionResult Result =>
        Portfolio.Blazor.Core.ImageDimensionCalculator.Calculate(
            OriginalWidth ?? 0,
            OriginalHeight ?? 0,
            TargetWidth,
            TargetHeight
        );

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _originalWidth = QueryOriginalWidth;
        _originalHeight = QueryOriginalHeight;
        _targetWidth = QueryTargetWidth;
        _targetHeight = QueryTargetWidth is > 0 ? null : QueryTargetHeight;
        _queryInitialized = true;
    }

    private void Recalculate() => StateHasChanged();

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
            await JS.InvokeVoidAsync("import", "/image-dimension-calculator.js");
    }
}
