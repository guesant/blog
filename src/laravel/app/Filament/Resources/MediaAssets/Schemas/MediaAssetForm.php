<?php

namespace App\Filament\Resources\MediaAssets\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class MediaAssetForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make(__('Storage'))
                    ->columns(2)
                    ->schema([
                        Select::make('disk')
                            ->options(function (): array {
                                $disks = array_keys((array) config('filesystems.disks', []));

                                return array_combine($disks, $disks) ?: [];
                            })
                            ->required()
                            ->searchable(),
                        Select::make('visibility')
                            ->options([
                                'public' => __('Public'),
                                'private' => __('Private'),
                            ])
                            ->required(),
                        TextInput::make('path')
                            ->required()
                            ->maxLength(1024)
                            ->columnSpanFull(),
                        TextInput::make('original_name')
                            ->maxLength(255),
                        TextInput::make('mime_type')
                            ->maxLength(255),
                        TextInput::make('size')
                            ->numeric()
                            ->minValue(0),
                        TextInput::make('checksum')
                            ->maxLength(64),
                    ]),
                Section::make(__('Lifecycle'))
                    ->columns(2)
                    ->schema([
                        DateTimePicker::make('last_referenced_at'),
                    ]),
            ]);
    }
}
