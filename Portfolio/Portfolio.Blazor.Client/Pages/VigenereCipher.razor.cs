using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class VigenereCipher
{
    private string CanonicalPath => RequestPath;
    private string Input = "",
        Key = "",
        Output = "";
    private bool ShowError;
    private string Title => ToolsL["vigenere_cipher_page_title"];
    private string Description => ToolsL["vigenere_cipher_lead"];
    private string InputLabel => L["vigenere_input"];
    private string KeyLabel => L["vigenere_key"];
    private string OutputLabel => L["vigenere_output"];
    private string EncodeLabel => L["vigenere_encode"];
    private string DecodeLabel => L["vigenere_decode"];
    private string CopyLabel => L["vigenere_copy"];
    private string ErrorLabel => L["vigenere_error"];

    private void Run(bool decode)
    {
        if (Portfolio.Blazor.Core.VigenereCipher.CleanKey(Key).Length == 0)
        {
            Output = "";
            ShowError = true;
            return;
        }
        ShowError = false;
        Output = Portfolio.Blazor.Core.VigenereCipher.Transform(Input, Key, decode);
    }

    private async Task CopyAsync() =>
        await JS.InvokeVoidAsync("navigator.clipboard.writeText", Output);
}
