using System.Globalization;
using System.Resources;
using Portfolio.Blazor.Core;
using Portfolio.Blazor.Core.Localization;

var cultures = new CultureCatalog();
if (
    !cultures.IsSupported("en")
    || !cultures.IsSupported("pt-BR")
    || cultures.IsSupported("fr")
    || cultures.Normalize("fr").Name != "en"
)
    throw new InvalidOperationException("culture catalog check failed");
var urls = new LocalizedUrlBuilder(cultures);
if (
    urls.ForCulture("/writing?sort=asc", "pt-BR") != "/pt-BR/writing?sort=asc"
    || urls.ForCulture("/pt-BR/writing?sort=asc", "en") != "/writing?sort=asc"
    || urls.SwitchCulture("https://example.test/pt-BR/writing?sort=asc", "en")
        != "/writing?sort=asc"
)
    throw new InvalidOperationException("localized URL check failed");

foreach (
    var resourceType in new[]
    {
        typeof(SharedResource),
        typeof(NavigationResource),
        typeof(ToolsResource),
        typeof(ContentResource),
        typeof(ValidationResource),
    }
)
{
    var manager = new ResourceManager(resourceType);
    var neutral = manager.GetResourceSet(CultureInfo.GetCultureInfo("en"), true, true);
    var portuguese = manager.GetResourceSet(CultureInfo.GetCultureInfo("pt-BR"), true, true);
    var neutralKeys =
        neutral
            ?.Cast<System.Collections.DictionaryEntry>()
            .Select(entry => (string)entry.Key)
            .ToHashSet(StringComparer.Ordinal)
        ?? [];
    var portugueseKeys =
        portuguese
            ?.Cast<System.Collections.DictionaryEntry>()
            .Select(entry => (string)entry.Key)
            .ToHashSet(StringComparer.Ordinal)
        ?? [];
    if (!neutralKeys.SetEquals(portugueseKeys))
        throw new InvalidOperationException(
            $"resource parity check failed for {resourceType.Name}"
        );
}

AssertStatistics(string.Empty, new TextStatistics(0, 0, 0, 0, 0, 0));

AssertStatistics("hello world!\nsecond line", new TextStatistics(24, 21, 4, 2, 2, 1));

AssertStatistics("one\n\ntwo", new TextStatistics(8, 6, 2, 1, 3, 2));

AssertStatistics("Olá 👋", new TextStatistics(6, 5, 2, 1, 1, 1));

var realRoots = QuadraticEquationSolver.Solve(1, -5, 6);
if (
    !realRoots.IsValid
    || realRoots.Discriminant != 1
    || realRoots.Root1.Real != 3
    || realRoots.Root2.Real != 2
)
{
    throw new InvalidOperationException("quadratic real roots check failed");
}

var complexRoots = QuadraticEquationSolver.Solve(1, 0, 1);
if (
    !complexRoots.IsValid
    || !complexRoots.HasComplexRoots
    || complexRoots.Root1.Real != 0
    || complexRoots.Root1.Imaginary != 1
)
{
    throw new InvalidOperationException("quadratic complex roots check failed");
}

var invalidQuadratic = QuadraticEquationSolver.Solve(0, 2, 1);
if (
    invalidQuadratic.IsValid
    || invalidQuadratic.Error != QuadraticEquationError.ZeroLeadingCoefficient
)
{
    throw new InvalidOperationException("quadratic validation check failed");
}

var mathTools = ToolCatalog.Filter(string.Empty, "math");
var expectedMathTools = ToolCatalog.All.Count(tool =>
    tool.Category.Equals("math", StringComparison.OrdinalIgnoreCase)
);
if (
    ToolCatalog.Filter("equação", string.Empty).Count != 1
    || mathTools.Count != expectedMathTools
    || mathTools.Any(tool => !tool.Category.Equals("math", StringComparison.OrdinalIgnoreCase))
)
{
    throw new InvalidOperationException("tool catalog filter check failed");
}

var combinatorics = CombinatoricsCalculator.Calculate(5, 2);
if (
    !combinatorics.IsValid
    || combinatorics.Factorial != 120
    || combinatorics.Permutation != 20
    || combinatorics.Combination != 10
)
{
    throw new InvalidOperationException("combinatorics check failed");
}

var sequences = SequenceCalculator.Calculate(2, 3, .5, 5);
if (
    !sequences.IsValid
    || sequences.ArithmeticTerm != 14
    || sequences.ArithmeticSum != 40
    || Math.Round(sequences.InfiniteGeometricSum ?? 0, 6) != 4
)
{
    throw new InvalidOperationException("sequences check failed");
}

var baseConversion = BaseConversionCalculator.Convert("FF", 16, 2);
if (
    !baseConversion.IsValid
    || baseConversion.Output != "11111111"
    || BaseConversionCalculator.Convert("2", 2, 10).IsValid
)
{
    throw new InvalidOperationException("base conversion check failed");
}

var numberBases = NumberBaseConversionCalculator.Convert("0xff", 0);
if (
    !numberBases.IsValid
    || numberBases.Binary != "11111111"
    || numberBases.Octal != "377"
    || numberBases.Decimal != "255"
    || numberBases.Hexadecimal != "FF"
)
    throw new InvalidOperationException("number base conversion check failed");
