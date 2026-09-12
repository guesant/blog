using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

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
    private string Action => L["tools_timestamp_converter"];
    private string Title => ToolsL["timestamp_converter_title"];
    private string Description => ToolsL["timestamp_converter_lead"];
    private string InputLabel => L["inputs"];
    private string TimestampInputLabel => L["timestamp"];
    private string NowLabel => L["now"];
    private static string UtcLabel => "UTC";
    private string LocalLabel => L["local"];
    private string DateLabel => L["date_and_time"];
    private string DateResultLabel => L["result_timestamp"];
    private string ConvertLabel => L["converter"];
    private string ErrorLabel => L["enter_a_valid_integer_timestamp"];
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
