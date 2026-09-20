<?php

namespace App\Filament\Resources\Pages\Schemas;

use App\Filament\Concerns\BuildsTranslationTabs;
use App\Models\CaseStudy;
use App\Models\Page;
use App\Models\Project;
use App\Models\Writing;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\MarkdownEditor;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class PageForm
{
    use BuildsTranslationTabs;

    /**
     * Every page stores a different set of copy fields in one JSON column
     * (home has ~22, credits has 2). Rather than a raw JSON textarea, build
     * one real input per key found on the record — long prose becomes a
     * textarea, the about-page story a markdown editor, everything else a
     * text input.
     */
    protected static function pageFieldInputs(?Page $record, string $prefix): array
    {
        if (! $record) {
            return [
                KeyValue::make("{$prefix}fields")
                    ->label('Fields')
                    ->keyLabel('Field')
                    ->valueLabel('Copy')
                    ->helperText('Field keys become editable as dedicated inputs after the page is saved once.'),
            ];
        }

        $translations = $record->translations->keyBy('locale');
        $keys = $translations
            ->flatMap(fn ($translation) => array_keys($translation->fields ?? []))
            ->unique()
            ->values();

        return $keys->map(function (string $key) use ($translations, $prefix) {
            $label = Str::headline($key);
            $values = $translations->map(fn ($translation) => $translation->fields[$key] ?? '');
            $isLong = $values->contains(fn ($value) => is_string($value)
                && (mb_strlen($value) > 140 || str_contains($value, "\n")));

            if ($key === 'story') {
                return MarkdownEditor::make("{$prefix}fields.{$key}")->label($label)->nullable();
            }

            if ($isLong) {
                return Textarea::make("{$prefix}fields.{$key}")->label($label)->rows(3)->nullable();
            }

            return TextInput::make("{$prefix}fields.{$key}")->label($label)->nullable();
        })->all();
    }

    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make()
                    ->schema([
                        TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),
                    ]),
                Section::make('Featured Cases')
                    ->schema([
                        Repeater::make('featured_cases')
                            ->columns(2)
                            ->schema([
                                Select::make('case_study_id')
                                    ->label('Case Study')
                                    ->options(fn () => CaseStudy::query()->pluck('slug', 'id'))
                                    ->searchable()
                                    ->required(),
                                TextInput::make('order')->numeric()->nullable(),
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
                            ->columns(2)
                            ->schema([
                                Select::make('project_id')
                                    ->label('Project')
                                    ->options(fn () => Project::query()->pluck('slug', 'id'))
                                    ->searchable()
                                    ->required(),
                                TextInput::make('order')->numeric()->nullable(),
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
                            ->columns(2)
                            ->schema([
                                Select::make('writing_id')
                                    ->label('Writing')
                                    ->options(fn () => Writing::query()->pluck('slug', 'id'))
                                    ->searchable()
                                    ->required(),
                                TextInput::make('order')->numeric()->nullable(),
                            ])
                            ->itemLabel(fn (array $state): ?string => isset($state['writing_id'])
                                ? Writing::find($state['writing_id'])?->slug
                                : null)
                            ->addActionLabel('Add writing')
                            ->defaultItems(0),
                    ]),
                static::translationTabs(fn (string $prefix) => [
                    Group::make()
                        ->schema(fn (?Page $record) => static::pageFieldInputs($record, $prefix)),
                ]),
            ]);
    }
}