if (
    NumberBaseConversionCalculator.Convert("0b102", 0).IsValid
    || NumberBaseConversionCalculator.Convert("101", 2).Decimal != "5"
)
    throw new InvalidOperationException("number base validation check failed");

var encoded = TextCodecs.Transform("base64-encoder", "Olá", "encode");
if (
    !encoded.IsValid
    || TextCodecs.Transform("base64-encoder", encoded.Output, "decode").Output != "Olá"
    || TextCodecs.Transform("hex-text-codec", "Olá", "encode").Output != "4f 6c c3 a1"
    || TextCodecs.Transform("hex-text-codec", "4f 6c c3 a1", "decode").Output != "Olá"
    || TextCodecs.Transform("url-encoder", "a b", "encode").Output != "a%20b"
    || TextCodecs.Transform("base64-encoder", "%%%", "decode").IsValid
)
    throw new InvalidOperationException("text codec check failed");

var randomNumbers = RandomNumberTools.GenerateNumbers(1, 3, 10, "integer", true);
if (randomNumbers.Values.Count != 3 || randomNumbers.Values.Distinct().Count() != 3)
    throw new InvalidOperationException("random number check failed");
var randomStrings = RandomNumberTools.GenerateStrings(16, 3, true, false, false, false);
if (
    randomStrings.Values.Count != 3
    || randomStrings.Values.Any(value => value.Length != 16 || value.Any(c => c is < 'a' or > 'z'))
    || RandomNumberTools.GenerateStrings(4, 1, false, false, false, false).Error is null
)
    throw new InvalidOperationException("random string check failed");
var randomDates = RandomNumberTools.GenerateDates(
    new DateTime(2024, 1, 1),
    new DateTime(2024, 1, 3),
    4,
    false
);
if (randomDates.Values.Count != 4 || randomDates.Values.Any(value => value.Length != 10))
    throw new InvalidOperationException("random date check failed");
var names = RandomNumberTools.GenerateNames(3, true, true);
if (
    names.Values.Count != 3
    || names.Values.Any(value => !value.Contains(" - ") || !value.Contains("@example.com"))
)
    throw new InvalidOperationException("fake name check failed");
var palette = RandomNumberTools.GenerateColorPalette(5);
if (
    palette.Values.Count != 5
    || palette.Values.Any(value =>
        !System.Text.RegularExpressions.Regex.IsMatch(value, "^#[0-9a-f]{6}$")
    )
)
    throw new InvalidOperationException("color palette check failed");
var password = RandomNumberTools.GeneratePassword(16, true, true, true, true);
if (
    password.Value.Length != 16
    || password.StrengthBits <= 0
    || password.StrengthPercent <= 0
    || RandomNumberTools.GeneratePassword(16, false, false, false, false).Value != ""
)
    throw new InvalidOperationException("password generator check failed");
var uuids = RandomNumberTools.GenerateUuids(3);
if (uuids.Count != 3 || uuids.Any(value => !Guid.TryParse(value, out _)))
    throw new InvalidOperationException("UUID generator check failed");
if (
    RomanNumerals.ToRoman(2024) != "MMXXIV"
    || RomanNumerals.FromRoman("MMXXIV") != 2024
    || RomanNumerals.FromRoman("IIII") is not null
    || RomanNumerals.ToRoman(4000) != ""
)
    throw new InvalidOperationException("Roman numeral check failed");
var timestamp = TimestampConversion.FromTimestamp("1735689600");
if (
    !timestamp.IsValid
    || !timestamp.Utc.StartsWith("2025-01-01 00:00:00", StringComparison.Ordinal)
    || TimestampConversion.FromDate(new DateTime(2025, 1, 1)).TimestampFromDate != "1735689600"
    || TimestampConversion.FromTimestamp("abc").IsValid
)
    throw new InvalidOperationException("timestamp conversion check failed");
var query = QueryStringTools.Parse("https://example.com/?foo=bar&foo=baz+qux");
if (
    query.Parameters.Count != 2
    || query.Parameters[1].Value != "baz qux"
    || QueryStringTools.Build(query.Parameters) != "foo=bar&foo=baz+qux"
)
    throw new InvalidOperationException("query string check failed");
var hashes = HashTools.Calculate("hello");
if (
    hashes.Sha256 != "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
    || hashes.Sha1.Length != 40
    || hashes.Sha512.Length != 128
)
    throw new InvalidOperationException("hash generator check failed");
var dateDifference = DateDifferenceCalculator.Calculate(
    new DateOnly(2024, 1, 31),
    new DateOnly(2025, 3, 1)
);
if (
    !dateDifference.IsValid
    || dateDifference.TotalDays != 395
    || dateDifference.Years != 1
    || dateDifference.Months != 1
    || dateDifference.Days != -2
    || !DateDifferenceCalculator
        .Calculate(new DateOnly(2025, 1, 1), new DateOnly(2024, 1, 1))
        .Reversed
)
    throw new InvalidOperationException("date difference check failed");
var morse = MorseCode.Transform("SOS 2!", "encode");
if (
    !morse.IsValid
    || morse.Output != "... --- ... / ..--- -.-.--"
    || MorseCode.Transform(morse.Output, "decode").Output != "SOS 2!"
    || MorseCode.Transform("... --- invalid", "decode").IsValid
)
    throw new InvalidOperationException("Morse code check failed");

