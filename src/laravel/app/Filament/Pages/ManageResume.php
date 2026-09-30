<?php

namespace App\Filament\Pages;

use App\Content\EditorialRevisionPublisher;
use App\Filament\Concerns\BuildsMarkdownEditors;
use App\Filament\Concerns\BuildsStructuredFields;
use App\Filament\Concerns\BuildsTranslationTabs;
use App\Filament\Concerns\HasSingleSaveAction;
use App\Filament\Concerns\SyncsTranslations;
use App\Filament\Support\AutocompleteField;
use App\Filament\Support\FilamentOptionCatalog;
use App\Jobs\GenerateResumePdf as GenerateResumePdfJob;
use App\Models\CaseStudy;
use App\Models\Page as ContentPage;
use App\Models\Resume;
use App\Models\ResumeLanguage;
use App\Models\ResumeSkill;
use App\Models\Technology;
use App\Models\Topic;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Facades\DB;
use Throwable;

/**
 * @property-read Schema $form
 */
class ManageResume extends Page
{
    use BuildsMarkdownEditors, BuildsStructuredFields, BuildsTranslationTabs, HasSingleSaveAction, SyncsTranslations;

    protected static function entryRepeater(string $name, string $label, array $fields, string $labelKey): Repeater
    {
        return Repeater::make($name)
            ->label($label)
            ->columns(2)
            ->collapsed()
            ->schema($fields)
            ->itemLabel(fn (mixed $state): ?string => is_array($state) ? ($state[$labelKey] ?? null) : null)
            ->formatStateUsing(fn (mixed $state): array => is_array($state) ? $state : [])
            ->addActionLabel(__('Add entry'))
            ->defaultItems(0);
    }

    private static function autocompleteOptions(array $values): array
    {
        return collect($values)
            ->filter(fn (mixed $value): bool => is_scalar($value) && filled((string) $value))
            ->map(fn (mixed $value): string => (string) $value)
            ->unique()
            ->values()
            ->all();
    }

    private static function proficiencies(): array
    {
        return self::autocompleteOptions([
            ...array_keys(FilamentOptionCatalog::PROFICIENCIES),
            ...ResumeLanguage::query()->distinct()->pluck('proficiency')->all(),
        ]);
    }

    private static function technicalProductionKinds(): array
    {
        return self::autocompleteOptions([
            ...array_keys(FilamentOptionCatalog::TECHNICAL_PRODUCTION_KINDS),
            ...DB::table('resume_revision_technical_productions')->distinct()->pluck('kind')->all(),
        ]);
    }

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedDocumentText;

    protected string $view = 'filament-panels::pages.page';

    public ?array $data = [];

    protected ?Resume $record = null;

    protected ?ContentPage $resumePageRecord = null;

    protected array $pendingSelectedCases = [];

    protected array $pendingSkills = [];

    public function mount(): void
    {
        $this->record = Resume::query()->first() ?? Resume::create();

        $data = $this->record->attributesToArray();
        $revisionHidden = $this->record->currentRevision()->value('hidden');
        $data['hidden'] = (bool) ($revisionHidden ?? $this->record->getAttribute('hidden'));
        $data = $this->fillTranslationsIntoData($data);
        $resumePage = $this->getResumePageRecord();
        $data['page_translations'] = $this->fillTranslationsForRecord($resumePage, [])['translations'] ?? [];

        $data['selected_cases'] = $this->record->selectedCases()
            ->get()
            ->map(fn ($case) => ['case_study_id' => $case->id])
            ->all();

        $data['skills'] = $this->record->skills()
            ->with('technologies')
            ->get()
            ->map(fn (ResumeSkill $skill) => [
                'topic_id' => $skill->topic_id,
                'technologies' => $skill->technologies->pluck('id')->all(),
            ])
            ->all();

        $this->form->fill($data);
    }

    protected function getRecord(): Resume
    {
        return $this->record ??= Resume::query()->first() ?? Resume::create();
    }

