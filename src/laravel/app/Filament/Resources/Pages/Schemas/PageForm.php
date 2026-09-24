<?php

namespace App\Filament\Resources\Pages\Schemas;

use App\Filament\Concerns\BuildsTranslationTabs;
use App\Models\CaseStudy;
use App\Models\PageRevisionTranslation;
use App\Models\Project;
use App\Models\Writing;
use Filament\Forms\Components\MarkdownEditor;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PageForm
{
    use BuildsTranslationTabs;

    protected static function pageFieldInputs(string $prefix): array
    {
        return collect(PageRevisionTranslation::FIELDS)->map(function (string $key) use ($prefix) {
            $field = "{$prefix}fields.{$key}";
            $label = str($key)->headline()->toString();

            if ($key === 'story' || str_ends_with($key, '_body') || str_ends_with($key, '_description') || in_array($key, ['context', 'intro', 'introduction', 'lead'], true)) {
                return MarkdownEditor::make($field)->label($label)->nullable();
            }

            if (str_ends_with($key, '_title') || str_ends_with($key, '_label') || in_array($key, ['hero_identity', 'hero_experience', 'hero_current_focus', 'title', 'eyebrow'], true)) {
                return TextInput::make($field)->label($label)->nullable();
            }

            return Textarea::make($field)->label($label)->rows(3)->nullable();
        })->all();
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
                static::translationTabs(fn (string $prefix) => [
                    Group::make()
                        ->schema(fn () => static::pageFieldInputs($prefix)),
                ]),
            ]);
    }
}
