using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class TextCodec
{
    private string CanonicalPath => RequestPath;
    private string _input = "Olá, mundo!";
    private string _operation = "encode";
    private TextCodecResult _result = TextCodecs.Transform(
        "base64-encoder",
        "Olá, mundo!",
        "encode"
    );
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "input")]
    private string? QueryInput { get; set; }

    [SupplyParameterFromQuery(Name = "operation")]
    private string? QueryOperation { get; set; }
    private string Slug => RequestRouteSegment("base64-encoder");
    private string Action => LocalizedUrls.Current($"/tools/{Slug}");
    private string Title =>
        Slug switch
        {
            "base64-encoder" => ToolsL["base64_encoder_title"],
            "hex-text-codec" => ToolsL["hex_text_codec_page_title"],
            "binary-text-codec" => ToolsL["binary_text_codec_page_title"],
            "html-entity-codec" => ToolsL["html_entity_codec_page_title"],
            _ => L["legacy_c0d420f0d314"],
        };
    private string Description =>
        Slug switch
        {
            "base64-encoder" => ToolsL["base64_encoder_lead"],
            "hex-text-codec" => ToolsL["hex_text_codec_lead"],
            "binary-text-codec" => ToolsL["binary_text_codec_lead"],
            "html-entity-codec" => ToolsL["html_entity_codec_lead"],
            _ => L["legacy_72b6d8f8fae7"],
        };
    private string InputLabel => L["legacy_c4c61716670f"];
    private string OutputLabel => L["legacy_1d1c0e33dc3c"];
    private string EncodeLabel => L["legacy_1f25e36c2666"];
    private string DecodeLabel => L["legacy_42acb5571820"];
    private string CopyLabel => L["legacy_a3b71416a5f3"];
    private string ErrorLabel =>
        Slug == "binary-text-codec" ? (L["legacy_ec4bfccb2ec2"]) : (L["legacy_37956dffe17b"]);
    private string Input
    {
        get => _input;
        set
        {
            _input = value;
            Recalculate();
        }
    }
    private string Operation
    {
        get => _operation;
        set
        {
            _operation = value;
            Recalculate();
        }
    }
    private TextCodecResult Result => _result;

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _input = QueryInput ?? _input;
        _operation = QueryOperation is "decode" ? "decode" : "encode";
        Recalculate();
        _queryInitialized = true;
    }

    private void Transform(string operation) => Operation = operation;

    private void Encode() => Transform("encode");

    private void Decode() => Transform("decode");

    private void Recalculate() => _result = TextCodecs.Transform(Slug, _input, _operation);
}
