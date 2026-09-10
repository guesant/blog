namespace Portfolio.Blazor.Core;

public sealed record ChemicalElement(string Symbol, string Name, int AtomicNumber, string Category);

public static class PeriodicTableReference
{
    public static IReadOnlyList<IReadOnlyList<string?>> Periods { get; } =
    [
        [
            "H",
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            "He",
        ],
        [
            "Li",
            "Be",
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            "B",
            "C",
            "N",
            "O",
            "F",
            "Ne",
        ],
        [
            "Na",
            "Mg",
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            "Al",
            "Si",
            "P",
            "S",
            "Cl",
            "Ar",
        ],
        [
            "K",
            "Ca",
            "Sc",
            "Ti",
            "V",
            "Cr",
            "Mn",
            "Fe",
            "Co",
            "Ni",
            "Cu",
            "Zn",
            "Ga",
            "Ge",
            "As",
            "Se",
            "Br",
            "Kr",
        ],
        [
            "Rb",
            "Sr",
            "Y",
            "Zr",
            "Nb",
            "Mo",
            "Tc",
            "Ru",
            "Rh",
            "Pd",
            "Ag",
            "Cd",
            "In",
            "Sn",
            "Sb",
            "Te",
            "I",
            "Xe",
        ],
        [
            "Cs",
            "Ba",
            "La",
            "Hf",
            "Ta",
            "W",
            "Re",
            "Os",
            "Ir",
            "Pt",
            "Au",
            "Hg",
            "Tl",
            "Pb",
            "Bi",
            "Po",
            "At",
            "Rn",
        ],
        [
            "Fr",
            "Ra",
            "Ac",
            "Rf",
            "Db",
            "Sg",
            "Bh",
            "Hs",
            "Mt",
            "Ds",
            "Rg",
            "Cn",
            "Nh",
            "Fl",
            "Mc",
            "Lv",
            "Ts",
            "Og",
        ],
    ];
    public static IReadOnlyList<IReadOnlyList<string>> Series { get; } =
    [
        ["La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu"],
        ["Ac", "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr"],
    ];
    private static readonly IReadOnlyDictionary<string, string> Names =
        "H:Hydrogen|He:Helium|Li:Lithium|Be:Beryllium|B:Boron|C:Carbon|N:Nitrogen|O:Oxygen|F:Fluorine|Ne:Neon|Na:Sodium|Mg:Magnesium|Al:Aluminium|Si:Silicon|P:Phosphorus|S:Sulfur|Cl:Chlorine|Ar:Argon|K:Potassium|Ca:Calcium|Sc:Scandium|Ti:Titanium|V:Vanadium|Cr:Chromium|Mn:Manganese|Fe:Iron|Co:Cobalt|Ni:Nickel|Cu:Copper|Zn:Zinc|Ga:Gallium|Ge:Germanium|As:Arsenic|Se:Selenium|Br:Bromine|Kr:Krypton|Rb:Rubidium|Sr:Strontium|Y:Yttrium|Zr:Zirconium|Nb:Niobium|Mo:Molybdenum|Tc:Technetium|Ru:Ruthenium|Rh:Rhodium|Pd:Palladium|Ag:Silver|Cd:Cadmium|In:Indium|Sn:Tin|Sb:Antimony|Te:Tellurium|I:Iodine|Xe:Xenon|Cs:Caesium|Ba:Barium|La:Lanthanum|Ce:Cerium|Pr:Praseodymium|Nd:Neodymium|Pm:Promethium|Sm:Samarium|Eu:Europium|Gd:Gadolinium|Tb:Terbium|Dy:Dysprosium|Ho:Holmium|Er:Erbium|Tm:Thulium|Yb:Ytterbium|Lu:Lutetium|Hf:Hafnium|Ta:Tantalum|W:Tungsten|Re:Rhenium|Os:Osmium|Ir:Iridium|Pt:Platinum|Au:Gold|Hg:Mercury|Tl:Thallium|Pb:Lead|Bi:Bismuth|Po:Polonium|At:Astatine|Rn:Radon|Fr:Francium|Ra:Radium|Ac:Actinium|Th:Thorium|Pa:Protactinium|U:Uranium|Np:Neptunium|Pu:Plutonium|Am:Americium|Cm:Curium|Bk:Berkelium|Cf:Californium|Es:Einsteinium|Fm:Fermium|Md:Mendelevium|No:Nobelium|Lr:Lawrencium|Rf:Rutherfordium|Db:Dubnium|Sg:Seaborgium|Bh:Bohrium|Hs:Hassium|Mt:Meitnerium|Ds:Darmstadtium|Rg:Roentgenium|Cn:Copernicium|Nh:Nihonium|Fl:Flerovium|Mc:Moscovium|Lv:Livermorium|Ts:Tennessine|Og:Oganesson"
            .Split('|')
            .Select(item => item.Split(':'))
            .ToDictionary(item => item[0], item => item[1]);
    private static readonly IReadOnlyDictionary<string, int> AtomicNumbers = Periods
        .SelectMany(row => row)
        .Where(symbol => symbol is not null)
        .Concat(Series.SelectMany(row => row))
        .Distinct()
        .Select((symbol, index) => (symbol!, index + 1))
        .ToDictionary(item => item.Item1, item => item.Item2);
    public static IReadOnlyList<ChemicalElement> All { get; } =
        AtomicNumbers
            .Select(item => new ChemicalElement(
                item.Key,
                Names[item.Key],
                item.Value,
                Category(item.Key, item.Value)
            ))
            .OrderBy(element => element.AtomicNumber)
            .ToArray();

    public static IReadOnlyList<ChemicalElement> Filter(string? query)
    {
        var value = query?.Trim() ?? string.Empty;
        return string.IsNullOrEmpty(value)
            ? All
            : All.Where(element =>
                    $"{element.Symbol} {element.Name}".Contains(
                        value,
                        StringComparison.OrdinalIgnoreCase
                    )
                )
                .ToArray();
    }

    public static string Category(string symbol, int atomicNumber) =>
        new[] { "He", "Ne", "Ar", "Kr", "Xe", "Rn", "Og" }.Contains(symbol) ? "noble-gas"
        : new[] { "F", "Cl", "Br", "I", "At", "Ts" }.Contains(symbol) ? "halogen"
        : atomicNumber is >= 57 and <= 71 ? "lanthanide"
        : atomicNumber is >= 89 and <= 103 ? "actinide"
        : new[] { 3, 11, 19, 37, 55, 87 }.Contains(atomicNumber) ? "alkali"
        : new[] { 4, 12, 20, 38, 56, 88 }.Contains(atomicNumber) ? "alkaline-earth"
        : atomicNumber is >= 21 and <= 30
        || atomicNumber is >= 39 and <= 48
        || atomicNumber is >= 72 and <= 80
        || atomicNumber >= 104
            ? "transition"
        : "other";
}
