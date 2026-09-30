<?php

namespace App\Filament\Pages;

use App\Content\EditorialRevisionPublisher;
use App\Content\HomeGallerySection;
use App\Filament\Concerns\BuildsMarkdownEditors;
use App\Filament\Concerns\BuildsStructuredFields;
use App\Filament\Concerns\BuildsTranslationTabs;
use App\Filament\Concerns\HasSingleSaveAction;
use App\Filament\Concerns\ManagesPageContent;
use App\Filament\Concerns\SyncsTranslations;
use App\Models\PageRevision;
use BackedEnum;
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Pages\PageConfiguration;
use Filament\Schemas\Components\Fieldset;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;

/**
 * @extends Page<PageConfiguration>
 *
 * @property-read Schema $form
 */
class ManageHome extends Page
{
    use BuildsMarkdownEditors, BuildsStructuredFields, BuildsTranslationTabs, HasSingleSaveAction, ManagesPageContent, SyncsTranslations;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedHome;

    protected static ?string $navigationLabel = 'Manage Home';

    protected string $view = 'filament-panels::pages.page';

    public ?array $data = [];

    protected static function managedPageSlug(): string
    {
        return 'home';
    }

    public function mount(): void
    {
        $data = $this->fillManagedPageData();
        $revision = $this->getPageRecord()->currentRevision()->first();
        $sections = $revision instanceof PageRevision ? $revision->homeSections()->get() : null;
        $sectionKeys = array_keys(HomeGallerySection::DEFAULTS);
        $knownSections = $sections?->whereIn('section_key', $sectionKeys);
        $data['home_sections'] = $knownSections?->isNotEmpty()
            ? $knownSections->where('enabled', true)->pluck('section_key')->all()
            : array_keys(HomeGallerySection::DEFAULTS);

        $this->form->fill($data);
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                static::pageSettingsSection(),
                Section::make(__('Home gallery'))
                    ->schema([
                        CheckboxList::make('home_sections')
                            ->label(__('Visible sections'))
                            ->options(collect(HomeGallerySection::LABELS)
                                ->map(fn (string $label): string => __($label))
                                ->all())
                            ->columns(2),
                    ]),
                static::localizedTabs('translations', fn (string $prefix): array => [
                    ...static::pageTranslationFields($prefix),
                    Fieldset::make(__('Hero'))
                        ->columns(2)
                        ->schema([
                            TextInput::make("{$prefix}fields.hero_identity")->label(__('Hero identity'))->nullable(),
                            static::markdownEditor("{$prefix}fields.hero_experience")->label(__('Hero experience'))->nullable(),
                            static::markdownEditor("{$prefix}fields.hero_current_focus")->label(__('Current focus'))->nullable(),
                            TextInput::make("{$prefix}fields.available_label")->label(__('Available label'))->nullable(),
                            TextInput::make("{$prefix}fields.unavailable_label")->label(__('Unavailable label'))->nullable(),
                        ]),
                    Fieldset::make(__('Experience'))
                        ->columns(2)
                        ->schema([
                            TextInput::make("{$prefix}fields.experience_title")->label(__('Experience title'))->nullable(),
                            static::markdownEditor("{$prefix}fields.experience_description")->label(__('Experience description'))->nullable(),
                            TextInput::make("{$prefix}fields.currently_exploring_label")->label(__('Currently exploring label'))->nullable(),
                            TextInput::make("{$prefix}fields.recurring_technologies_label")->label(__('Recurring technologies label'))->nullable(),
                        ]),
                    Fieldset::make(__('Work'))
                        ->columns(2)
                        ->schema([
                            TextInput::make("{$prefix}fields.work_title")->label(__('Work title'))->nullable(),
                            static::markdownEditor("{$prefix}fields.work_description")->label(__('Work description'))->nullable(),
                        ]),
                    Fieldset::make(__('Projects'))
                        ->columns(2)
                        ->schema([
                            TextInput::make("{$prefix}fields.projects_title")->label(__('Projects title'))->nullable(),
                            static::markdownEditor("{$prefix}fields.projects_description")->label(__('Projects description'))->nullable(),
                            static::markdownEditor("{$prefix}fields.experiments_summary")->label(__('Experiments summary'))->nullable(),
                        ]),
                    Fieldset::make(__('Writing'))
                        ->columns(2)
                        ->schema([
                            TextInput::make("{$prefix}fields.writing_title")->label(__('Writing title'))->nullable(),
                            static::markdownEditor("{$prefix}fields.writing_description")->label(__('Writing description'))->nullable(),
                        ]),
                    Fieldset::make(__('Contact'))
                        ->columns(2)
                        ->schema([
                            TextInput::make("{$prefix}fields.contact_title")->label(__('Contact title'))->nullable(),
                            static::markdownEditor("{$prefix}fields.contact_description")->label(__('Contact description'))->nullable(),
                        ]),
                ]),
            ])
            ->model($this->getPageRecord())
            ->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();
        $sections = $data['home_sections'] ?? [];
        unset($data['home_sections']);

        $this->saveManagedPage($data);
        app(EditorialRevisionPublisher::class)->syncPageRelations($this->getPageRecord(), $sections);

        Notification::make()->success()->title(__('Saved'))->send();
    }
}
