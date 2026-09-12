namespace Blog.Blazor.Core;

public readonly record struct ChemistryAmountResult(bool IsValid, double Moles, double Particles);

public static class ChemistryAmountCalculator
{
    public const double AvogadroConstant = 6.02214076e23;

    public static ChemistryAmountResult FromMass(double massGrams, double molarMass)
    {
        if (
            !double.IsFinite(massGrams)
            || !double.IsFinite(molarMass)
            || massGrams < 0
            || molarMass <= 0
        )
        {
            return new(false, double.NaN, double.NaN);
        }

        var moles = massGrams / molarMass;
        var particles = moles * AvogadroConstant;
        return double.IsFinite(moles) && double.IsFinite(particles)
            ? new(true, moles, particles)
            : new(false, double.NaN, double.NaN);
    }
}
