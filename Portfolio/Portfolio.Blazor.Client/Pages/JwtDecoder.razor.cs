using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class JwtDecoder
{
    private string CanonicalPath => RequestPath;
    private string _token = string.Empty;
    private bool _queryInitialized;
    private JwtDecodeResult _result = JwtDecodeResult.Empty;

    [SupplyParameterFromQuery(Name = "token")]
    private string? QueryToken { get; set; }
    private string Action => L["legacy_66fa5d803a71"];
    private string Title => L["legacy_d9c95f6c7a5c"];
    private string Description => L["legacy_af88c17038d4"];
    private string PrivacyNote => L["legacy_aa92bb04b548"];
    private string InputLabel => L["legacy_c4c61716670f"];
    private string DecodeLabel => L["legacy_42acb5571820"];
    private string InvalidLabel => L["legacy_1612122b00b3"];
    private static string HeaderLabel => "Header";
    private static string PayloadLabel => "Payload";
    private string Token
    {
        get => _token;
        set
        {
            _token = value;
            _result = JwtDecoderEngine.Decode(value);
        }
    }
    private JwtDecodeResult Result => _result;

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _token = QueryToken ?? string.Empty;
        _result = JwtDecoderEngine.Decode(_token);
        _queryInitialized = true;
    }
}
