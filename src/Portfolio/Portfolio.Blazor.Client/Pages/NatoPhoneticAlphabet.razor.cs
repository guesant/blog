using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

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
    private string Action => L["legacy_ce18e663885e"];
    private string Title => ToolsL["nato_phonetic_alphabet_title"];
    private string Description => ToolsL["nato_phonetic_alphabet_lead"];
    private string AlphabetLabel => L["legacy_ef3fb5024164"];
    private string NatoLabel => L["legacy_42e94e815b3b"];
    private string BrazilianLabel => L["legacy_5b0a0fa480c7"];
    private string GermanLabel => L["legacy_8ee70100fb30"];
    private string InputLabel => L["legacy_c4c61716670f"];
    private string OutputLabel => L["legacy_1d1c0e33dc3c"];
    private string ConvertLabel => L["legacy_ae125407093e"];
    private string CopyLabel => L["legacy_a3b71416a5f3"];
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
