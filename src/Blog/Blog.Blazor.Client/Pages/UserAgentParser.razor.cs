namespace Blog.Blazor.Client.Pages;

public partial class UserAgentParser
{
    private string CanonicalPath => RequestPath;
    private string CurrentUa = "",
        InputUa = "";
    private string Title => ToolsL["user_agent_parser_page_title"];
    private string Description => ToolsL["user_agent_parser_lead"];
    private string HeuristicNote => L["user_agent_note"];
    private string CurrentLabel => L["your_user_agent"];
    private string InputLabel => L["user_agent_to_parse"];
    private string BrowserLabel => L["browser"];
    private string OsLabel => L["operating_system"];
    private string EngineLabel => L["engine"];
    private string Browser => Detect(InputUa).Browser;
    private string Os => Detect(InputUa).Os;
    private string Engine => Detect(InputUa).Engine;

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!firstRender || !RendererInfo.IsInteractive)
            return;
        var module = await JS.InvokeAsync<IJSObjectReference>("import", "/browser-metadata.js");
        CurrentUa = await module.InvokeAsync<string>("getUserAgent");
        InputUa = CurrentUa;
        StateHasChanged();
    }

    private static (string Browser, string Os, string Engine) Detect(string ua)
    {
        if (string.IsNullOrWhiteSpace(ua))
            return ("-", "-", "-");
        var browser =
            ua.Contains("Edg/") ? "Edge"
            : ua.Contains("OPR/") ? "Opera"
            : ua.Contains("Firefox/") ? "Firefox"
            : ua.Contains("CriOS/") ? "Chrome (iOS)"
            : ua.Contains("Chrome/") ? "Chrome"
            : ua.Contains("Safari/") ? "Safari"
            : "-";
        var os =
            ua.Contains("Windows NT") ? "Windows"
            : ua.Contains("Android") ? "Android"
            : ua.Contains("iPhone") || ua.Contains("iPad") ? "iOS"
            : ua.Contains("Mac OS X") ? "macOS"
            : ua.Contains("Linux") ? "Linux"
            : "-";
        var engine =
            ua.Contains("Edg/") || ua.Contains("Chrome/") || ua.Contains("CriOS/") ? "Blink"
            : ua.Contains("Firefox/") ? "Gecko"
            : ua.Contains("AppleWebKit") ? "WebKit"
            : "-";
        return (browser, os, engine);
    }
}
