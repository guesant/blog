using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class NatoPhoneticAlphabet
{
    private string CanonicalPath => RequestPath;
    private string _input = string.Empty;
    private string _alphabet = "nato";
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "input")]
    private string? QueryInput { get; set; }

    [SupplyParameterFromQuery(Name = "alphabet")]
    private string? QueryAlphabet { get; set; }
    private string Action => L["tools_nato_phonetic_alphabet"];
    private string Title => ToolsL["nato_phonetic_alphabet_title"];
    private string Description => ToolsL["nato_phonetic_alphabet_lead"];
    private string AlphabetLabel => L["alphabet"];
    private string NatoLabel => L["nato_icao_official"];
    private string BrazilianLabel => L["brazilian_informal"];
    private string GermanLabel => L["german"];
    private string InputLabel => L["input"];
    private string OutputLabel => L["output"];
    private string ConvertLabel => L["converter"];
    private string CopyLabel => L["copy"];
    private string Input
    {
        get => _input;
        set { _input = value; }
    }
    private string Alphabet
    {
        get => _alphabet;
        set => _alphabet = value;
    }
    private IReadOnlyList<SiteSelectOption> AlphabetOptions =>
        [new("nato", NatoLabel), new("brazilian", BrazilianLabel), new("german", GermanLabel)];
    private string Output => PhoneticAlphabetConverter.Convert(Input, Alphabet);

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _input = QueryInput ?? string.Empty;
        _alphabet = QueryAlphabet is "brazilian" or "german" ? QueryAlphabet : "nato";
        _queryInitialized = true;
    }
}
