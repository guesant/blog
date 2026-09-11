namespace Portfolio.Blazor.Core;

public enum PhysicsError
{
    None,
    InvalidInput,
    NeedMoreValues,
}

public readonly record struct KinematicsResult(
    bool IsValid,
    double FinalVelocity,
    double Displacement,
    PhysicsError Error = PhysicsError.None
);

public readonly record struct NewtonResult(
    bool IsValid,
    double Force,
    PhysicsError Error = PhysicsError.None
);

public readonly record struct IdealGasResult(
    bool IsValid,
    double Pressure,
    double Volume,
    double Moles,
    double Temperature,
    PhysicsError Error = PhysicsError.None
);

public readonly record struct WaveResult(
    bool IsValid,
    double Speed,
    double Frequency,
    double Wavelength,
    PhysicsError Error = PhysicsError.None
);

public readonly record struct ProjectilePoint(double X, double Y);

public readonly record struct ProjectileResult(
    bool IsValid,
    double Range,
    double MaximumHeight,
    double FlightTime,
    IReadOnlyList<ProjectilePoint> Trajectory,
    PhysicsError Error = PhysicsError.None
);

public readonly record struct CircularMotionResult(
    bool IsValid,
    double AngularVelocity,
    double Period,
    double CentripetalAcceleration,
    double? Force,
    PhysicsError Error = PhysicsError.None
);

public readonly record struct MechanicalEnergyResult(
    bool IsValid,
    double KineticEnergy,
    double PotentialEnergy,
    double TotalEnergy,
    PhysicsError Error = PhysicsError.None
);

public readonly record struct SensibleHeatResult(
    bool IsValid,
    double Heat,
    PhysicsError Error = PhysicsError.None
);

public static class PhysicsCalculator
{
    public const double GasConstant = 8.31446261815324;

    public static KinematicsResult Kinematics(
        double initialVelocity,
        double acceleration,
        double time
    )
    {
        if (!Finite(initialVelocity, acceleration, time) || time < 0)
        {
            return new KinematicsResult(false, 0, 0, PhysicsError.InvalidInput);
        }

        return new KinematicsResult(
            true,
            initialVelocity + acceleration * time,
            initialVelocity * time + acceleration * time * time / 2
        );
    }

    public static NewtonResult NewtonsSecondLaw(double mass, double acceleration)
    {
        if (!Finite(mass, acceleration) || mass <= 0)
        {
            return new NewtonResult(false, 0, PhysicsError.InvalidInput);
        }

        return new NewtonResult(true, mass * acceleration);
    }

    public static IdealGasResult IdealGas(
        double? pressure,
        double? volume,
        double? moles,
        double? temperature
    )
    {
        var values = new[] { pressure, volume, moles, temperature };
        if (
            values.Count(value => value.HasValue) != 3
            || values.Any(value =>
                value.HasValue && (!double.IsFinite(value.Value) || value.Value <= 0)
            )
        )
        {
            return new IdealGasResult(
                false,
                0,
                0,
                0,
                0,
                values.Count(value => value.HasValue) < 3
                    ? PhysicsError.NeedMoreValues
                    : PhysicsError.InvalidInput
            );
        }

        var result = (pressure, volume, moles, temperature) switch
        {
            (null, var v, var n, var t) => (
                GasConstant * n!.Value * t!.Value / v!.Value,
                v.Value,
                n.Value,
                t.Value
            ),
            (var p, null, var n, var t) => (
                p!.Value,
                GasConstant * n!.Value * t!.Value / p.Value,
                n.Value,
                t.Value
            ),
            (var p, var v, null, var t) => (
                p!.Value,
                v!.Value,
                p!.Value * v.Value / (GasConstant * t!.Value),
                t.Value
            ),
            (var p, var v, var n, null) => (
                p!.Value,
                v!.Value,
                n!.Value,
                p.Value * v.Value / (GasConstant * n.Value)
            ),
            _ => (0, 0, 0, 0),
        };

        return new IdealGasResult(true, result.Item1, result.Item2, result.Item3, result.Item4);
    }