    protected function getResumePageRecord(): ContentPage
    {
        return $this->resumePageRecord ??= ContentPage::query()->firstOrCreate(['slug' => 'resume']);
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('regeneratePdfs')
                ->label(__('Regenerate PDFs'))
                ->action(function () {
                    try {
                        foreach (['en', 'pt-BR'] as $locale) {
                            GenerateResumePdfJob::dispatchSync($locale);
                        }

                        Notification::make()->success()->title(__('Résumé PDFs regenerated'))->send();
                    } catch (Throwable) {
                        Notification::make()
                            ->warning()
                            ->title(__('Résumé PDFs were not regenerated'))
                            ->body(__('Complete the profile, résumé and site settings before generating PDFs.'))
                            ->send();
                    }
                }),
        ];
    }

    protected static function resumeSettingsSection(): Section
    {
        return Section::make(__('Resume settings'))
            ->schema([
                Toggle::make('hidden')
                    ->label(__('Hide from public site'))
                    ->default(false),
            ]);
    }

    protected static function resumePageSection(): Section
    {
        return Section::make(__('Resume page'))
            ->schema([
                static::localizedTabs('page_translations', fn (string $prefix): array => [
                    TextInput::make("{$prefix}fields.title")
                        ->label(__('Title'))
                        ->nullable(),
                    static::markdownEditor("{$prefix}fields.description")
                        ->label(__('Excerpt'))
                        ->nullable(),
                    static::seoFieldset($prefix),
                ]),
            ]);
    }

    protected static function selectedCasesSection(): Section
    {
        return Section::make(__('Selected Cases'))
            ->schema([
                Repeater::make('selected_cases')
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
                    ->addActionLabel(__('Add case'))
                    ->defaultItems(0),
            ]);
    }

    protected static function skillsSection(): Section
    {
        return Section::make(__('Skills'))
            ->schema([
                Repeater::make('skills')
                    ->reorderableWithButtons()
                    ->columns(2)
                    ->schema([
                        Select::make('topic_id')
                            ->label('Topic')
                            ->options(fn () => Topic::query()->where('kind', 'skill')->pluck('slug', 'id'))
                            ->searchable()
                            ->required()
                            ->columnSpanFull(),
                        Select::make('technologies')
                            ->label('Technologies')
                            ->options(fn () => Technology::query()->pluck('slug', 'id'))
                            ->multiple()
                            ->searchable()
                            ->preload()
                            ->columnSpanFull(),
                    ])
                    ->itemLabel(fn (mixed $state): ?string => is_array($state) && isset($state['topic_id'])
                        ? Topic::find($state['topic_id'])?->slug
                        : null)
                    ->addActionLabel(__('Add skill category'))
                    ->defaultItems(0),
            ]);
    }

    protected static function languagesSection(array $proficiencies): Section
    {
        return Section::make(__('Languages'))
            ->schema([
                Repeater::make('languages')
                    ->relationship('languages')
                    ->orderColumn('order')
                    ->reorderableWithButtons()
                    ->columns(2)
                    ->schema([
                        Select::make('language_id')
                            ->label('Language')
                            ->relationship('language', 'slug')
                            ->required(),
                        AutocompleteField::make(
                            'proficiency',
                            'Proficiency',
                            $proficiencies,
                        ),
                    ])
                    ->itemLabel(fn (mixed $state): ?string => is_array($state) ? ($state['proficiency'] ?? null) : null)
                    ->addActionLabel(__('Add language'))
                    ->defaultItems(0),
            ]);
    }

    protected static function translationSections(string $prefix, array $technicalProductionKinds): array
    {
        return [
            static::markdownEditor("{$prefix}summary")
                ->label('Summary')
                ->nullable(),
            static::entryRepeater("{$prefix}leadership", 'Leadership', [
                TextInput::make('organization')->required(),
                TextInput::make('period')->required(),
                TextInput::make('role')->required()->columnSpanFull(),
                static::stringListRepeater('highlights', 'Highlights', 'Add highlight')->columnSpanFull(),
                Toggle::make('hidden')->inline(false),
            ], 'organization'),
            static::entryRepeater("{$prefix}education", 'Education', [
                TextInput::make('institution')->required(),
                TextInput::make('period')->required(),
                TextInput::make('degree')->required(),
                TextInput::make('location')->nullable(),
                Toggle::make('hidden')->inline(false),
            ], 'institution'),
            static::entryRepeater("{$prefix}certificates", 'Certificates', [
                TextInput::make('name')->required(),
                TextInput::make('period')->required(),
                TextInput::make('issuer')->nullable(),
                TextInput::make('credentialId')->label('Credential ID')->nullable(),
                TextInput::make('url')->url()->nullable()->columnSpanFull(),
                Toggle::make('hidden')->inline(false),
            ], 'name'),
            static::entryRepeater("{$prefix}certifications", 'Certifications', [
                TextInput::make('name')->required(),
                TextInput::make('period')->required(),
                TextInput::make('issuer')->nullable(),
                TextInput::make('credentialId')->label('Credential ID')->nullable(),
                TextInput::make('url')->url()->nullable()->columnSpanFull(),
                Toggle::make('hidden')->inline(false),
            ], 'name'),
            static::entryRepeater("{$prefix}publications", 'Publications', [
                TextInput::make('name')->required(),
                TextInput::make('period')->required(),
                TextInput::make('issuer')->nullable(),
                TextInput::make('url')->url()->nullable(),
                Toggle::make('hidden')->inline(false),
            ], 'name'),
            static::entryRepeater("{$prefix}recommendations", 'Recommendations', [
                TextInput::make('author')->required(),
                TextInput::make('period')->nullable(),
                TextInput::make('role')->nullable()->columnSpanFull(),
                static::markdownEditor('quote')->required(),
                TextInput::make('url')->url()->nullable(),
                Toggle::make('hidden')->inline(false),
            ], 'author'),
            static::entryRepeater("{$prefix}technical_productions", 'Technical Productions', [
                TextInput::make('name')->required(),
                TextInput::make('period')->required(),
                AutocompleteField::make('kind', 'Kind', $technicalProductionKinds),
                TextInput::make('url')->url()->nullable(),
                static::markdownEditor('description')->nullable(),
                Toggle::make('includeInPdf')->label('Include in PDF')->inline(false),
                Toggle::make('hidden')->inline(false),
            ], 'name'),
            static::entryRepeater("{$prefix}events", 'Events', [
                TextInput::make('name')->required(),
                TextInput::make('period')->required(),
                TextInput::make('role')->nullable(),
                TextInput::make('talkTitle')->label('Talk title')->nullable(),
                TextInput::make('location')->nullable(),
                TextInput::make('url')->url()->nullable(),
                Toggle::make('includeInPdf')->label('Include in PDF')->inline(false),
                Toggle::make('hidden')->inline(false),
            ], 'name'),
            static::entryRepeater("{$prefix}awards", 'Awards', [
                TextInput::make('name')->required(),
                TextInput::make('period')->required(),
                TextInput::make('issuer')->nullable(),
                TextInput::make('url')->url()->nullable(),
                static::markdownEditor('description')->nullable(),
                Toggle::make('hidden')->inline(false),
            ], 'name'),
        ];
    }

    public function form(Schema $schema): Schema
    {
        $proficiencies = self::proficiencies();
        $technicalProductionKinds = self::technicalProductionKinds();

        return $schema
            ->components([
                static::resumeSettingsSection(),
                static::resumePageSection(),
                static::selectedCasesSection(),
                static::skillsSection(),
                static::languagesSection($proficiencies),
                static::translationTabs(fn (string $prefix): array => static::translationSections($prefix, $technicalProductionKinds)),
            ])
            ->model($this->getRecord())
            ->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();
        $pageTranslations = $data['page_translations'] ?? [];

        $this->pendingSelectedCases = $data['selected_cases'] ?? [];
        $this->pendingSkills = $data['skills'] ?? [];
        unset($data['selected_cases'], $data['skills'], $data['languages'], $data['page_translations']);

        $data = $this->extractTranslationsBeforeSave($data);

        $this->getRecord()->update($data);
        $this->persistTranslations();

        $this->getRecord()->selectedCases()->sync(
            collect($this->pendingSelectedCases)->values()->mapWithKeys(fn (array $item, int $order) => [
                $item['case_study_id'] => ['order' => $order],
            ])
        );

        $this->getRecord()->skills()->delete();
        foreach (array_values($this->pendingSkills) as $order => $item) {
            $skill = $this->getRecord()->skills()->create([
                'topic_id' => $item['topic_id'],
                'order' => $order,
            ]);
            $skill->technologies()->sync($item['technologies'] ?? []);
        }

        app(EditorialRevisionPublisher::class)->syncResumeRelations($this->getRecord());

        $resumePage = $this->getResumePageRecord();
        $resumePage->update(['hidden' => (bool) $data['hidden']]);
        $this->publishTranslationsFor($resumePage, $pageTranslations, $resumePage->attributesToArray());

        Notification::make()->success()->title(__('Saved'))->send();
    }
}
