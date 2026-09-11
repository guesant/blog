using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class TimestampConverter
{
    private string CanonicalPath => RequestPath;
    private string _timestampText = "1735689600";
    private DateTime _dateValue = new(2025, 1, 1);
    private bool _queryInitialized;
    private TimestampResult _result = TimestampConversion.FromTimestamp("1735689600");

    [SupplyParameterFromQuery(Name = "timestamp")]
    private string? QueryTimestamp { get; set; }

    [SupplyParameterFromQuery(Name = "date")]
    private string? QueryDate { get; set; }
    private string Action => L["legacy_8ea136bb42d0"];
    private string Title => ToolsL["timestamp_converter_title"];
    private string Description => ToolsL["timestamp_converter_lead"];
    private string InputLabel => L["legacy_f2f2808523c8"];
    private string TimestampInputLabel => L["legacy_aedfcab3ff4d"];
    private string NowLabel => L["legacy_ab243226f805"];
    private static string UtcLabel => "UTC";
    private string LocalLabel => L["legacy_1702aa220f98"];
    private string DateLabel => L["legacy_eac099ce73d6"];
    private string DateResultLabel => L["legacy_6f48e45282d4"];
    private string ConvertLabel => L["legacy_ae125407093e"];
    private string ErrorLabel => L["legacy_700f717ef5ce"];
    private string TimestampText
    {
        get => _timestampText;
        set
        {
            _timestampText = value;
            _result = TimestampConversion.FromTimestamp(value) with
            {
                TimestampFromDate = TimestampConversion.FromDate(_dateValue).TimestampFromDate,
            };
        }
    }
    private DateTime DateValue
    {
        get => _dateValue;
        set
        {
            _dateValue = value;
            _result = _result with
            {
                TimestampFromDate = TimestampConversion.FromDate(value).TimestampFromDate,
            };
        }
    }
    private string DateValueText =>
        _dateValue.ToString("yyyy-MM-ddTHH:mm:ss", CultureInfo.InvariantCulture);
    private TimestampResult Result => _result;

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _timestampText = QueryTimestamp ?? _timestampText;
        if (
            QueryDate is not null
            && DateTime.TryParse(
                QueryDate,
                CultureInfo.InvariantCulture,
                DateTimeStyles.AssumeLocal,
                out var date
            )
        )
            _dateValue = date;
        _result = TimestampConversion.FromTimestamp(_timestampText) with
        {
            TimestampFromDate = TimestampConversion.FromDate(_dateValue).TimestampFromDate,
        };
        _queryInitialized = true;
    }

    private void SetNow()
    {
        _timestampText = DateTimeOffset
            .UtcNow.ToUnixTimeSeconds()
            .ToString(CultureInfo.InvariantCulture);
        _result = TimestampConversion.FromTimestamp(_timestampText) with
        {
            TimestampFromDate = TimestampConversion.FromDate(_dateValue).TimestampFromDate,
        };
    }
}
