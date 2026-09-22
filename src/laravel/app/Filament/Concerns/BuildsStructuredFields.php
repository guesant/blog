<?php

namespace App\Filament\Concerns;

use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Fieldset;

trait BuildsStructuredFields
{
    protected static function seoFieldset(string $prefix): Fieldset
    {
        return Fieldset::make('SEO')
            ->columns(2)
            ->schema([
                TextInput::make("{$prefix}seo.title")
                    ->label('SEO title')
                    ->nullable(),
                TextInput::make("{$prefix}seo.image")
                    ->label('SEO image URL')
                    ->nullable(),
                Textarea::make("{$prefix}seo.description")
                    ->label('SEO description')
                    ->rows(2)
                    ->nullable(),
                TextInput::make("{$prefix}seo.imageAlt")
                    ->label('SEO image alt text')
                    ->nullable(),
                TagsInput::make("{$prefix}seo.keywords")
                    ->label('SEO keywords')
                    ->nullable(),
                Toggle::make("{$prefix}seo.noIndex")
                    ->label('Exclude from search engines (noindex)')
                    ->default(false)
                    ->inline(false),
            ]);
    }

    protected static function metricsRepeater(string $prefix): Repeater
    {
        return Repeater::make("{$prefix}metrics")
            ->label('Metrics')
            ->columns(2)
            ->schema([
                TextInput::make('value')
                    ->required()
                    ->helperText('The headline number, e.g. "40%" or "1200".'),
                TextInput::make('label')
                    ->required()
                    ->helperText('What the number means, e.g. "waitlist reduction".'),
            ])
            ->itemLabel(fn (array $state): ?string => trim(($state['value'] ?? '').' '.($state['label'] ?? '')) ?: null)
            ->formatStateUsing(fn ($state) => $state ?? [])
            ->addActionLabel('Add metric')
            ->defaultItems(0);
    }

    protected static function stringListRepeater(string $name, string $label, string $addLabel): Repeater
    {
        return Repeater::make($name)
            ->label($label)
            ->simple(Textarea::make('value')->rows(2)->required())
            ->default([])
            ->addActionLabel($addLabel)
            ->defaultItems(0);
    }
}
