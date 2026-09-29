<?php

namespace App\Filament\Resources\Pages\Schemas;

use App\Content\HomeGallerySection;
use App\Filament\Concerns\BuildsMarkdownEditors;
use App\Filament\Concerns\BuildsStructuredFields;
use App\Filament\Concerns\BuildsTranslationTabs;
use App\Models\CaseStudy;
use App\Models\PageRevisionTranslation;
use App\Models\Project;
use App\Models\Writing;
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Component;
use Filament\Schemas\Components\Fieldset;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;

class PageForm
{
    use BuildsMarkdownEditors, BuildsStructuredFields, BuildsTranslationTabs;

    private const FIELD_LABELS = [
        'activitypub_description' => 'ActivityPub description',
        'activitypub_title' => 'ActivityPub title',
        'ai_body' => 'AI body',
        'ai_heading' => 'AI heading',
        'api_description' => 'API description',
        'api_title' => 'API title',
        'atom_description' => 'Atom description',
        'atom_title' => 'Atom title',
        'jsonfeed_description' => 'JSON Feed description',
        'jsonfeed_title' => 'JSON Feed title',
        'robots_description' => 'robots.txt description',
        'robots_title' => 'robots.txt title',
        'rss_description' => 'RSS description',
        'rss_title' => 'RSS title',
        'sitemap_description' => 'Sitemap description',
        'sitemap_title' => 'Sitemap title',
        'webfinger_description' => 'WebFinger description',
        'webfinger_title' => 'WebFinger title',
        'webmention_description' => 'Webmention description',
        'webmention_title' => 'Webmention title',
        'websub_description' => 'WebSub description',
        'websub_title' => 'WebSub title',
    ];

    private const PAGE_FIELD_GROUPS = [
        'home' => [
            'Hero' => ['hero_identity', 'hero_experience', 'hero_current_focus', 'available_label', 'unavailable_label'],
            'Experience' => ['experience_title', 'experience_description', 'currently_exploring_label', 'recurring_technologies_label'],
            'Work' => ['work_title', 'work_description'],
            'Projects' => ['projects_title', 'projects_description', 'experiments_summary'],
            'Writing' => ['writing_title', 'writing_description'],
            'Contact' => ['contact_title', 'contact_description'],
        ],
        'about' => [
            'Introduction' => ['lead', 'context', 'introduction'],
            'Timeline' => ['timeline_title', 'timeline_description'],
            'Story' => ['story_title', 'story'],
        ],
        'follow' => [
            'Current' => ['intro', 'section_label', 'section_title'],
            'Future' => ['future_label', 'future_title', 'planned_label', 'planned_title'],
            'Feeds' => [
                'activitypub_description', 'activitypub_title', 'api_description', 'api_title',
                'atom_description', 'atom_title', 'jsonfeed_description', 'jsonfeed_title',
                'robots_description', 'robots_title', 'rss_description', 'rss_title',
                'sitemap_description', 'sitemap_title', 'webfinger_description', 'webfinger_title',
                'webmention_description', 'webmention_title', 'websub_description', 'websub_title',
            ],
        ],
        'license' => [
            'License content' => [
                'section_label', 'section_title', 'code_heading', 'code_body', 'content_heading',
                'content_body', 'ai_heading', 'ai_body', 'contact',
            ],
        ],
        'now' => [
            'Current status' => ['trabalhando', 'construindo', 'estudando', 'lendo', 'ouvindo', 'assistindo'],
        ],
        'portfolio' => [
            'Hero' => ['hero_identity', 'hero_experience', 'hero_current_focus', 'available_label'],
            'Work' => ['work_title', 'work_description'],
            'Projects' => ['projects_title', 'projects_description', 'experiments_summary'],
        ],
        'projects' => [
            'Projects' => ['selected_label', 'archive_label', 'experiments_title'],
        ],
    ];

