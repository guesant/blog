namespace Blog.Blazor.Client.Pages;

public partial class ColorWheel
{
    private string CanonicalPath => RequestPath;
    private string Title => ToolsL["color_wheel_title"];
    private string Description => ToolsL["color_wheel_lead"];
    private string RuleLabel => L["harmony_rule"];
    private string ModelLabel => L["model"];
    private string RandomLabel => L["random"];
    private string UndoLabel => L["undo"];
    private string RedoLabel => L["redo"];
    private string BrightnessLabel => L["brightness"];
    private string MarkerLabel => L["color_marker"];
    private string InvalidHexLabel => L["invalid_hex_color"];
    private string InvalidChannelLabel => L["value_out_of_range"];
    private string PaletteLabel => L["palette"];
    private string SelectLabel => L["select"];
    private string LockLabel => L["lock"];
    private string LockedLabel => L["locked"];
    private string CopiedLabel => L["copied"];
    private string ExportJsonLabel => L["export_json"];
    private string ExportCssLabel => L["export_css"];
    private string ExportPngLabel => L["export_png"];
    private string ContrastLabel => L["contrast_between_palette_colors"];
    private string PassLabel => L["pass"];
    private string FailLabel => L["fail"];
    private string ColorblindLabel => L["colorblindness_preview"];
    private string ExtractLabel => L["extract_palette_from_an_image"];
    private string ExtractFileLabel => L["image_file"];
    private string ExtractCountLabel => L["colors"];
    private string SaveLabel => L["save_this_palette"];
    private string SaveNameLabel => L["name"];
    private string SaveTagsLabel => L["tags"];
    private string SaveTagsPlaceholder => L["design_brand"];
    private string SaveButtonLabel => L["save"];
    private string SavedLabel => L["saved_palettes"];
    private string SearchLabel => L["search"];
    private string DeleteLabel => L["delete"];
    private string NoSavedLabel => L["no_saved_palettes"];

    private string RuleText(string rule) => L[$"color_rule_{rule}"];

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            await JS.InvokeVoidAsync("import", "/color-wheel.js");
        }
    }
}
