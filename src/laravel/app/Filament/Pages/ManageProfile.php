<?php

namespace App\Filament\Pages;

use App\Filament\Concerns\BuildsMarkdownEditors;
use App\Filament\Concerns\BuildsStructuredFields;
use App\Filament\Concerns\BuildsTranslationTabs;
use App\Filament\Concerns\HasSingleSaveAction;
use App\Filament\Concerns\SyncsTranslations;
use App\Models\Page as ContentPage;
use App\Models\Profile;
use BackedEnum;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Fieldset;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;

/**
 * @property-read Schema $form
 */
class ManageProfile extends Page
{
    use BuildsMarkdownEditors, BuildsStructuredFields, BuildsTranslationTabs, HasSingleSaveAction, SyncsTranslations;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedUser;

    protected string $view = 'filament-panels::pages.page';

    public ?array $data = [];

    protected ?Profile $record = null;

    protected ?ContentPage $aboutPageRecord = null;

    public function mount(): void
    {
        $this->record = Profile::query()->first() ?? Profile::create(['name' => '']);

        $data = $this->record->attributesToArray();
        $data = $this->fillTranslationsIntoData($data);
        $aboutPage = $this->getAboutPageRecord();
        $data['about_page_hidden'] = (bool) $aboutPage->getAttribute('hidden');
        $data['about_translations'] = $this->fillTranslationsForRecord($aboutPage, [])['translations'] ?? [];

        $this->form->fill($data);
    }

    protected function getRecord(): Profile
    {
        return $this->record ??= Profile::query()->first() ?? Profile::create(['name' => '']);
    }

    protected function getAboutPageRecord(): ContentPage
    {
        return $this->aboutPageRecord ??= ContentPage::query()->firstOrCreate(['slug' => 'about']);
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make(__('Profile settings'))
                    ->columns(2)
                    ->schema([
                        TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        DatePicker::make('birth_date')
                            ->nullable(),
                        Toggle::make('hidden')
                            ->label(__('Hide from public site'))
                            ->default(false),
                    ]),
                static::translationTabs(fn (string $prefix) => [
                    Fieldset::make(__('Profile identity'))
                        ->columns(2)
                        ->schema([
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
                        ]),
                    Fieldset::make(__('Profile narrative'))
                        ->columns(2)
                        ->schema([
                            static::markdownEditor("{$prefix}description")
                                ->label('Description')
                                ->nullable(),
                            static::markdownEditor("{$prefix}interests")
                                ->label('Interests')
                                ->nullable(),
                            static::markdownEditor("{$prefix}learning")
                                ->label('Learning')
                                ->nullable(),
                        ]),
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
                        ->itemLabel(fn (mixed $state): ?string => is_array($state)
                            ? trim(($state['label'] ?? '').' — '.($state['since'] ?? ''), ' —') ?: null
                            : null)
                        ->formatStateUsing(fn (mixed $state): array => is_array($state) ? $state : [])
                        ->addActionLabel(__('Add thing'))
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
                        ->itemLabel(fn (mixed $state): ?string => is_array($state)
                            ? trim(($state['role'] ?? '').' — '.($state['organization'] ?? ''), ' —') ?: null
                            : null)
                        ->formatStateUsing(fn (mixed $state): array => is_array($state) ? $state : [])
                        ->addActionLabel(__('Add trajectory entry'))
                        ->defaultItems(0),
                    Repeater::make("{$prefix}milestones")
                        ->label('Milestones')
                        ->columns(2)
                        ->collapsed()
                        ->schema([
                            TextInput::make('year')->required(),
                            TextInput::make('title')->required(),
                            static::markdownEditor('description')->nullable(),
                            Toggle::make('hidden')->inline(false),
                        ])
                        ->itemLabel(fn (mixed $state): ?string => is_array($state)
                            ? trim(($state['year'] ?? '').' — '.($state['title'] ?? ''), ' —') ?: null
                            : null)
                        ->formatStateUsing(fn (mixed $state): array => is_array($state) ? $state : [])
                        ->addActionLabel(__('Add milestone'))
                        ->defaultItems(0),
                ]),
                Section::make(__('About page'))
                    ->schema([
                        Toggle::make('about_page_hidden')
                            ->label(__('Hide from public site'))
                            ->default(false),
                        static::localizedTabs('about_translations', fn (string $prefix): array => [
                            TextInput::make("{$prefix}fields.title")
                                ->label(__('Title'))
                                ->nullable(),
                            static::markdownEditor("{$prefix}fields.description")
                                ->label(__('Description'))
                                ->nullable(),
                            Fieldset::make(__('Introduction'))
                                ->columns(2)
                                ->schema([
                                    static::markdownEditor("{$prefix}fields.lead")->label(__('Lead'))->nullable(),
                                    static::markdownEditor("{$prefix}fields.context")->label(__('Context'))->nullable(),
                                    static::markdownEditor("{$prefix}fields.introduction")->label(__('Introduction'))->nullable(),
                                ]),
                            Fieldset::make(__('Timeline'))
                                ->columns(2)
                                ->schema([
                                    TextInput::make("{$prefix}fields.timeline_title")->label(__('Timeline title'))->nullable(),
                                    static::markdownEditor("{$prefix}fields.timeline_description")->label(__('Timeline description'))->nullable(),
                                ]),
                            Fieldset::make(__('Story'))
                                ->columns(2)
                                ->schema([
                                    TextInput::make("{$prefix}fields.story_title")->label(__('Story title'))->nullable(),
                                    static::markdownEditor("{$prefix}fields.story")->label(__('Story'))->nullable(),
                                ]),
                        ]),
                    ]),
            ])
            ->model($this->getRecord())
            ->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();
        $aboutHidden = (bool) ($data['about_page_hidden'] ?? false);
        $aboutTranslations = $data['about_translations'] ?? [];
        unset($data['about_page_hidden'], $data['about_translations']);
        $data = $this->extractTranslationsBeforeSave($data);

        $this->getRecord()->update($data);
        $this->persistTranslations();

        $aboutPage = $this->getAboutPageRecord();
        $aboutPage->update(['hidden' => $aboutHidden]);
        $this->publishTranslationsFor($aboutPage, $aboutTranslations, $aboutPage->attributesToArray());

        Notification::make()->success()->title(__('Saved'))->send();
    }
}
