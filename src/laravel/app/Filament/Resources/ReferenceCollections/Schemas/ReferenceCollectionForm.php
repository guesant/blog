<?php

namespace App\Filament\Resources\ReferenceCollections\Schemas;

use App\Filament\Concerns\BuildsStructuredFields;
use App\Filament\Concerns\BuildsTranslationTabs;
use App\Models\Resource as ResourceModel;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\MarkdownEditor;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ReferenceCollectionForm
{
    use BuildsStructuredFields, BuildsTranslationTabs;

    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Publishing')
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
                                    ->required(),
                                Textarea::make('note')
                                    ->columnSpanFull()
                                    ->nullable(),
                            ])
                            ->itemLabel(fn (array $state): ?string => isset($state['resource_id'])
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
                    MarkdownEditor::make("{$prefix}intro")
                        ->label('Intro')
                        ->nullable(),
                    static::seoFieldset($prefix),
                ]),
            ]);
    }
}
