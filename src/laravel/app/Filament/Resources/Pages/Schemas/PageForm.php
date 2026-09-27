<?php

namespace App\Filament\Resources\Pages\Schemas;

use App\Content\HomeGallerySection;
use App\Filament\Concerns\BuildsTranslationTabs;
use App\Models\CaseStudy;
use App\Models\PageRevisionTranslation;
use App\Models\Project;
use App\Models\Writing;
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\MarkdownEditor;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Fieldset;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;

class PageForm
{
    use BuildsTranslationTabs;

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

    private const FIELDSET_LABELS = [
        'activitypub' => 'ActivityPub',
        'ai' => 'AI',
        'api' => 'API',
        'atom' => 'Atom',
        'code' => 'Code license',
        'contact' => 'Contact',
        'content' => 'Content license',
        'experiments' => 'Experiments',
        'experience' => 'Experience',
        'hero' => 'Hero',
        'jsonfeed' => 'JSON Feed',
        'projects' => 'Projects',
        'robots' => 'robots.txt',
        'rss' => 'RSS',
        'section' => 'Section',
        'sitemap' => 'Sitemap',
        'story' => 'Story',
        'timeline' => 'Timeline',
        'webfinger' => 'WebFinger',
        'webmention' => 'Webmention',
        'websub' => 'WebSub',
        'work' => 'Work',
        'writing' => 'Writing',
    ];

    protected static function pageFieldInputs(string $prefix): array
    {
        $fields = collect(PageRevisionTranslation::FIELDS)->mapWithKeys(function (string $key) use ($prefix) {
            $field = "{$prefix}fields.{$key}";
            $label = self::FIELD_LABELS[$key] ?? str($key)->headline()->toString();

            if ($key === 'story' || str_ends_with($key, '_body') || str_ends_with($key, '_description') || in_array($key, ['context', 'intro', 'introduction', 'lead'], true)) {
                $component = MarkdownEditor::make($field);
            } elseif (str_ends_with($key, '_title') || str_ends_with($key, '_label') || in_array($key, ['hero_identity', 'hero_experience', 'hero_current_focus', 'title', 'eyebrow'], true)) {
                $component = TextInput::make($field);
            } else {
                $component = Textarea::make($field)->rows(3);
            }

            return [$key => $component->label($label)->nullable()];
        });

        return collect(PageRevisionTranslation::FIELDS)
            ->groupBy(fn (string $key): string => str_contains($key, '_')
                ? str($key)->before('_')->toString()
                : '')
            ->flatMap(function (array $keys, string $group) use ($fields): array {
                $components = collect($keys)
                    ->map(fn (string $key) => $fields->get($key))
                    ->filter()
                    ->values()
                    ->all();

                if ($group === '' || count($keys) < 2) {
                    return $components;
                }

                return [
                    Fieldset::make(self::FIELDSET_LABELS[$group] ?? str($group)->headline()->toString())
                        ->columns(2)
                        ->schema($components),
                ];
            })
            ->values()
            ->all();
    }

    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Page settings')
                    ->schema([
                        TextInput::make('slug')
                            ->required()
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
                            ->itemLabel(fn (array $state): ?string => isset($state['case_study_id'])
                                ? CaseStudy::find($state['case_study_id'])?->slug
                                : null)
                            ->addActionLabel('Add case')
                            ->defaultItems(0),
                    ]),
                Section::make('Featured Projects')
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
                            ->itemLabel(fn (array $state): ?string => isset($state['project_id'])
                                ? Project::find($state['project_id'])?->slug
                                : null)
                            ->addActionLabel('Add project')
                            ->defaultItems(0),
                    ]),
                Section::make('Featured Writings')
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
                            ->itemLabel(fn (array $state): ?string => isset($state['writing_id'])
                                ? Writing::find($state['writing_id'])?->slug
                                : null)
                            ->addActionLabel('Add writing')
                            ->defaultItems(0),
                    ]),
                static::translationTabs(fn (string $prefix) => static::pageFieldInputs($prefix)),
            ]);
    }
}
