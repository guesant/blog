<?php

namespace Database\Factories;

use App\Models\Platform;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @psalm-suppress UnusedClass */
class PlatformFactory extends Factory
{
    protected $model = Platform::class;

    public function definition(): array
    {
        $slug = $this->faker->unique()->slug();

        return [
            'slug' => $slug,
            'label' => Str::headline($slug),
        ];
    }
}
