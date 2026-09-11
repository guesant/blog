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
    private string Action => L["tools_jwt_decoder"];
    private string Title => ToolsL["jwt_decoder_title"];
    private string Description => ToolsL["jwt_decoder_lead"];
    private string PrivacyNote => L["this_only_decodes_it_never_verifies_the"];
    private string InputLabel => L["input"];
    private string DecodeLabel => L["decode"];
    private string InvalidLabel => L["invalid_token"];
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
