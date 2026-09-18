<?php

namespace App\Filament\Resources\RelationTypes\Schemas;

use App\Models\RelationType;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class RelationTypeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make()
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
                        TextInput::make('outbound_label_en')
                            ->label('Outbound label (EN)')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('outbound_label_pt_br')
                            ->label('Outbound label (PT-BR)')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('inbound_label_en')
                            ->label('Inbound label (EN)')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('inbound_label_pt_br')
                            ->label('Inbound label (PT-BR)')
                            ->required()
                            ->maxLength(255),
                    ]),
            ]);
    }
}