var fraction = FractionCalculator.Calculate("1/2", '+', "1/6");
if (
    !fraction.IsValid
    || fraction.Value.ToString() != "2/3"
    || FractionCalculator.Simplify("-4/-8").Value.ToString() != "1/2"
)
{
    throw new InvalidOperationException("fraction check failed");
}

var linear = LinearSystemCalculator.Solve(
    new[,]
    {
        { 2d, 1d },
        { 1d, -1d },
    },
    [7, 1]
);
if (
    !linear.IsValid
    || Math.Abs(linear.Solution[0] - 8 / 3d) > 1e-9
    || Math.Abs(linear.Solution[1] - 5 / 3d) > 1e-9
    || LinearSystemCalculator
        .Solve(
            new[,]
            {
                { 1d, 2d },
                { 2d, 4d },
            },
            [1, 2]
        )
        .IsValid
)
{
    throw new InvalidOperationException("linear systems check failed");
}

var percentage = PercentageCalculator.Calculate(240, 15);
if (!percentage.IsValid || percentage.Result != 36)
{
    throw new InvalidOperationException("percentage check failed");
}

if (
    TextUtilityCalculator.Transform("Olá, mundo!", TextUtilityMode.RemoveAccents).Output
        != "Ola, mundo!"
    || TextUtilityCalculator.Transform("Hello\nworld", TextUtilityMode.RemoveLineBreaks).Output
        != "Hello world"
    || TextUtilityCalculator.Transform("A\nB\nA", TextUtilityMode.RemoveDuplicateLines).Output
        != "A\nB"
    || TextUtilityCalculator.Transform("Olá, mundo!", TextUtilityMode.Slugify).Output != "ola-mundo"
    || TextUtilityCalculator.Transform("ab", TextUtilityMode.Reverse).Output != "ba"
)
{
    throw new InvalidOperationException("text utilities check failed");
}

var gcdLcm = GcdLcmCalculator.Calculate(84, 30);
if (!gcdLcm.IsValid || gcdLcm.Gcd != 6 || gcdLcm.Lcm != 420)
{
    throw new InvalidOperationException("GCD/LCM check failed");
}

var primeFactors = PrimeFactorizationCalculator.Factor(360);
if (!primeFactors.IsValid || !primeFactors.Factors.SequenceEqual([2, 2, 2, 3, 3, 5]))
{
    throw new InvalidOperationException("prime factorization check failed");
}

var correlation = CorrelationCalculator.Analyze("1 2 3 4", "2 4 6 8");
if (
    !correlation.IsValid
    || Math.Round(correlation.Correlation, 6) != 1
    || Math.Round(correlation.Slope, 6) != 2
    || Math.Round(correlation.Intercept, 6) != 0
)
{
    throw new InvalidOperationException("correlation check failed");
}

if (CorrelationCalculator.Analyze("1 2 3", "1 2").Error != CorrelationError.MismatchedLengths)
{
    throw new InvalidOperationException("correlation validation check failed");
}

var kinematics = PhysicsCalculator.Kinematics(5, 2, 3);
if (!kinematics.IsValid || kinematics.FinalVelocity != 11 || kinematics.Displacement != 24)
{
    throw new InvalidOperationException("kinematics check failed");
}

var newton = PhysicsCalculator.NewtonsSecondLaw(4, 3);
if (!newton.IsValid || newton.Force != 12)
{
    throw new InvalidOperationException("Newton law check failed");
}

var gas = PhysicsCalculator.IdealGas(null, 0.024, 1, 300);
if (!gas.IsValid || Math.Round(gas.Pressure, 3) != 103930.783)
{
    throw new InvalidOperationException("ideal gas check failed");
}

var wave = PhysicsCalculator.Wave(null, 440, 0.775);
if (!wave.IsValid || Math.Round(wave.Speed, 3) != 341)
{
    throw new InvalidOperationException("wave check failed");
}

var projectile = PhysicsCalculator.Projectile(20, 45);
if (
    !projectile.IsValid
    || Math.Round(projectile.Range, 3) != Math.Round(400 / 9.80665, 3)
    || projectile.Trajectory.Count != 21
)
{
    throw new InvalidOperationException("projectile check failed");
}

var circular = PhysicsCalculator.CircularMotion(2, 4, 3);
if (
    !circular.IsValid
    || circular.AngularVelocity != 2
    || Math.Round(circular.Period, 6) != Math.Round(Math.PI, 6)
    || circular.CentripetalAcceleration != 8
    || circular.Force != 24
)
{
    throw new InvalidOperationException("circular motion check failed");
}

var mechanicalEnergy = PhysicsCalculator.MechanicalEnergy(2, 5, 3);
if (
    !mechanicalEnergy.IsValid
    || mechanicalEnergy.KineticEnergy != 25
    || Math.Round(mechanicalEnergy.PotentialEnergy, 3) != 58.84
    || Math.Round(mechanicalEnergy.TotalEnergy, 3) != 83.84
)
{
    throw new InvalidOperationException("mechanical energy check failed");
}

