<?php

namespace App\Filament\Resources\ResourceFindings\Schemas;

use App\Filament\Concerns\BuildsStructuredFields;
use App\Filament\Concerns\BuildsTranslationTabs;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ResourceFindingForm
{
    use BuildsStructuredFields, BuildsTranslationTabs;

    protected const TYPES = [
        'book', 'article', 'paper', 'repo', 'site', 'docs', 'tool',
        'course', 'video', 'playlist', 'channel', 'podcast', 'film', 'other',
    ];

    protected const CONSUMPTION_STATES = [
        'found', 'saved-for-later', 'exploring', 'in-progress',
        'completed', 'abandoned', 'archived',
    ];

    protected const RATINGS = [
        'not-rated', 'interesting', 'recommended',
        'strongly-recommended', 'not-recommended',
    ];

    protected const EDITORIAL_STATES = [
        'imported', 'pending-review', 'draft', 'reviewed', 'published', 'archived',
    ];

    protected const VISIBILITIES = [
        'public', 'unlisted', 'private', 'hidden', 'archived',
    ];

    protected const LINK_PURPOSES = [
        'official-source', 'reading', 'viewing', 'purchase', 'download',
        'documentation', 'repository', 'demo', 'translation', 'archived-version',
        'review', 'discussion', 'author-page', 'publisher-page', 'other',
    ];

    protected const IDENTIFIER_KINDS = [
        'isbn', 'doi', 'issn', 'imdb', 'tmdb', 'youtube', 'other',
    ];

    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make()
                    ->columns(2)
                    ->schema([
                        TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),
                        Toggle::make('hidden')
                            ->default(false),
                        TextInput::make('order')
                            ->numeric()
                            ->default(0)
                            ->required(),
                        Select::make('type')
                            ->required()
                            ->options(array_combine(self::TYPES, self::TYPES)),
                        Select::make('language_id')
                            ->label('Language')
                            ->relationship('language', 'slug')
                            ->nullable(),
                        DatePicker::make('published_date_iso')
                            ->label('Published date'),
                        DatePicker::make('found_date_iso')
                            ->label('Found date'),
                        Select::make('consumption_state')
                            ->options(array_combine(self::CONSUMPTION_STATES, self::CONSUMPTION_STATES))
                            ->nullable(),
                        Select::make('rating')
                            ->options(array_combine(self::RATINGS, self::RATINGS))
                            ->nullable(),
                        Select::make('editorial_state')
                            ->options(array_combine(self::EDITORIAL_STATES, self::EDITORIAL_STATES))
                            ->nullable(),
                        Select::make('visibility')
                            ->options(array_combine(self::VISIBILITIES, self::VISIBILITIES))
                            ->nullable(),
                    ]),
                Section::make('Type details')
                    ->columnSpanFull()
                    ->schema([
                        KeyValue::make('type_details')
                            ->label('Type details')
                            ->keyLabel('Field')
                            ->valueLabel('Value')
                            ->addActionLabel('Add detail')
                            ->helperText('Free-form details for this type — e.g. a book uses isbn, publisher, edition, pages; a repo uses org, name, language, license.'),
                    ]),
                Section::make('Topics')
                    ->columnSpanFull()
                    ->schema([
                        Select::make('topics')
                            ->relationship('topics', 'slug')
                            ->multiple()
                            ->searchable()
                            ->preload()
                            ->helperText('Per-topic role is not editable here yet — none of the current data uses it.'),
                        Select::make('authorTopics')
                            ->label('Authors')
                            ->relationship('authorTopics', 'slug')
                            ->multiple()
                            ->searchable()
                            ->preload(),
                        Select::make('publisherTopics')
                            ->label('Publishers')
                            ->relationship('publisherTopics', 'slug')
                            ->multiple()
                            ->searchable()
                            ->preload(),
                    ]),
                Section::make('Links')
                    ->columnSpanFull()
                    ->schema([
                        Repeater::make('links')
                            ->relationship('links')
                            ->columns(2)
                            ->schema([
                                TextInput::make('url')->required()->url()->columnSpanFull(),
                                TextInput::make('label')->nullable(),
                                TextInput::make('platform')->nullable(),
                                Select::make('purpose')
                                    ->options(array_combine(self::LINK_PURPOSES, self::LINK_PURPOSES))
                                    ->nullable(),
                                Select::make('language_id')
                                    ->label('Language')
                                    ->relationship('language', 'slug')
                                    ->nullable(),
                                Toggle::make('is_primary')->label('Primary link'),
                                Toggle::make('is_free')->label('Free'),
                            ])
                            ->itemLabel(fn (array $state): ?string => $state['label'] ?? $state['url'] ?? null)
                            ->addActionLabel('Add link')
                            ->defaultItems(0),
                    ]),
                Section::make('Identifiers')
                    ->columnSpanFull()
                    ->schema([
                        Repeater::make('identifiers')
                            ->relationship('identifiers')
                            ->columns(2)
                            ->schema([
                                Select::make('kind')
                                    ->options(array_combine(self::IDENTIFIER_KINDS, self::IDENTIFIER_KINDS))
                                    ->required(),
                                TextInput::make('value')->required(),
                            ])
                            ->itemLabel(fn (array $state): ?string => isset($state['kind']) ? "{$state['kind']}: ".($state['value'] ?? '') : null)
                            ->addActionLabel('Add identifier')
                            ->defaultItems(0),
                    ]),
                static::translationTabs(fn (string $prefix) => [
                    TextInput::make("{$prefix}title")
                        ->label('Title')
                        ->required()
                        ->maxLength(255),
                    TextInput::make("{$prefix}alternative_title")
                        ->label('Alternative Title')
                        ->nullable()
                        ->maxLength(255),
                    Textarea::make("{$prefix}description")
                        ->label('Description')
                        ->nullable(),
                    Textarea::make("{$prefix}personal_note")
                        ->label('Personal Note')
                        ->nullable(),
                    Textarea::make("{$prefix}reason_found")
                        ->label('Reason Found')
                        ->nullable(),
                    static::seoFieldset($prefix),
                ]),
            ]);
    }
}
