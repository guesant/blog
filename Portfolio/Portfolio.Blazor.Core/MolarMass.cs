namespace Portfolio.Blazor.Core;

public enum MolarMassError
{
    None,
    EmptyFormula,
    InvalidFormula,
    UnknownElement,
}

public readonly record struct ElementComposition(
    string Symbol,
    int AtomCount,
    double Mass,
    double Percentage
);

public readonly record struct MolarMassResult(
    bool IsValid,
    double MolarMass,
    IReadOnlyList<ElementComposition> Composition,
    MolarMassError Error = MolarMassError.None
);

public static class MolarMassCalculator
{
    private static readonly IReadOnlyDictionary<string, double> AtomicMasses = new Dictionary<
        string,
        double
    >(StringComparer.Ordinal)
    {
        ["H"] = 1.008,
        ["He"] = 4.0026,
        ["C"] = 12.011,
        ["N"] = 14.007,
        ["O"] = 15.999,
        ["F"] = 18.998,
        ["Na"] = 22.990,
        ["Mg"] = 24.305,
        ["Al"] = 26.982,
        ["Si"] = 28.085,
        ["P"] = 30.974,
        ["S"] = 32.06,
        ["Cl"] = 35.45,
        ["K"] = 39.098,
        ["Ca"] = 40.078,
        ["Fe"] = 55.845,
        ["Cu"] = 63.546,
        ["Zn"] = 65.38,
        ["Ag"] = 107.868,
        ["I"] = 126.904,
        ["Ba"] = 137.327,
        ["Hg"] = 200.592,
        ["Pb"] = 207.2,
    };

    public static MolarMassResult Calculate(string? formula)
    {
        if (string.IsNullOrWhiteSpace(formula))
        {
            return Invalid(MolarMassError.EmptyFormula);
        }

        var parser = new FormulaParser(formula.Trim());
        if (!parser.TryParse(out var counts, out var error))
        {
            return Invalid(error);
        }

        var totalMass = counts.Sum(entry => AtomicMasses[entry.Key] * entry.Value);
        var composition = counts
            .OrderBy(entry => entry.Key, StringComparer.Ordinal)
            .Select(entry => new ElementComposition(
                entry.Key,
                entry.Value,
                AtomicMasses[entry.Key] * entry.Value,
                AtomicMasses[entry.Key] * entry.Value / totalMass * 100
            ))
            .ToArray();

        return new MolarMassResult(true, totalMass, composition);
    }

    private static MolarMassResult Invalid(MolarMassError error) =>
        new(false, double.NaN, [], error);

    private sealed class FormulaParser(string formula)
    {
        private readonly string _formula = formula;
        private int _index;

        public bool TryParse(out Dictionary<string, int> counts, out MolarMassError error)
        {
            counts = new Dictionary<string, int>(StringComparer.Ordinal);
            error = MolarMassError.None;
            if (
                !ParseGroup(counts, closing: null, ref error)
                || _index != _formula.Length
                || counts.Count == 0
            )
            {
                error = error == MolarMassError.None ? MolarMassError.InvalidFormula : error;
                return false;
            }

            return true;
        }

        private bool ParseGroup(
            Dictionary<string, int> counts,
            char? closing,
            ref MolarMassError error
        )
        {
            var parsedElement = false;
            while (_index < _formula.Length)
            {
                var current = _formula[_index];
                if (current == ')')
                {
                    if (closing is null)
                    {
                        error = MolarMassError.InvalidFormula;
                        return false;
                    }

                    _index++;
                    return parsedElement;
                }

                if (current == '(')
                {
                    _index++;
                    var nested = new Dictionary<string, int>(StringComparer.Ordinal);
                    if (!ParseGroup(nested, ')', ref error))
                    {
                        return false;
                    }

                    var multiplier = ReadCount(ref error);
                    if (multiplier == 0)
                    {
                        return false;
                    }

                    foreach (var (nestedSymbol, nestedCount) in nested)
                    {
                        Add(counts, nestedSymbol, nestedCount * multiplier);
                    }

                    parsedElement = true;
                    continue;
                }

                if (!char.IsUpper(current))
                {
                    error = MolarMassError.InvalidFormula;
                    return false;
                }

                var start = _index++;
                if (_index < _formula.Length && char.IsLower(_formula[_index]))
                {
                    _index++;
                }

                var symbol = _formula[start.._index];
                if (!AtomicMasses.ContainsKey(symbol))
                {
                    error = MolarMassError.UnknownElement;
                    return false;
                }

                var count = ReadCount(ref error);
                if (count == 0)
                {
                    return false;
                }

                Add(counts, symbol, count);
                parsedElement = true;
            }

            if (closing is not null)
            {
                error = MolarMassError.InvalidFormula;
                return false;
            }

            return parsedElement;
        }

        private int ReadCount(ref MolarMassError error)
        {
            var start = _index;
            while (_index < _formula.Length && char.IsDigit(_formula[_index]))
            {
                _index++;
            }

            if (start == _index)
            {
                return 1;
            }

            return int.TryParse(_formula[start.._index], out var count) && count > 0
                ? count
                : SetInvalid(ref error);
        }

        private static int SetInvalid(ref MolarMassError error)
        {
            error = MolarMassError.InvalidFormula;
            return 0;
        }

        private static void Add(Dictionary<string, int> counts, string symbol, int count)
        {
            counts[symbol] = counts.GetValueOrDefault(symbol) + count;
        }
    }
}
