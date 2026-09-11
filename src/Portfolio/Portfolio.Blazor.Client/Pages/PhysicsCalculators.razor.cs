using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class PhysicsCalculators
{
    private string CanonicalPath => RequestPath;
    private string _initialVelocityText = "5";
    private string _accelerationText = "2";
    private string _timeText = "3";
    private string _massText = "4";
    private string _forceAccelerationText = "3";
    private string _pressureText = string.Empty;
    private string _volumeText = "0.024";
    private string _molesText = "1";
    private string _temperatureText = "300";
    private string _speedText = string.Empty;
    private string _frequencyText = "440";
    private string _wavelengthText = "0.775";
    private KinematicsResult _kinematics = PhysicsCalculator.Kinematics(5, 2, 3);
    private NewtonResult _newton = PhysicsCalculator.NewtonsSecondLaw(4, 3);
    private IdealGasResult _gas = PhysicsCalculator.IdealGas(null, 0.024, 1, 300);
    private WaveResult _wave = PhysicsCalculator.Wave(null, 440, 0.775);
    private bool _queryInitialized;
    private readonly Debouncer _debouncer = new(TimeSpan.FromMilliseconds(300));

    [SupplyParameterFromQuery(Name = "v0")]
    private string? QueryInitialVelocity { get; set; }

    [SupplyParameterFromQuery(Name = "a")]
    private string? QueryAcceleration { get; set; }

    [SupplyParameterFromQuery(Name = "t")]
    private string? QueryTime { get; set; }

    [SupplyParameterFromQuery(Name = "mass")]
    private string? QueryMass { get; set; }

    [SupplyParameterFromQuery(Name = "force_a")]
    private string? QueryForceAcceleration { get; set; }

    [SupplyParameterFromQuery(Name = "p")]
    private string? QueryPressure { get; set; }

    [SupplyParameterFromQuery(Name = "v")]
    private string? QueryVolume { get; set; }

    [SupplyParameterFromQuery(Name = "n")]
    private string? QueryMoles { get; set; }

    [SupplyParameterFromQuery(Name = "temperature")]
    private string? QueryTemperature { get; set; }

    [SupplyParameterFromQuery(Name = "speed")]
    private string? QuerySpeed { get; set; }

    [SupplyParameterFromQuery(Name = "frequency")]
    private string? QueryFrequency { get; set; }

    [SupplyParameterFromQuery(Name = "wavelength")]
    private string? QueryWavelength { get; set; }

    private string InitialVelocityText
    {
        get => _initialVelocityText;
        set
        {
            _initialVelocityText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string AccelerationText
    {
        get => _accelerationText;
        set
        {
            _accelerationText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string TimeText
    {
        get => _timeText;
        set
        {
            _timeText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string MassText
    {
        get => _massText;
        set
        {
            _massText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string ForceAccelerationText
    {
        get => _forceAccelerationText;
        set
        {
            _forceAccelerationText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string PressureText
    {
        get => _pressureText;
        set
        {
            _pressureText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string VolumeText
    {
        get => _volumeText;
        set
        {
            _volumeText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string MolesText
    {
        get => _molesText;
        set
        {
            _molesText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string TemperatureText
    {
        get => _temperatureText;
        set
        {
            _temperatureText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string SpeedText
    {
        get => _speedText;
        set
        {
            _speedText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string FrequencyText
    {
        get => _frequencyText;
        set
        {
            _frequencyText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string WavelengthText
    {
        get => _wavelengthText;
        set
        {
            _wavelengthText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string Slug => RequestRouteSegment("kinematics");
    private PhysicsToolMode Mode =>
        Slug switch
        {
            "newtons-second-law" => PhysicsToolMode.Newton,
            "ideal-gas" => PhysicsToolMode.IdealGas,
            "wave-calculator" => PhysicsToolMode.Wave,
            _ => PhysicsToolMode.Kinematics,
        };
    private string Action => LocalizedUrls.Current($"/tools/{Slug}");
    private string Title =>
        Mode switch
        {
            PhysicsToolMode.Newton => L["newton_s_second_law"],
            PhysicsToolMode.IdealGas => L["ideal_gas_law"],
            PhysicsToolMode.Wave => L["wave_calculator"],
            _ => L["kinematics"],
        };
    private string Description =>
        Mode switch
        {
            PhysicsToolMode.Newton => L["calculate_force_from_mass_and_acceleration"],
            PhysicsToolMode.IdealGas => L["solve_pv_nrt_by_providing_three_of_four"],
            PhysicsToolMode.Wave => L["calculate_speed_frequency_or_wavelength"],
            _ => L["kinematics"],
        };
    private string InputLabel => L["parameters"];
    private string SubmitLabel => L["calculate"];
    private string FinalVelocityLabel => L["calculate"];
    private string DisplacementLabel => L["final_velocity"];
    private string ForceLabel => L["displacement"];
    private string PressureLabel => L["force"];
    private string VolumeLabel => L["pressure"];
    private string MolesLabel => L["volume"];
    private string TemperatureLabel => L["amount_of_substance"];
    private string SpeedLabel => L["temperature"];
    private string FrequencyLabel => L["speed"];
    private string WavelengthLabel => L["frequency"];
    private string ErrorLabel => L["wavelength"];
    private bool ResultIsValid =>
        Mode switch
        {
            PhysicsToolMode.Newton => Newton.IsValid,
            PhysicsToolMode.IdealGas => Gas.IsValid,
            PhysicsToolMode.Wave => Wave.IsValid,
            _ => Kinematics.IsValid,
        };
    private KinematicsResult Kinematics => _kinematics;
    private NewtonResult Newton => _newton;
    private IdealGasResult Gas => _gas;
    private WaveResult Wave => _wave;
    private string KinematicsChartLabel => L["kinematics_chart_label"];
    private string PositionSeriesLabel => L["kinematics_position_series"];
    private string VelocitySeriesLabel => L["kinematics_velocity_series"];
    private string WaveChartLabel => L["wave_chart_label"];
    private string WaveSeriesLabel => L["wave_series_label"];

    private IReadOnlyList<(double Time, double Position, double Velocity)> KinematicsSeries
    {
        get
        {
            var initialVelocity = Parse(_initialVelocityText);
            var acceleration = Parse(_accelerationText);
            var duration = Parse(_timeText);
            if (
                !double.IsFinite(initialVelocity)
                || !double.IsFinite(acceleration)
                || !double.IsFinite(duration)
                || duration < 0
            )
            {
                return [];
            }

            const int steps = 40;
            var points = new List<(double, double, double)>(steps + 1);
            for (var index = 0; index <= steps; index++)
            {
                var time = duration * index / steps;
                var position = (initialVelocity * time) + (acceleration * time * time / 2);
                var velocity = initialVelocity + (acceleration * time);
                points.Add((time, position, velocity));
            }

            return points;
        }
    }

    private SiteChartConfig KinematicsChartConfig =>
        new()
        {
            Type = SiteChartType.Line,
            Data = new SiteChartData
            {
                Labels = KinematicsSeries.Select(sample => Format(sample.Time)).ToList(),
                Datasets =
                [
                    new SiteLineDataset
                    {
                        Label = PositionSeriesLabel,
                        Data = KinematicsSeries.Select(sample => (object)sample.Position).ToList(),
                    },
                    new SiteLineDataset
                    {
                        Label = VelocitySeriesLabel,
                        Data = KinematicsSeries.Select(sample => (object)sample.Velocity).ToList(),
                    },
                ],
            },
        };

    private IReadOnlyList<(double X, double Y)> WaveSeries
    {
        get
        {
            if (!Wave.IsValid || Wave.Wavelength <= 0)
            {
                return [];
            }

            const int steps = 100;
            var points = new List<(double, double)>(steps + 1);
            for (var index = 0; index <= steps; index++)
            {
                var x = (double)index / steps * Wave.Wavelength * 2;
                points.Add((x, Math.Sin(2 * Math.PI * x / Wave.Wavelength)));
            }

            return points;
        }
    }

    private SiteChartConfig WaveChartConfig =>
        new()
        {
            Type = SiteChartType.Line,
            Data = new SiteChartData
            {
                Labels = WaveSeries.Select(point => Format(point.X)).ToList(),
                Datasets =
                [
                    new SiteLineDataset
                    {
                        Label = WaveSeriesLabel,
                        Data = WaveSeries.Select(point => (object)point.Y).ToList(),
                    },
                ],
            },
        };

    protected override void OnParametersSet()
    {
        if (!_queryInitialized)
        {
            _initialVelocityText = QueryInitialVelocity ?? _initialVelocityText;
            _accelerationText = QueryAcceleration ?? _accelerationText;
            _timeText = QueryTime ?? _timeText;
            _massText = QueryMass ?? _massText;
            _forceAccelerationText = QueryForceAcceleration ?? _forceAccelerationText;
            _pressureText = QueryPressure ?? _pressureText;
            _volumeText = QueryVolume ?? _volumeText;
            _molesText = QueryMoles ?? _molesText;
            _temperatureText = QueryTemperature ?? _temperatureText;
            _speedText = QuerySpeed ?? _speedText;
            _frequencyText = QueryFrequency ?? _frequencyText;
            _wavelengthText = QueryWavelength ?? _wavelengthText;
            Recalculate();
            _queryInitialized = true;
        }
    }

    private void HandleSubmit() => Recalculate();

    private void Recalculate()
    {
        _kinematics = PhysicsCalculator.Kinematics(
            Parse(_initialVelocityText),
            Parse(_accelerationText),
            Parse(_timeText)
        );
        _newton = PhysicsCalculator.NewtonsSecondLaw(
            Parse(_massText),
            Parse(_forceAccelerationText)
        );
        _gas = PhysicsCalculator.IdealGas(
            ParseNullable(_pressureText),
            ParseNullable(_volumeText),
            ParseNullable(_molesText),
            ParseNullable(_temperatureText)
        );
        _wave = PhysicsCalculator.Wave(
            ParseNullable(_speedText),
            ParseNullable(_frequencyText),
            ParseNullable(_wavelengthText)
        );
    }

    private static double Parse(string value) =>
        double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var result)
            ? result
            : double.NaN;

    private static double? ParseNullable(string value) =>
        double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var result)
            ? result
            : null;

    private static string Format(double value) =>
        value.ToString("G8", CultureInfo.InvariantCulture);

    private enum PhysicsToolMode
    {
        Kinematics,
        Newton,
        IdealGas,
        Wave,
    }

    public void Dispose()
    {
        _debouncer.Dispose();
        GC.SuppressFinalize(this);
    }
}
