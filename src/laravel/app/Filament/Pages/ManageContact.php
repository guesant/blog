<?php

namespace App\Filament\Pages;

use App\Filament\Concerns\BuildsMarkdownEditors;
use App\Filament\Concerns\BuildsStructuredFields;
use App\Filament\Concerns\BuildsTranslationTabs;
use App\Filament\Concerns\HasSingleSaveAction;
use App\Filament\Concerns\ManagesPageContent;
use App\Filament\Concerns\SyncsTranslations;
use App\Models\Platform;
use App\Models\SiteSettings;
use BackedEnum;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Pages\PageConfiguration;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;

/**
 * @extends Page<PageConfiguration>
 *
 * @property-read Schema $form
 */
class ManageContact extends Page
{
    use BuildsMarkdownEditors, BuildsStructuredFields, BuildsTranslationTabs, HasSingleSaveAction, ManagesPageContent, SyncsTranslations;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedEnvelope;

    protected static ?string $navigationLabel = 'Manage Contact';

    protected string $view = 'filament-panels::pages.page';

    public ?array $data = [];

    protected ?SiteSettings $settingsRecord = null;

    protected static function managedPageSlug(): string
    {
        return 'contact';
    }

    public function mount(): void
    {
        $settings = $this->getSettingsRecord();
        $data = $this->fillManagedPageData();
        $data['contact_email'] = $settings->contact_email;
        $data['contact_enabled'] = $settings->contact_enabled;
        $data['contact_available'] = $settings->contact_available;
        $data['contactProfiles'] = $settings->contactProfiles()
            ->orderBy('order')
            ->get()
            ->map(fn ($profile): array => [
                'platform_id' => $profile->platform_id,
                'url' => $profile->url,
            ])
            ->all();

        $this->form->fill($data);
    }

    protected function getSettingsRecord(): SiteSettings
    {
        return $this->settingsRecord ??= SiteSettings::query()->first() ?? SiteSettings::create([]);
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                static::pageSettingsSection(),
                Section::make(__('Contact settings'))
                    ->columns(2)
                    ->schema([
                        TextInput::make('contact_email')
                            ->label(__('E-mail'))
                            ->email()
                            ->nullable()
                            ->maxLength(255),
                        Toggle::make('contact_enabled')
                            ->label(__('Show Contact'))
                            ->default(true),
                        Toggle::make('contact_available')
                            ->label(__('Available for Opportunities'))
                            ->default(false),
                    ]),
                Section::make(__('Contact Profiles'))
                    ->schema([
                        Repeater::make('contactProfiles')
                            ->reorderableWithButtons()
                            ->columns(2)
                            ->schema([
                                Select::make('platform_id')
                                    ->label(__('Platform'))
                                    ->options(fn () => Platform::query()->pluck('label', 'id'))
                                    ->searchable()
                                    ->preload()
                                    ->required(),
                                TextInput::make('url')
                                    ->label(__('URL'))
                                    ->required()
                                    ->url()
                                    ->columnSpanFull(),
                            ])
                            ->itemLabel(fn (array $state): ?string => Platform::query()
                                ->find($state['platform_id'] ?? null)?->label)
                            ->addActionLabel(__('Add contact profile'))
                            ->defaultItems(0),
                    ]),
                static::localizedTabs('translations', fn (string $prefix): array => static::pageTranslationFields($prefix)),
            ])
            ->model($this->getPageRecord())
            ->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();
        $settingsData = [
            'contact_email' => $data['contact_email'] ?? null,
            'contact_enabled' => (bool) ($data['contact_enabled'] ?? false),
            'contact_available' => (bool) ($data['contact_available'] ?? false),
        ];
        $contactProfiles = $data['contactProfiles'] ?? [];
        unset($data['contact_email'], $data['contact_enabled'], $data['contact_available'], $data['contactProfiles']);

        $this->saveManagedPage($data);

        $settings = $this->getSettingsRecord();
        $settings->update($settingsData);
        $settings->contactProfiles()->delete();
        foreach (array_values($contactProfiles) as $order => $profile) {
            $settings->contactProfiles()->create([
                'platform_id' => $profile['platform_id'],
                'url' => $profile['url'],
                'order' => $order,
            ]);
        }
        $settingsTranslations = $this->fillTranslationsForRecord($settings, [])['translations'] ?? [];
        $this->publishTranslationsFor($settings, $settingsTranslations, $settings->attributesToArray());

        Notification::make()->success()->title(__('Saved'))->send();
    }
}