var sensibleHeat = PhysicsCalculator.SensibleHeat(2, 4, 10);
if (
    !sensibleHeat.IsValid
    || sensibleHeat.Heat != 80
    || PhysicsCalculator.SensibleHeat(-1, 4, 10).IsValid
)
{
    throw new InvalidOperationException("sensible heat check failed");
}

var seriesResistance = EngineeringCalculator.EquivalentResistance([100, 220, 330], "series");
var parallelResistance = EngineeringCalculator.EquivalentResistance([100, 220, 330], "parallel");
if (
    !seriesResistance.IsValid
    || seriesResistance.Resistance != 650
    || !parallelResistance.IsValid
    || Math.Round(parallelResistance.Resistance, 3) != 56.897
)
{
    throw new InvalidOperationException("equivalent resistance check failed");
}

var complex = ComplexNumberCalculator.Calculate("3+4i", "1-2i", "multiply");
if (
    !complex.IsValid
    || complex.Value.Real != 11
    || complex.Value.Imaginary != -2
    || Math.Round(complex.Magnitude, 6) != Math.Round(Math.Sqrt(125), 6)
    || ComplexNumberCalculator.Calculate("1", "0", "divide").IsValid
)
{
    throw new InvalidOperationException("complex number check failed");
}

var dilution = ChemistryCalculator.Dilution(1, 10, 0.2, null);
if (!dilution.IsValid || dilution.V2 != 50)
{
    throw new InvalidOperationException("dilution check failed");
}

var ph = ChemistryCalculator.Ph(0.001);
if (!ph.IsValid || Math.Round(ph.Ph, 6) != 3 || Math.Round(ph.Poh, 6) != 11)
{
    throw new InvalidOperationException("pH check failed");
}

var amortization = AmortizationCalculator.Calculate(10000, 12, 12, AmortizationMethod.Price);
if (!amortization.IsValid || Math.Round(amortization.TotalPaid, 2) != 10661.85)
{
    throw new InvalidOperationException("amortization check failed");
}

var table = CsvTable.Parse("name,value\nalpha,10\n\"beta, two\",20");
if (
    table.Count != 3
    || table[2][0] != "beta, two"
    || !CsvTable.Serialize(table).Contains("\"beta, two\",20", StringComparison.Ordinal)
)
{
    throw new InvalidOperationException("CSV table check failed");
}

var cleanedData = DataCleaner.Clean(
    "name, value\n alpha, 10\n\n beta, 20\n beta, 20",
    true,
    true,
    true
);
if (
    !cleanedData.IsValid
    || cleanedData.InputRows != 5
    || cleanedData.OutputRows != 3
    || cleanedData.EmptyRowsRemoved != 1
    || cleanedData.DuplicateRowsRemoved != 1
    || !cleanedData.Output.Contains("alpha,10", StringComparison.Ordinal)
    || cleanedData.Output.Split("beta,20", StringSplitOptions.None).Length - 1 != 1
)
{
    throw new InvalidOperationException("data cleaner check failed");
}

var markdown = MarkdownRenderer.ToHtml("# Title\n\n- one\n- two\n\n<script>alert(1)</script>");
if (
    !markdown.Contains("<h1>Title</h1>", StringComparison.Ordinal)
    || !markdown.Contains("<ul>", StringComparison.Ordinal)
    || markdown.Contains("<script>", StringComparison.Ordinal)
)
{
    throw new InvalidOperationException("markdown rendering safety check failed");
}

var formattedJson = DataConverter.FormatJson("{\"ok\":true}");
if (
    !formattedJson.IsValid
    || !formattedJson.Output.Contains("\"ok\": true", StringComparison.Ordinal)
)
{
    throw new InvalidOperationException("JSON formatter check failed");
}

var jsonCsv = DataConverter.JsonToCsv(
    "[{\"name\":\"alpha\",\"value\":10},{\"name\":\"beta\",\"value\":20}]"
);
if (
    !jsonCsv.IsValid
    || !jsonCsv.Output.Contains("name,value", StringComparison.Ordinal)
    || !jsonCsv.Output.Contains("beta,20", StringComparison.Ordinal)
)
{
    throw new InvalidOperationException("JSON to CSV check failed");
}

var csvChart = CsvChartCalculator.Analyze("time,value\n0,10\n1,20\n2,15");
if (
    !csvChart.IsValid
    || csvChart.Points.Count != 3
    || csvChart.XLabel != "time"
    || csvChart.Points[1].Y != 20
)
{
    throw new InvalidOperationException("CSV chart check failed");
}

var roi = FinanceToolsCalculator.Roi(1000, 1250);
var inflation = FinanceToolsCalculator.AdjustForInflation(1000, 4, 12);
var breakEven = FinanceToolsCalculator.BreakEven(5000, 100, 40);
if (
    !roi.IsValid
    || roi.Profit != 250
    || roi.ReturnPercent != 25
    || !inflation.IsValid
    || inflation.AdjustedAmount <= 1_000
    || !breakEven.IsValid
    || Math.Abs(breakEven.Units - (5000.0 / 60.0)) > 0.000001
)
{
    throw new InvalidOperationException("finance tools check failed");
}

var chemistryAmount = ChemistryAmountCalculator.FromMass(18.015, 18.015);
if (
    !chemistryAmount.IsValid
    || Math.Abs(chemistryAmount.Moles - 1) > 0.000001
    || Math.Abs(chemistryAmount.Particles - ChemistryAmountCalculator.AvogadroConstant) > 1e17
)
{
    throw new InvalidOperationException("chemistry amount check failed");
}

