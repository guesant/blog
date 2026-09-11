namespace Portfolio.Blazor.UI.Templates;

public partial class SiteAppShell
{
    /// <summary>Brand/logo rendered inside the topbar header.</summary>
    [Parameter]
    public RenderFragment? Brand { get; set; }

    /// <summary>Mobile nav toggle button rendered inside the topbar header.</summary>
    [Parameter]
    public RenderFragment? Toggle { get; set; }

    /// <summary>Primary (left) sidebar.</summary>
    [Parameter]
    public RenderFragment? SidebarLeft { get; set; }

    /// <summary>Secondary (right) sidebar.</summary>
    [Parameter]
    public RenderFragment? SidebarRight { get; set; }

    /// <summary>Footer rendered after the page content, inside the scrolling wrapper.</summary>
    [Parameter]
    public RenderFragment? Footer { get; set; }

    /// <summary>The routed page. Unlike SiteAdminShell, this shell renders no &lt;main&gt; landmark of
    /// its own - ChildContent is expected to supply one itself (every real page does, via SitePage's
    /// own id="main-content" &lt;main&gt;). Adding a second &lt;main&gt; here would nest two main
    /// landmarks, which is invalid; the contract is enforced by convention, not by this component.</summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;
}