    protected static function pageFieldInputs(string $prefix): array
    {
        /** @var array<string, Component> $fields */
        $fields = collect(PageRevisionTranslation::FIELDS)->mapWithKeys(function (string $key) use ($prefix) {
            $field = "{$prefix}fields.{$key}";
            $label = self::FIELD_LABELS[$key] ?? str($key)->headline()->toString();

            if ($key === 'story' || str_ends_with($key, '_body') || str_ends_with($key, '_description') || in_array($key, ['context', 'intro', 'introduction', 'lead'], true)) {
                $component = static::markdownEditor($field);
            } elseif (str_ends_with($key, '_title') || str_ends_with($key, '_label') || in_array($key, ['hero_identity', 'hero_experience', 'hero_current_focus', 'title'], true)) {
                $component = TextInput::make($field);
            } else {
                $component = Textarea::make($field)->rows(3);
            }

            return [$key => $component->label($label)->nullable()];
        })->all();

        $components = [
            $fields['title'],
            $fields['description']->visible(
                fn (Get $get): bool => ! in_array($get('slug', true), ['follow', 'now'], true),
            ),
        ];

        foreach (self::PAGE_FIELD_GROUPS as $slug => $groups) {
            foreach ($groups as $group => $keys) {
                $groupFields = collect($keys)
                    ->map(fn (string $key) => $fields[$key] ?? null)
                    ->filter()
                    ->values()
                    ->all();

                if ($groupFields === []) {
                    continue;
                }

                $components[] = Fieldset::make($group)
                    ->columns(2)
                    ->schema($groupFields)
                    ->visible(fn (Get $get): bool => $get('slug', true) === $slug);
            }
        }

        return $components;
    }

    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Page settings')
                    ->schema([
                        TextInput::make('slug')
                            ->required()
                            ->live()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),
                    ]),
                Section::make('Home gallery')
                    ->visible(fn (Get $get): bool => $get('slug') === 'home')
                    ->schema([
                        CheckboxList::make('home_sections')
                            ->label('Visible sections')
                            ->options(HomeGallerySection::LABELS)
                            ->default(array_keys(array_filter(HomeGallerySection::DEFAULTS)))
                            ->columns(2),
                    ]),
                Section::make('Featured Cases')
                    ->visible(fn (Get $get): bool => $get('slug') === 'portfolio')
                    ->schema([
                        Repeater::make('featured_cases')
                            ->reorderableWithButtons()
                            ->columns(2)
                            ->schema([
                                Select::make('case_study_id')
                                    ->label('Case Study')
                                    ->options(fn () => CaseStudy::query()->pluck('slug', 'id'))
                                    ->searchable()
                                    ->required(),
                            ])
                            ->itemLabel(fn (mixed $state): ?string => is_array($state) && isset($state['case_study_id'])
                                ? CaseStudy::find($state['case_study_id'])?->slug
                                : null)
                            ->addActionLabel('Add case')
                            ->defaultItems(0),
                    ]),
                Section::make('Featured Projects')
                    ->visible(fn (Get $get): bool => $get('slug') === 'portfolio')
                    ->schema([
                        Repeater::make('featured_projects')
                            ->reorderableWithButtons()
                            ->columns(2)
                            ->schema([
                                Select::make('project_id')
                                    ->label('Project')
                                    ->options(fn () => Project::query()->pluck('slug', 'id'))
                                    ->searchable()
                                    ->required(),
                            ])
                            ->itemLabel(fn (mixed $state): ?string => is_array($state) && isset($state['project_id'])
                                ? Project::find($state['project_id'])?->slug
                                : null)
                            ->addActionLabel('Add project')
                            ->defaultItems(0),
                    ]),
                Section::make('Featured Writings')
                    ->visible(fn (Get $get): bool => $get('slug') === 'portfolio')
                    ->schema([
                        Repeater::make('featured_writings')
                            ->reorderableWithButtons()
                            ->columns(2)
                            ->schema([
                                Select::make('writing_id')
                                    ->label('Writing')
                                    ->options(fn () => Writing::query()->pluck('slug', 'id'))
                                    ->searchable()
                                    ->required(),
                            ])
                            ->itemLabel(fn (mixed $state): ?string => is_array($state) && isset($state['writing_id'])
                                ? Writing::find($state['writing_id'])?->slug
                                : null)
                            ->addActionLabel('Add writing')
                            ->defaultItems(0),
                    ]),
                static::translationTabs(fn (string $prefix) => [
                    ...static::pageFieldInputs($prefix),
                    static::seoFieldset($prefix),
                ]),
            ]);
    }
}