var normal = NormalDistributionCalculator.Analyze(0, 1, 1.96);
if (
    !normal.IsValid
    || normal.Points.Count != NormalDistributionCalculator.ChartPoints
    || Math.Abs(normal.CumulativeProbability - 0.975) > 0.001
    || Math.Abs(normal.Density - 0.05844) > 0.001
)
{
    throw new InvalidOperationException("normal distribution check failed");
}

var matrix = MatrixCalculator.Calculate("1,2\n3,4", "inverse");
var determinant = MatrixCalculator.Calculate("1,2\n3,4", "determinant");
if (
    !matrix.IsValid
    || Math.Abs(matrix.Matrix[0][0] + 2) > 0.000001
    || !determinant.IsValid
    || determinant.Scalar != -2
)
{
    throw new InvalidOperationException("matrix calculator check failed");
}

var vectors = VectorCalculator.Calculate([1, 2, 3], [4, 5, 6]);
if (
    !vectors.IsValid
    || vectors.Dot != 32
    || vectors.Cross[0] != -3
    || vectors.Cross[1] != 6
    || vectors.Cross[2] != -3
)
{
    throw new InvalidOperationException("vector calculator check failed");
}

var function = FunctionPlotter.Analyze("sin(x)", -Math.PI, Math.PI);
if (
    !function.IsValid
    || function.Points.Count != FunctionPlotter.SampleCount
    || Math.Abs(function.Points[FunctionPlotter.SampleCount / 2].Y) > 0.000001
    || FunctionPlotter.Analyze("unknown(x)", -1, 1).IsValid
)
{
    throw new InvalidOperationException("function plotter check failed");
}

var age = AgeCalculator.Calculate(new DateOnly(2000, 1, 31), new DateOnly(2025, 3, 1));
if (
    !age.IsValid
    || age.Years != 25
    || age.Months != 1
    || age.Days != 1
    || AgeCalculator.Calculate(new DateOnly(2025, 1, 1), new DateOnly(2024, 1, 1)).IsValid
)
{
    throw new InvalidOperationException("age calculator check failed");
}

var bmi = BmiCalculator.Calculate(70, 175);
if (
    !bmi.IsValid
    || Math.Round(bmi.Value, 6) != Math.Round(70 / Math.Pow(1.75, 2), 6)
    || bmi.Category != "normal"
    || BmiCalculator.Calculate(0, 175).IsValid
)
{
    throw new InvalidOperationException("BMI calculator check failed");
}

var units = UnitConverter.Convert(1, "km", "m");
var temperature = UnitConverter.Convert(0, "c", "f");
if (
    !units.IsValid
    || units.Value != 1000
    || !temperature.IsValid
    || temperature.Value != 32
    || UnitConverter.Convert(1, "kg", "m").IsValid
)
{
    throw new InvalidOperationException("unit converter check failed");
}

var balanced = ChemicalEquationBalancer.Balance("Fe + O2 -> Fe2O3");
if (
    !balanced.IsValid
    || balanced.Equation != "4Fe + 3O2 → 2Fe2O3"
    || balanced.Coefficients.SequenceEqual([4, 3, 2]) is false
)
{
    throw new InvalidOperationException("chemical equation check failed");
}

var balancedGroups = ChemicalEquationBalancer.Balance("Ca(OH)2 + HCl -> CaCl2 + H2O");
if (!balancedGroups.IsValid || !balancedGroups.Coefficients.SequenceEqual([1, 2, 1, 2]))
{
    throw new InvalidOperationException("chemical group balance check failed");
}

if (
    TextUtilityCalculator
        .Transform(
            new string('x', TextUtilityCalculator.MaximumInputCharacters + 1),
            TextUtilityMode.Reverse
        )
        .IsValid
    || TextUtilityCalculator.Transform(new string('x', 3_000), TextUtilityMode.Repeat, 100).IsValid
)
{
    throw new InvalidOperationException("text utility limits check failed");
}

var caseStyles = ExtendedTextTools.Analyze("case-style-converter", "hello world");
if (
    !caseStyles.IsValid
    || !caseStyles.Output.Contains("camelCase: helloWorld", StringComparison.Ordinal)
    || !caseStyles.Output.Contains("snake_case: hello_world", StringComparison.Ordinal)
    || !caseStyles.Output.Contains("dot.case: hello.world", StringComparison.Ordinal)
)
{
    throw new InvalidOperationException("extended case tools check failed");
}

var duplicateWords = ExtendedTextTools.Analyze("duplicate-word-finder", "One two one TWO three");
if (
    !duplicateWords.IsValid
    || duplicateWords.Rows.Count != 2
    || duplicateWords.Rows[0] != new TextToolRow("one", 2)
)
{
    throw new InvalidOperationException("duplicate word check failed");
}

if (
    ExtendedTextTools.Analyze("palindrome-checker", "A man, a plan, a canal: Panama").Output
        != "true"
    || ExtendedTextTools.Analyze("palindrome-checker", "hello").Output != "false"
)
{
    throw new InvalidOperationException("palindrome check failed");
}

