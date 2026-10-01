<?php

namespace App\Filament\Resources\Pages\Schemas;

use App\Filament\Concerns\BuildsMarkdownEditors;
use App\Filament\Concerns\BuildsStructuredFields;
use App\Filament\Concerns\BuildsTranslationTabs;
use App\Filament\Resources\Pages\PageResource;
use App\Models\PageRevisionTranslation;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
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
        'license' => [
            'License content' => [
                'section_label', 'section_title', 'code_heading', 'code_body', 'content_heading',
                'content_body', 'ai_heading', 'ai_body', 'contact',
            ],
        ],
        'now' => [
            'Current status' => ['trabalhando', 'construindo', 'estudando', 'lendo', 'ouvindo', 'assistindo'],
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
            $label = __(self::FIELD_LABELS[$key] ?? str($key)->headline()->toString());

            if ($key === 'story' || str_ends_with($key, '_body') || str_ends_with($key, '_description') || in_array($key, ['context', 'intro', 'introduction', 'lead'], true)) {
                $component = static::markdownEditor($field);
            } elseif (str_ends_with($key, '_title') || str_ends_with($key, '_label') || in_array($key, ['hero_identity', 'hero_experience', 'hero_current_focus', 'title'], true)) {
                $component = TextInput::make($field);
            } else {
                $component = static::markdownEditor($field);
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

                $components[] = Fieldset::make(__($group))
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
                Section::make(__('Page settings'))
                    ->schema([
                        TextInput::make('slug')
                            ->required()
                            ->live()
                            ->unique(ignoreRecord: true)
                            ->notIn(PageResource::MANAGED_SLUGS)
                            ->maxLength(255),
                        Toggle::make('hidden')
                            ->label(__('Hide from public site'))
                            ->default(false),
                    ]),
                static::translationTabs(fn (string $prefix) => [
                    ...static::pageFieldInputs($prefix),
                ]),
            ]);
    }
}
