<?php

namespace Database\Factories;

use App\Models\Snippet;
use App\Models\SnippetFile;
use Illuminate\Database\Eloquent\Factories\Factory;

class SnippetFileFactory extends Factory
{
    protected $model = SnippetFile::class;

    public function definition(): array
    {
        return [
            'snippet_id' => Snippet::factory(),
            'path' => $this->faker->word().'.txt',
            'language' => 'text',
            'content' => $this->faker->paragraph(),
            'order' => 0,
        ];
    }
}