var sortedLines = ExtendedTextTools.Analyze("line-sorter", "10\n2\n1", mode: "numeric");
if (!sortedLines.IsValid || sortedLines.Output != "1\n2\n10")
{
    throw new InvalidOperationException("line sorter check failed");
}

if (
    ExtendedTextTools.Analyze("reading-time-estimator", "one two three").Count != 3
    || ExtendedTextTools.Analyze("invisible-char-remover", "a\u200Bb").Output != "ab"
    || ExtendedTextTools.Analyze("lorem-ipsum-generator", null, 2).Output.Split("\n\n").Length != 2
    || ExtendedTextTools.Analyze("pig-latin", "hello apple").Output != "ellohay appleway"
    || ExtendedTextTools.Analyze("leetspeak", "test").Output != "7357"
    || ExtendedTextTools.Analyze("uwu-speak", "really, the little one").Output
        != "weawwy, da wittwe one"
)
{
    throw new InvalidOperationException("extended text tools check failed");
}

var descriptive = DescriptiveStatisticsCalculator.Analyze("1 2 2 3 4");
if (
    !descriptive.IsValid
    || descriptive.Count != 5
    || descriptive.Mean != 2.4
    || descriptive.Median != 2
    || descriptive.Mode != 2
    || descriptive.FirstQuartile != 1.5
    || descriptive.ThirdQuartile != 3.5
    || descriptive.Histogram.Sum(bin => bin.Count) != 5
)
{
    throw new InvalidOperationException("descriptive statistics check failed");
}

var numberTheory = NumberTheoryCalculator.Analyze(84, 30, 20);
if (
    !numberTheory.IsValid
    || numberTheory.GreatestCommonDivisor != 6
    || numberTheory.LeastCommonMultiple != 420
    || numberTheory.IsPrimeA
    || numberTheory.IsPrimeB
    || !numberTheory.Primes.SequenceEqual([2, 3, 5, 7, 11, 13, 17, 19])
)
{
    throw new InvalidOperationException("number theory check failed");
}

var investment = CompoundInterestCalculator.Solve(1000, 10, 2, 100);
if (
    !investment.IsValid
    || Math.Round(investment.FutureValue, 2) != 1420
    || Math.Round(investment.InterestEarned, 2) != 220
)
{
    throw new InvalidOperationException("compound interest check failed");
}

var ohm = OhmLawCalculator.Solve(12, 2, null, null);
if (!ohm.IsValid || ohm.Resistance != 6 || ohm.Power != 24)
{
    throw new InvalidOperationException("ohm law check failed");
}

var binary = TextCodecs.Transform("binary-text-codec", "Olá", "encode");
if (
    !binary.IsValid
    || binary.Output != "01001111 01101100 11000011 10100001"
    || TextCodecs.Transform("binary-text-codec", binary.Output, "decode").Output != "Olá"
    || TextCodecs.Transform("binary-text-codec", "01012", "decode").IsValid
)
{
    throw new InvalidOperationException("binary codec check failed");
}

if (
    CaesarCipher.Transform("Abc XYZ!", 3) != "Def ABC!"
    || CaesarCipher.Transform("Def ABC!", 3, decode: true) != "Abc XYZ!"
    || CaesarCipher.Transform("Hello", 13) != "Uryyb"
)
{
    throw new InvalidOperationException("caesar cipher check failed");
}

var color = ColorConversionCalculator.Convert("#4f46e5");
if (
    !color.IsValid
    || color.Hex != "#4f46e5"
    || color.Rgb != "rgb(79, 70, 229)"
    || color.Hsl != "hsl(243, 75%, 59%)"
)
{
    throw new InvalidOperationException("color converter check failed");
}

var colorFromHsl = ColorConversionCalculator.Convert("hsl(0, 100%, 50%)");
if (
    !colorFromHsl.IsValid
    || colorFromHsl.Hex != "#ff0000"
    || ColorConversionCalculator.Convert("#12").IsValid
)
{
    throw new InvalidOperationException("color converter parsing check failed");
}

var contrast = ContrastRatioCalculator.Calculate("#000000", "#ffffff");
if (
    !contrast.IsValid
    || Math.Round(contrast.Ratio, 2) != 21.00
    || !contrast.Passes(7)
    || contrast.Passes(22)
)
{
    throw new InvalidOperationException("contrast checker check failed");
}

if (
    BorderRadiusGenerator.Format(16, 24, 8, 4, linked: false) != "border-radius: 16px 24px 8px 4px;"
    || BorderRadiusGenerator.Format(16, 24, 8, 4, linked: true)
        != "border-radius: 16px 16px 16px 16px;"
)
{
    throw new InvalidOperationException("border radius generator check failed");
}

var shadow = BoxShadowFormatter.Format([
    new BoxShadowLayer(0, 4, 12, 0, "#4f46e5", false),
    new BoxShadowLayer(1, 2, 3, 4, "#000000", true),
]);
if (shadow != "box-shadow: 0px 4px 12px 0px #4f46e5, inset 1px 2px 3px 4px #000000;")
{
    throw new InvalidOperationException("box shadow generator check failed");
}

var cssClamp = CssClampEngine.Calculate(16, 32, 320, 1280);
if (
    !cssClamp.IsValid
    || cssClamp.Value != "clamp(1rem, 0.6667rem + 1.6667vw, 2rem)"
    || CssClampEngine.Calculate(16, 32, 1280, 320).IsValid
)
{
    throw new InvalidOperationException("css clamp calculator check failed");
}

