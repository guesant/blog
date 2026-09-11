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
    private string Action => L["tools_image_dimension_calculator"];
    private string Title => ToolsL["image_dimension_calculator_title"];
    private string Description => ToolsL["image_dimension_calculator_lead"];
    private string OptionalFileLabel => L["image_file_optional_to_read_dimensions"];
    private string OriginalWidthLabel => L["original_width"];
    private string OriginalHeightLabel => L["original_height"];
    private string TargetWidthLabel => L["target_width"];
    private string TargetHeightLabel => L["target_height"];
    private string ResultWidthLabel => L["resulting_width"];
    private string ResultHeightLabel => L["resulting_height"];
    private string CalculateLabel => L["calculate"];
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
