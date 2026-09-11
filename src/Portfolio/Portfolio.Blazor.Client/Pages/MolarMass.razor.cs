using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class MolarMass
{
    private string CanonicalPath => RequestPath;
    private string _formula = "Ca(OH)2";
    private MolarMassResult _result = MolarMassCalculator.Calculate("Ca(OH)2");
    private bool _queryInitialized;
    private bool _compositionTablePending;
    private readonly Debouncer _debouncer = new(TimeSpan.FromMilliseconds(300));

    [SupplyParameterFromQuery(Name = "formula")]
    private string? QueryFormula { get; set; }
    private string Action => L["legacy_9d2cd72a69f5"];
    private string Title => ToolsL["molar_mass_title"];
    private string Description => ToolsL["molar_mass_lead"];
    private string InputLabel => L["legacy_bd3ca9b280a6"];
    private string SubmitLabel => L["legacy_53519f340509"];
    private string ResultLabel => L["legacy_23470bef125e"];
    private string MolarMassLabel => L["molar_mass_label"];
    private string CompositionLabel => L["legacy_acf22d5a00b1"];
    private string ElementLabel => L["legacy_802482317f1f"];
    private string AtomsLabel => L["legacy_8ef8342700be"];
    private string PercentageLabel => L["legacy_316a40c7bd0b"];
    private string CompositionTableId => L["legacy_21df82a5bf74"];
    private string ErrorMessage =>
        Result.Error switch
        {
            MolarMassError.EmptyFormula => L["legacy_7403a7a28707"],
            MolarMassError.UnknownElement => L["legacy_6a76b322c1d4"],
            _ => L["legacy_4935bfa283db"],
        };
    private string Formula
    {
        get => _formula;
        set
        {
            _formula = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private MolarMassResult Result => _result;

    protected override void OnParametersSet()
    {
        if (!_queryInitialized)
        {
            _formula = QueryFormula ?? _formula;
            Recalculate();
            _queryInitialized = true;
        }
    }

    private void HandleSubmit() => Recalculate();

    private void Recalculate()
    {
        _result = MolarMassCalculator.Calculate(_formula);
        _compositionTablePending = true;
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (RendererInfo.IsInteractive && _compositionTablePending && Result.IsValid)
        {
            _compositionTablePending = false;
            var rows = Result
                .Composition.Select(element =>
                    new[]
                    {
                        element.Symbol,
                        element.AtomCount.ToString(),
                        $"{Format(element.Percentage)}%",
                    }
                )
                .ToArray();
            await JS.InvokeVoidAsync(
                "tableEditor.initializeTabulator",
                CompositionTableId,
                new[] { ElementLabel, AtomsLabel, PercentageLabel },
                rows
            );
        }
    }

    private static string Format(double value) =>
        value.ToString("N3", CultureInfo.InvariantCulture);

    public void Dispose()
    {
        _debouncer.Dispose();
        GC.SuppressFinalize(this);
    }
}
