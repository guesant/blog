namespace Portfolio.Blazor.Client.Pages;

public partial class ColorWheel
{
    private string CanonicalPath => RequestPath;
    private string Title => ToolsL["color_wheel_title"];
    private string Description => ToolsL["color_wheel_lead"];
    private string RuleLabel => L["legacy_3b6b27b2113b"];
    private string ModelLabel => L["legacy_68cbff4273ac"];
    private string RandomLabel => L["legacy_923b5b9bffec"];
    private string UndoLabel => L["legacy_b96bddce9abc"];
    private string RedoLabel => L["legacy_ace12f80f2b6"];
    private string BrightnessLabel => L["legacy_b1ae7c65f6f8"];
    private string MarkerLabel => L["legacy_38be59f205d4"];
    private string InvalidHexLabel => L["legacy_c9a53ad44b88"];
    private string InvalidChannelLabel => L["legacy_a762d3e06997"];
    private string PaletteLabel => L["legacy_3eb05d64a378"];
    private string SelectLabel => L["legacy_de35a6bb3a7b"];
    private string LockLabel => L["legacy_959e178a4437"];
    private string LockedLabel => L["legacy_5f17f726980d"];
    private string CopiedLabel => L["legacy_7f04c2f80c0b"];
    private string ExportJsonLabel => L["legacy_60f3fcc95b22"];
    private string ExportCssLabel => L["legacy_f8323d82a626"];
    private string ExportPngLabel => L["legacy_93ed0b8d9e10"];
    private string ContrastLabel => L["legacy_0640f92c435b"];
    private string PassLabel => L["legacy_f0056f71363c"];
    private string FailLabel => L["legacy_5e71c00fbbba"];
    private string ColorblindLabel => L["legacy_6a710c43cfa3"];
    private string ExtractLabel => L["legacy_1fcf5ae2ac0f"];
    private string ExtractFileLabel => L["legacy_3b8448ad31bd"];
    private string ExtractCountLabel => L["legacy_807af1f672e6"];
    private string SaveLabel => L["legacy_1daa54dee504"];
    private string SaveNameLabel => L["legacy_a5365aecffee"];
    private string SaveTagsLabel => L["legacy_9cd2abdd0672"];
    private string SaveTagsPlaceholder => L["legacy_c24b0cd84a8c"];
    private string SaveButtonLabel => L["legacy_c3079adaed4c"];
    private string SavedLabel => L["legacy_968b50230654"];
    private string SearchLabel => L["legacy_999da25ad2ff"];
    private string DeleteLabel => L["legacy_1fa1bcd5710b"];
    private string NoSavedLabel => L["legacy_950e3cf78dd7"];

    private string RuleText(string rule) => L[$"color_rule_{rule}"];

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            await JS.InvokeVoidAsync("import", "/color-wheel.js");
        }
    }
}
