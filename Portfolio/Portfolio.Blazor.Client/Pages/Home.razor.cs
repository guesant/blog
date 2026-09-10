namespace Portfolio.Blazor.Client.Pages;

public partial class Home
{
    [SupplyParameterFromQuery(Name = "kind")]
    private string? QueryKind { get; set; }

    [SupplyParameterFromQuery(Name = "topic")]
    private string? QueryTopic { get; set; }

    [SupplyParameterFromQuery(Name = "q")]
    private string? QuerySearch { get; set; }

    [SupplyParameterFromQuery(Name = "sort")]
    private string? QuerySort { get; set; }

    [SupplyParameterFromQuery(Name = "view")]
    private string? QueryView { get; set; }

    [SupplyParameterFromQuery(Name = "page")]
    private int? QueryPage { get; set; }
}
