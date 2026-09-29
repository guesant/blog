<?php

namespace App\Filament\Resources\ReferenceCollections\Schemas;

use App\Filament\Concerns\BuildsMarkdownEditors;
use App\Filament\Concerns\BuildsStructuredFields;
use App\Filament\Concerns\BuildsTranslationTabs;
use App\Models\Resource as ResourceModel;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ReferenceCollectionForm
{
    use BuildsMarkdownEditors, BuildsStructuredFields, BuildsTranslationTabs;

    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Publishing')
                    ->columnSpanFull()
                    ->columns(2)
                    ->schema([
                        TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),
                        Toggle::make('hidden')
                            ->default(false),
                        TextInput::make('image')
                            ->nullable()
                            ->maxLength(255),
                        DatePicker::make('published_at')
                            ->label('Published'),
                    ]),
                Section::make('Curated items')
                    ->columnSpanFull()
                    ->schema([
                        Repeater::make('items')
                            ->reorderableWithButtons()
                            ->columns(2)
                            ->schema([
                                Select::make('resource_id')
                                    ->label('Finding')
                                    ->options(fn () => ResourceModel::query()->pluck('slug', 'id'))
                                    ->searchable()
                                    ->required()
                                    ->columnSpanFull(),
                                Textarea::make('note')
                                    ->columnSpanFull()
                                    ->nullable(),
                            ])
                            ->itemLabel(fn (mixed $state): ?string => is_array($state) && isset($state['resource_id'])
                                ? ResourceModel::find($state['resource_id'])?->slug
                                : null)
                            ->addActionLabel('Add item')
                            ->defaultItems(0),
                    ]),
                static::translationTabs(fn (string $prefix) => [
                    TextInput::make("{$prefix}title")
                        ->label('Title')
                        ->required()
                        ->maxLength(255),
                    Textarea::make("{$prefix}description")
                        ->label('Description')
                        ->nullable(),
                    static::markdownEditor("{$prefix}intro")
                        ->label('Intro')
                        ->nullable(),
                    static::seoFieldset($prefix),
                ]),
            ]);
    }
}