var gradient = CssGradientFormatter.Format(
    "linear",
    90,
    [new GradientStop("#4f46e5", 0), new GradientStop("#22d3ee", 100)]
);
if (
    gradient != "background: linear-gradient(90deg, #4f46e5 0%, #22d3ee 100%);"
    || !CssGradientFormatter
        .Format("radial", 90, [new GradientStop("#000000", 0), new GradientStop("#ffffff", 100)])
        .StartsWith("background: radial-gradient(circle,", StringComparison.Ordinal)
)
{
    throw new InvalidOperationException("css gradient generator check failed");
}

var env = EnvFileValidationEngine.Validate(
    "# comment\nAPP_ENV=local\nAPP_ENV=production\nBAD-KEY=value\nmalformed"
);
if (
    env.Entries.Count != 1
    || env.Entries[0].Key != "APP_ENV"
    || env.Issues.Count != 3
    || env.Issues[0].Kind != "duplicate"
    || env.Issues[1].Kind != "invalid-key"
    || env.Issues[2].Kind != "malformed"
)
{
    throw new InvalidOperationException("env validator check failed");
}

var replaced = FindAndReplaceEngine.Execute("Hello HELLO $x", "hello", "bye$", false, false);
if (
    !replaced.IsValid
    || replaced.Output != "bye$ bye$ $x"
    || FindAndReplaceEngine.Execute("abc123", "(\\d+)", "[$1]", true, true).Output != "abc[123]"
    || FindAndReplaceEngine.Execute("abc", "[", "x", true, true).IsValid
)
{
    throw new InvalidOperationException("find and replace check failed");
}

var gitignore = GitignoreTemplates.Build(["Node", "VS Code"]);
if (
    !gitignore.StartsWith("### Node ###\nnode_modules/", StringComparison.Ordinal)
    || !gitignore.Contains("### VS Code ###", StringComparison.Ordinal)
    || !gitignore.EndsWith("*.code-workspace\n", StringComparison.Ordinal)
    || GitignoreTemplates.Build([]) != string.Empty
)
{
    throw new InvalidOperationException("gitignore generator check failed");
}

var calciumHydroxide = MolarMassCalculator.Calculate("Ca(OH)2");
if (
    !calciumHydroxide.IsValid
    || Math.Round(calciumHydroxide.MolarMass, 3) != 74.092
    || calciumHydroxide.Composition.Sum(element => element.Percentage) is < 99.99 or > 100.01
)
{
    throw new InvalidOperationException("molar mass check failed");
}

if (MolarMassCalculator.Calculate("Xx2").Error != MolarMassError.UnknownElement)
{
    throw new InvalidOperationException("molar mass validation check failed");
}

var selectedArchive = SnippetArchiveBuilder.Build(
    new PublicSnippet(
        "selected",
        "/snippets/selected",
        "Selected",
        null,
        null,
        [
            new PublicSnippetFile("one.txt", "text", "one", "1"),
            new PublicSnippetFile("two.txt", "text", "two", "2"),
        ]
    ),
    ["2"]
);
using (
    var zip = new System.IO.Compression.ZipArchive(
        new MemoryStream(selectedArchive),
        System.IO.Compression.ZipArchiveMode.Read
    )
)
{
    if (zip.Entries.Count != 1 || zip.Entries[0].FullName != "two.txt")
    {
        throw new InvalidOperationException("snippet archive selection check failed");
    }
}

var archive = SnippetArchiveBuilder.Build(
    new PublicSnippet(
        "example",
        "/snippets/example",
        "Example",
        null,
        null,
        [new PublicSnippetFile("src/main.cs", "csharp", "Console.WriteLine(\"ok\");")]
    )
);
using (
    var zip = new System.IO.Compression.ZipArchive(
        new MemoryStream(archive),
        System.IO.Compression.ZipArchiveMode.Read
    )
)
{
    if (zip.Entries.Count != 1 || zip.Entries[0].FullName != "src/main.cs")
    {
        throw new InvalidOperationException("snippet archive check failed");
    }
}

foreach (
    var unsafePath in new[] { "../secret.txt", "/secret.txt", "C:/secret.txt", "src/../secret.txt" }
)
{
    try
    {
        SnippetArchiveBuilder.Build(
            new PublicSnippet(
                "unsafe",
                "/snippets/unsafe",
                "Unsafe",
                null,
                null,
                [new PublicSnippetFile(unsafePath, "text", "blocked")]
            )
        );
        throw new InvalidOperationException("snippet archive path validation check failed");
    }
    catch (SnippetArchiveException) { }
}

var statuses = HttpStatusReference.Filter("429");
if (
    statuses.Count != 1
    || statuses[0].Name != "Too Many Requests"
    || HttpStatusReference.Filter("does-not-exist").Count != 0
    || HttpStatusReference.All.Count != 62
)
{
    throw new InvalidOperationException("HTTP status reference check failed");
}

var dimensions = ImageDimensionCalculator.Calculate(1920, 1080, 960, null);
if (
    !dimensions.IsValid
    || dimensions.Width != 960
    || dimensions.Height != 540
    || ImageDimensionCalculator.Calculate(0, 1080, 960, null).IsValid
)
{
    throw new InvalidOperationException("image dimension calculator check failed");
}

