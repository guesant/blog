using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class CssBorderRadiusGenerator
{
    private string CanonicalPath => RequestPath;
    private string _topLeftText = "16";
    private string _topRightText = "16";
    private string _bottomRightText = "16";
    private string _bottomLeftText = "16";
    private bool _linked = true;
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "tl")]
    private int? QueryTopLeft { get; set; }

    [SupplyParameterFromQuery(Name = "tr")]
    private int? QueryTopRight { get; set; }

    [SupplyParameterFromQuery(Name = "br")]
    private int? QueryBottomRight { get; set; }

    [SupplyParameterFromQuery(Name = "bl")]
    private int? QueryBottomLeft { get; set; }

    [SupplyParameterFromQuery(Name = "linked")]
    private bool? QueryLinked { get; set; }
    private string Action => L["legacy_9577c01c0e1b"];
    private string Title => ToolsL["css_border_radius_generator_title"];
    private string Description => ToolsL["css_border_radius_generator_lead"];
    private string InputLabel => L["legacy_048a8085c44a"];
    private string LinkedLabel => L["legacy_e5f510defbee"];
    private string TopLeftLabel => L["legacy_ccda4f7c9e4d"];
    private string TopRightLabel => L["legacy_f50cda5e602e"];
    private string BottomRightLabel => L["legacy_57c349086cfa"];
    private string BottomLeftLabel => L["legacy_b0499ee9817c"];
    private string GenerateLabel => L["legacy_cc7df97fb1b2"];
    private string OutputLabel => L["legacy_1d1c0e33dc3c"];
    private string CopyLabel => L["legacy_a3b71416a5f3"];
    private int TopLeft => Parse(_topLeftText);
    private int TopRight => Parse(_topRightText);
    private int BottomRight => Parse(_bottomRightText);
    private int BottomLeft => Parse(_bottomLeftText);
    private bool Linked
    {
        get => _linked;
        set
        {
            _linked = value;
            if (value)
            {
                _topRightText = _topLeftText;
                _bottomRightText = _topLeftText;
                _bottomLeftText = _topLeftText;
            }
        }
    }
    private string TopLeftText
    {
        get => _topLeftText;
        set
        {
            _topLeftText = value;
            if (Linked)
            {
                _topRightText = value;
                _bottomRightText = value;
                _bottomLeftText = value;
            }
        }
    }
    private string TopRightText
    {
        get => _topRightText;
        set => _topRightText = value;
    }
    private string BottomRightText
    {
        get => _bottomRightText;
        set => _bottomRightText = value;
    }
    private string BottomLeftText
    {
        get => _bottomLeftText;
        set => _bottomLeftText = value;
    }
    private string CssValue =>
        BorderRadiusGenerator.Format(TopLeft, TopRight, BottomRight, BottomLeft, Linked);
    private string RadiusValue =>
        string.Join(' ', CssValue.Replace("border-radius: ", string.Empty).TrimEnd(';').Split(' '));

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        if (QueryTopLeft.HasValue)
            _topLeftText = QueryTopLeft.Value.ToString();
        if (QueryTopRight.HasValue)
            _topRightText = QueryTopRight.Value.ToString();
        if (QueryBottomRight.HasValue)
            _bottomRightText = QueryBottomRight.Value.ToString();
        if (QueryBottomLeft.HasValue)
            _bottomLeftText = QueryBottomLeft.Value.ToString();
        if (QueryLinked.HasValue)
            _linked = QueryLinked.Value;
        _queryInitialized = true;
    }

    private static int Parse(string value) =>
        int.TryParse(value, out var result) ? Math.Max(0, result) : 0;
}