    public static WaveResult Wave(double? speed, double? frequency, double? wavelength)
    {
        var values = new[] { speed, frequency, wavelength };
        if (
            values.Count(value => value.HasValue) != 2
            || values.Any(value =>
                value.HasValue && (!double.IsFinite(value.Value) || value.Value <= 0)
            )
        )
        {
            return new WaveResult(
                false,
                0,
                0,
                0,
                values.Count(value => value.HasValue) < 2
                    ? PhysicsError.NeedMoreValues
                    : PhysicsError.InvalidInput
            );
        }

        var result = (speed, frequency, wavelength) switch
        {
            (null, var f, var length) => (f!.Value * length!.Value, f.Value, length.Value),
            (var v, null, var length) => (v!.Value, v.Value / length!.Value, length.Value),
            (var v, var f, null) => (v!.Value, f!.Value, v.Value / f.Value),
            _ => (0, 0, 0),
        };

        return new WaveResult(true, result.Item1, result.Item2, result.Item3);
    }

    public static ProjectileResult Projectile(
        double speed,
        double angleDegrees,
        double gravity = 9.80665
    )
    {
        if (
            !Finite(speed, angleDegrees, gravity)
            || speed <= 0
            || angleDegrees < 0
            || angleDegrees > 90
            || gravity <= 0
        )
        {
            return new ProjectileResult(false, 0, 0, 0, [], PhysicsError.InvalidInput);
        }

        var angle = angleDegrees * Math.PI / 180;
        var horizontal = speed * Math.Cos(angle);
        var vertical = speed * Math.Sin(angle);
        var flightTime = 2 * vertical / gravity;
        var range = horizontal * flightTime;
        var maximumHeight = vertical * vertical / (2 * gravity);
        var trajectory = Enumerable
            .Range(0, 21)
            .Select(index =>
            {
                var time = flightTime * index / 20;
                return new ProjectilePoint(
                    horizontal * time,
                    Math.Max(0, vertical * time - gravity * time * time / 2)
                );
            })
            .ToArray();
        return new ProjectileResult(true, range, maximumHeight, flightTime, trajectory);
    }

    public static CircularMotionResult CircularMotion(
        double radius,
        double tangentialSpeed,
        double? mass = null
    )
    {
        if (
            !Finite(radius, tangentialSpeed)
            || radius <= 0
            || tangentialSpeed < 0
            || (mass.HasValue && (!double.IsFinite(mass.Value) || mass.Value < 0))
        )
        {
            return new CircularMotionResult(false, 0, 0, 0, null, PhysicsError.InvalidInput);
        }

        var angularVelocity = tangentialSpeed / radius;
        var period = angularVelocity == 0 ? double.PositiveInfinity : 2 * Math.PI / angularVelocity;
        var acceleration = tangentialSpeed * tangentialSpeed / radius;
        double? force = mass.HasValue ? mass.Value * acceleration : null;
        return new CircularMotionResult(true, angularVelocity, period, acceleration, force);
    }

    public static MechanicalEnergyResult MechanicalEnergy(
        double mass,
        double speed,
        double height,
        double gravity = 9.80665
    )
    {
        if (!Finite(mass, speed, height, gravity) || mass < 0 || height < 0 || gravity <= 0)
        {
            return new MechanicalEnergyResult(false, 0, 0, 0, PhysicsError.InvalidInput);
        }

        var kinetic = mass * speed * speed / 2;
        var potential = mass * gravity * height;
        return new MechanicalEnergyResult(true, kinetic, potential, kinetic + potential);
    }

    public static SensibleHeatResult SensibleHeat(
        double mass,
        double specificHeat,
        double deltaTemperature
    )
    {
        if (!Finite(mass, specificHeat, deltaTemperature) || mass < 0 || specificHeat < 0)
        {
            return new SensibleHeatResult(false, 0, PhysicsError.InvalidInput);
        }

        return new SensibleHeatResult(true, mass * specificHeat * deltaTemperature);
    }

    private static bool Finite(params double[] values) => values.All(double.IsFinite);
}
