<?php

namespace App\Filament\Resources\RelationTypes\Schemas;

use App\Filament\Concerns\BuildsTranslationTabs;
use App\Models\RelationType;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Fieldset;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class RelationTypeForm
{
    use BuildsTranslationTabs;

    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make(__('Definition'))
                    ->columns(2)
                    ->schema([
                        TextInput::make('key')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),
                        TextInput::make('family')
                            ->required()
                            ->datalist(
                                RelationType::query()
                                    ->distinct()
                                    ->orderBy('family')
                                    ->pluck('family')
                                    ->all()
                            )
                            ->maxLength(255),
                        Toggle::make('symmetric'),
                    ]),
                static::translationTabs(fn (string $prefix) => [
                    Fieldset::make(__('Localized labels'))
                        ->columns(2)
                        ->schema([
                            TextInput::make("{$prefix}outbound_label")
                                ->label('Outbound label')
                                ->required()
                                ->maxLength(255),
                            TextInput::make("{$prefix}inbound_label")
                                ->label('Inbound label')
                                ->required()
                                ->maxLength(255),
                        ]),
                ]),
            ]);
    }
}
