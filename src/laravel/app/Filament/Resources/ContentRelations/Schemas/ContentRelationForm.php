<?php

namespace App\Filament\Resources\ContentRelations\Schemas;

use App\Content\Graph\NodeRegistry;
use App\Models\RelationType;
use Filament\Forms\Components\MorphToSelect;
use Filament\Forms\Components\MorphToSelect\Type;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class ContentRelationForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make()
                    ->columns(2)
                    ->schema([
                        MorphToSelect::make('subject')
                            ->types(self::morphTypes())
                            ->searchable()
                            ->required(),
                        MorphToSelect::make('object')
                            ->types(self::morphTypes())
                            ->searchable()
                            ->required(),
                        Select::make('relation_type_id')
                            ->label('Relation type')
                            ->options(
                                RelationType::query()
                                    ->orderBy('family')
                                    ->orderBy('key')
                                    ->get()
                                    ->groupBy('family')
                                    ->map(fn ($group) => $group->pluck('key', 'id'))
                                    ->all()
                            )
                            ->searchable()
                            ->required(),
                        Select::make('status')
                            ->options([
                                'verified' => 'verified',
                                'unverified' => 'unverified',
                            ])
                            ->default('verified'),
                        Select::make('visibility')
                            ->options([
                                'public' => 'public',
                                'private' => 'private',
                            ])
                            ->default('public')
                            ->nullable(),
                        Textarea::make('note')
                            ->rows(2)
                            ->columnSpanFull(),
                        Textarea::make('context')
                            ->rows(2)
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    private static function morphTypes(): array
    {
        return collect(NodeRegistry::kinds())
            ->map(fn (string $class, string $kind) => Type::make($class)
                ->titleAttribute('slug')
                ->label(Str::headline($kind)))
            ->values()
            ->all();
    }
}
