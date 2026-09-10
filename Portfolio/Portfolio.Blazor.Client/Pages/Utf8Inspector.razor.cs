using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class Utf8Inspector
{
    private string CanonicalPath => RequestPath;
    private string Input = "";
    private string Title => L["utf8_title"];
    private string Description => L["utf8_description"];
    private string InputLabel => L["vigenere_input"];
    private string ByteLabel => L["bytes"];
    private string CharacterLabel => L["characters"];
    private string CodePointLabel => L["code_points"];
    private string BytesLabel => L["hexadecimal_bytes"];
    private Utf8Inspection Result => Portfolio.Blazor.Core.Utf8Inspector.Inspect(Input);
}
