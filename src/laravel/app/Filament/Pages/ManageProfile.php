<?php

namespace App\Filament\Pages;

use App\Filament\Concerns\BuildsStructuredFields;
use App\Filament\Concerns\BuildsTranslationTabs;
use App\Filament\Concerns\HasSingleSaveAction;
use App\Filament\Concerns\SyncsTranslations;
use App\Models\Profile;
use BackedEnum;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;

/**
 * @property-read Schema $form
 */
class ManageProfile extends Page
{
    use BuildsStructuredFields, BuildsTranslationTabs, HasSingleSaveAction, SyncsTranslations;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedUser;

    protected string $view = 'filament-panels::pages.page';

    public ?array $data = [];

    protected ?Profile $record = null;

    public function mount(): void
    {
        $this->record = Profile::query()->first() ?? Profile::create(['name' => '']);

        $data = $this->record->attributesToArray();
        $data = $this->fillTranslationsIntoData($data);

        $this->form->fill($data);
    }

    protected function getRecord(): Profile
    {
        return $this->record ??= Profile::query()->first() ?? Profile::create(['name' => '']);
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Profile settings')
                    ->columns(2)
                    ->schema([
                        TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        DatePicker::make('birth_date')
                            ->nullable(),
                    ]),
                static::translationTabs(fn (string $prefix) => [
                    TextInput::make("{$prefix}title")
                        ->label('Title')
                        ->nullable()
                        ->maxLength(255),
                    TextInput::make("{$prefix}location")
                        ->label('Location')
                        ->nullable()
                        ->maxLength(255),
                    TextInput::make("{$prefix}birth_city")
                        ->label('Birth City')
                        ->nullable()
                        ->maxLength(255),
                    Textarea::make("{$prefix}description")
                        ->label('Description')
                        ->nullable(),
                    Textarea::make("{$prefix}interests")
                        ->label('Interests')
                        ->nullable(),
                    Textarea::make("{$prefix}learning")
                        ->label('Learning')
                        ->nullable(),
                    static::stringListRepeater("{$prefix}personal_interests", 'Personal Interests', 'Add interest'),
                    static::stringListRepeater("{$prefix}fortunes", 'Fortunes', 'Add fortune'),
                    static::stringListRepeater("{$prefix}personal_facts", 'Personal Facts', 'Add fact'),
                    Repeater::make("{$prefix}personal_things")
                        ->label('Personal Things')
                        ->columns(2)
                        ->schema([
                            TextInput::make('label')->required(),
                            TextInput::make('since')->required(),
                        ])
                        ->itemLabel(fn (array $state): ?string => trim(($state['label'] ?? '').' — '.($state['since'] ?? ''), ' —') ?: null)
                        ->formatStateUsing(fn ($state) => $state ?? [])
                        ->addActionLabel('Add thing')
                        ->defaultItems(0),
                    Repeater::make("{$prefix}trajectory")
                        ->label('Trajectory')
                        ->columns(2)
                        ->collapsed()
                        ->schema([
                            TextInput::make('role')->required(),
                            TextInput::make('organization')->required(),
                            TextInput::make('period')->required(),
                            Toggle::make('includeInResume')->label('Include in résumé')->inline(false),
                            static::stringListRepeater('highlights', 'Highlights', 'Add highlight')->columnSpanFull(),
                            Toggle::make('hidden')->inline(false),
                        ])
                        ->itemLabel(fn (array $state): ?string => trim(($state['role'] ?? '').' — '.($state['organization'] ?? ''), ' —') ?: null)
                        ->formatStateUsing(fn ($state) => $state ?? [])
                        ->addActionLabel('Add trajectory entry')
                        ->defaultItems(0),
                    Repeater::make("{$prefix}milestones")
                        ->label('Milestones')
                        ->columns(2)
                        ->collapsed()
                        ->schema([
                            TextInput::make('year')->required(),
                            TextInput::make('title')->required(),
                            Textarea::make('description')->rows(2)->columnSpanFull()->nullable(),
                            Toggle::make('hidden')->inline(false),
                        ])
                        ->itemLabel(fn (array $state): ?string => trim(($state['year'] ?? '').' — '.($state['title'] ?? ''), ' —') ?: null)
                        ->formatStateUsing(fn ($state) => $state ?? [])
                        ->addActionLabel('Add milestone')
                        ->defaultItems(0),
                ]),
            ])
            ->model($this->getRecord())
            ->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();
        $data = $this->extractTranslationsBeforeSave($data);

        $this->getRecord()->update($data);
        $this->persistTranslations();

        Notification::make()->success()->title('Saved')->send();
    }
}