var jwt = JwtDecoderEngine.Decode("eyJhbGciOiJub25lIn0.eyJzdWIiOiIxMjMifQ.signature");
if (
    !jwt.IsValid
    || !jwt.Header.Contains("\"alg\": \"none\"", StringComparison.Ordinal)
    || !jwt.Payload.Contains("\"sub\": \"123\"", StringComparison.Ordinal)
    || JwtDecoderEngine.Decode("invalid").IsValid
)
{
    throw new InvalidOperationException("JWT decoder check failed");
}

var markdownTable = MarkdownTableGenerator.Generate("name\tage\nAda\t36\nGrace");
if (
    !markdownTable.Contains("| name  | age |", StringComparison.Ordinal)
    || !markdownTable.Contains("| Grace |     |", StringComparison.Ordinal)
    || MarkdownTableGenerator.Generate("") != string.Empty
)
{
    throw new InvalidOperationException("markdown table generator check failed");
}

var markdownHtml = MarkdownHtmlConverter.Convert(
    "# Hello\n\n**bold** and [safe](/docs)\n\n- one\n- two"
);
if (
    !markdownHtml.Contains("<h1>Hello</h1>", StringComparison.Ordinal)
    || !markdownHtml.Contains("<strong>bold</strong>", StringComparison.Ordinal)
    || !markdownHtml.Contains("<a href=\"/docs\"", StringComparison.Ordinal)
    || !markdownHtml.Contains("<ul><li>one</li><li>two</li></ul>", StringComparison.Ordinal)
    || MarkdownHtmlConverter
        .Convert("[unsafe](javascript:alert(1))")
        .Contains("javascript:", StringComparison.OrdinalIgnoreCase)
)
{
    throw new InvalidOperationException("markdown HTML converter check failed");
}

if (PhoneticAlphabetConverter.Convert("a0!", "nato") != "Alpha\nZero\n!")
{
    throw new InvalidOperationException("phonetic alphabet check failed");
}

if (
    PeriodicTableReference.All.Count != 118
    || PeriodicTableReference.Filter("oxygen").Single().Symbol != "O"
)
{
    throw new InvalidOperationException("periodic table check failed");
}

var qr = QrCodeGeneratorEngine.Generate("https://example.com");
if (
    !qr.IsValid
    || !qr.Svg.Contains("<svg", StringComparison.OrdinalIgnoreCase)
    || QrCodeGeneratorEngine.Generate("").IsValid
)
{
    throw new InvalidOperationException("QR code generator check failed");
}

var regex = RegexTesterEngine.Test("(foo)", "foo bar foo", false, false, false);
if (
    !regex.IsValid
    || regex.Matches.Count != 2
    || !regex.HighlightHtml.Contains("<mark>foo</mark>", StringComparison.Ordinal)
    || RegexTesterEngine.Test("[", "text", false, false, false).IsValid
)
{
    throw new InvalidOperationException("regex tester check failed");
}

var robots = RobotsTxtGenerator.Build(
    [
        new RobotsRule
        {
            Allow = "/public\n/assets",
            Disallow = "/private",
            Delay = "5",
        },
    ],
    "https://example.com/sitemap.xml"
);
if (
    !robots.Contains("User-agent: *", StringComparison.Ordinal)
    || !robots.Contains("Allow: /assets", StringComparison.Ordinal)
    || !robots.Contains("Disallow: /private", StringComparison.Ordinal)
    || !robots.EndsWith("Sitemap: https://example.com/sitemap.xml", StringComparison.Ordinal)
)
{
    throw new InvalidOperationException("robots.txt generator check failed");
}

var triangle = Portfolio.Blazor.Core.TriangleCalculator.Calculate(3, 4, 5);
if (
    !triangle.IsValid
    || !triangle.Summary.Contains("área = 6", StringComparison.Ordinal)
    || Portfolio.Blazor.Core.TriangleCalculator.Calculate(1, 2, 3).IsValid
)
{
    throw new InvalidOperationException("triangle calculator check failed");
}

if (
    Portfolio.Blazor.Core.VigenereCipher.Transform("ATTACKATDAWN", "LEMON", false) != "LXFOPVEFRNHR"
    || Portfolio.Blazor.Core.VigenereCipher.Transform("LXFOPVEFRNHR", "LEMON", true)
        != "ATTACKATDAWN"
)
{
    throw new InvalidOperationException("Vigenere cipher check failed");
}

var utf8 = Portfolio.Blazor.Core.Utf8Inspector.Inspect("Olá 😀");
if (utf8.Bytes != 9 || utf8.CodePoints != 5 || utf8.Hex != "4f 6c c3 a1 20 f0 9f 98 80")
{
    throw new InvalidOperationException("UTF-8 inspector check failed");
}

Console.WriteLine("Portfolio.Blazor.Core checks passed.");

static void AssertStatistics(string text, TextStatistics expected)
{
    var actual = TextStatisticsCalculator.Analyze(text);

    if (actual != expected)
    {
        throw new InvalidOperationException(
            $"Unexpected statistics for {text}: expected {expected}, got {actual}."
        );
    }
}
