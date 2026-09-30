<?php

namespace App\Filament\Pages;

use App\Filament\Concerns\BuildsMarkdownEditors;
use App\Filament\Concerns\BuildsStructuredFields;
use App\Filament\Concerns\BuildsTranslationTabs;
use App\Filament\Concerns\HasSingleSaveAction;
use App\Filament\Concerns\ManagesPageContent;
use App\Filament\Concerns\SyncsTranslations;
use App\Models\CaseStudy;
use App\Models\Project;
use App\Models\Writing;
use BackedEnum;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Pages\PageConfiguration;
use Filament\Schemas\Components\Fieldset;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;

/**
 * @extends Page<PageConfiguration>
 *
 * @property-read Schema $form
 */
class ManagePortfolio extends Page
{
    use BuildsMarkdownEditors, BuildsStructuredFields, BuildsTranslationTabs, HasSingleSaveAction, ManagesPageContent, SyncsTranslations;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBriefcase;

    protected static ?string $navigationLabel = 'Manage Portfolio';

    protected string $view = 'filament-panels::pages.page';

    public ?array $data = [];

    protected static function managedPageSlug(): string
    {
        return 'portfolio';
    }

    public function mount(): void
    {
        $data = $this->fillManagedPageData();
        $data['featured_cases'] = $this->getPageRecord()->featuredCases()
            ->orderByPivot('order')
            ->get()
            ->map(fn ($case): array => ['case_study_id' => $case->id])
            ->all();
        $data['featured_projects'] = $this->getPageRecord()->featuredProjects()
            ->orderByPivot('order')
            ->get()
            ->map(fn ($project): array => ['project_id' => $project->id])
            ->all();
        $data['featured_writings'] = $this->getPageRecord()->featuredWritings()
            ->orderByPivot('order')
            ->get()
            ->map(fn ($writing): array => ['writing_id' => $writing->id])
            ->all();

        $this->form->fill($data);
    }

    protected static function featuredRepeater(string $name, string $label, string $key, string $model, string $column): Repeater
    {
        return Repeater::make($name)
            ->label(__($label))
            ->reorderableWithButtons()
            ->schema([
                Select::make($key)
                    ->label(__($label))
                    ->options(fn () => $model::query()->pluck($column, 'id'))
                    ->searchable()
                    ->required(),
            ])
            ->itemLabel(fn (mixed $state): ?string => is_array($state) && isset($state[$key])
                ? $model::find($state[$key])?->{$column}
                : null)
            ->addActionLabel(__('Add item'))
            ->defaultItems(0);
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                static::pageSettingsSection(),
                static::featuredRepeater('featured_cases', 'Featured cases', 'case_study_id', CaseStudy::class, 'slug'),
                static::featuredRepeater('featured_projects', 'Featured projects', 'project_id', Project::class, 'slug'),
                static::featuredRepeater('featured_writings', 'Featured writings', 'writing_id', Writing::class, 'slug'),
                static::localizedTabs('translations', fn (string $prefix): array => [
                    ...static::pageTranslationFields($prefix),
                    Fieldset::make(__('Hero'))
                        ->columns(2)
                        ->schema([
                            TextInput::make("{$prefix}fields.hero_identity")->label(__('Hero identity'))->nullable(),
                            static::markdownEditor("{$prefix}fields.hero_experience")->label(__('Hero experience'))->nullable(),
                            static::markdownEditor("{$prefix}fields.hero_current_focus")->label(__('Current focus'))->nullable(),
                            TextInput::make("{$prefix}fields.available_label")->label(__('Available label'))->nullable(),
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
                ]),
            ])
            ->model($this->getPageRecord())
            ->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();
        $relationData = [
            'featured_cases' => $data['featured_cases'] ?? [],
            'featured_projects' => $data['featured_projects'] ?? [],
            'featured_writings' => $data['featured_writings'] ?? [],
        ];
        unset($data['featured_cases'], $data['featured_projects'], $data['featured_writings']);

        $this->saveManagedPage($data);
        $this->syncFeaturedPageContent($relationData);

        Notification::make()->success()->title(__('Saved'))->send();
    }
}
