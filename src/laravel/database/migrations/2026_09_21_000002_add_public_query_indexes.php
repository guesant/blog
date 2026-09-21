<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('CREATE EXTENSION IF NOT EXISTS pg_trgm');

        $indexes = [
            'CREATE INDEX IF NOT EXISTS resources_public_order_idx ON public.resources ("order", id) WHERE hidden IS FALSE AND visibility = \'public\'',
            'CREATE INDEX IF NOT EXISTS resources_public_found_date_idx ON public.resources (found_date_iso DESC NULLS LAST, id) WHERE hidden IS FALSE AND visibility = \'public\'',
            'CREATE INDEX IF NOT EXISTS resources_public_published_date_idx ON public.resources (published_date_iso DESC NULLS LAST, id) WHERE hidden IS FALSE AND visibility = \'public\'',
            'CREATE INDEX IF NOT EXISTS resources_public_popularity_idx ON public.resources (popularity_rank DESC NULLS LAST, "order", id) WHERE hidden IS FALSE AND visibility = \'public\'',
            'CREATE INDEX IF NOT EXISTS resources_public_type_order_idx ON public.resources (type, "order", id) WHERE hidden IS FALSE AND visibility = \'public\'',
            'CREATE INDEX IF NOT EXISTS resources_public_rating_idx ON public.resources (rating, "order", id) WHERE hidden IS FALSE AND visibility = \'public\' AND rating IS NOT NULL',
            'CREATE INDEX IF NOT EXISTS resources_public_consumption_idx ON public.resources (consumption_state, "order", id) WHERE hidden IS FALSE AND visibility = \'public\' AND consumption_state IS NOT NULL',
            'CREATE INDEX IF NOT EXISTS resources_authors_trgm_idx ON public.resources USING gin (authors gin_trgm_ops) WHERE authors IS NOT NULL',
            'CREATE INDEX IF NOT EXISTS resources_organizations_trgm_idx ON public.resources USING gin (organizations gin_trgm_ops) WHERE organizations IS NOT NULL',
            'CREATE INDEX IF NOT EXISTS resource_translations_locale_title_idx ON public.resource_translations (locale, lower(title), resource_id)',
            'CREATE INDEX IF NOT EXISTS resource_translations_text_trgm_idx ON public.resource_translations USING gin (title gin_trgm_ops, alternative_title gin_trgm_ops, description gin_trgm_ops, reason_found gin_trgm_ops)',
            'CREATE INDEX IF NOT EXISTS resource_links_resource_id_idx ON public.resource_links (resource_id)',
            'CREATE INDEX IF NOT EXISTS resource_links_free_idx ON public.resource_links (resource_id) WHERE is_free IS TRUE',
            'CREATE INDEX IF NOT EXISTS resource_links_platform_trgm_idx ON public.resource_links USING gin (platform gin_trgm_ops) WHERE platform IS NOT NULL',
            'CREATE INDEX IF NOT EXISTS resource_identifiers_resource_id_idx ON public.resource_identifiers (resource_id)',
            'CREATE INDEX IF NOT EXISTS resource_identifiers_value_trgm_idx ON public.resource_identifiers USING gin (value gin_trgm_ops)',
            'CREATE INDEX IF NOT EXISTS topicables_lookup_idx ON public.topicables (topicable_type, topicable_id, topic_id)',
            'CREATE INDEX IF NOT EXISTS reference_collection_item_order_idx ON public.reference_collection_item (reference_collection_id, "order", resource_id)',
            'CREATE INDEX IF NOT EXISTS case_studies_public_order_idx ON public.case_studies ("order", id) WHERE hidden IS FALSE AND nda IS FALSE',
            'CREATE INDEX IF NOT EXISTS case_study_translations_locale_title_idx ON public.case_study_translations (locale, lower(title), case_study_id)',
            'CREATE INDEX IF NOT EXISTS project_public_order_idx ON public.projects ("order", id) WHERE hidden IS FALSE AND nda IS FALSE',
            'CREATE INDEX IF NOT EXISTS project_translations_locale_name_idx ON public.project_translations (locale, lower(name), project_id)',
            'CREATE INDEX IF NOT EXISTS experiment_public_order_idx ON public.experiments ("order", id) WHERE hidden IS FALSE',
            'CREATE INDEX IF NOT EXISTS experiment_translations_locale_name_idx ON public.experiment_translations (locale, lower(name), experiment_id)',
            'CREATE INDEX IF NOT EXISTS reference_collections_public_order_idx ON public.reference_collections ("order", id) WHERE hidden IS FALSE',
            'CREATE INDEX IF NOT EXISTS reference_collection_translations_locale_title_idx ON public.reference_collection_translations (locale, lower(title), reference_collection_id)',
            'CREATE INDEX IF NOT EXISTS snippets_public_order_idx ON public.snippets ("order", id) WHERE hidden IS FALSE',
            'CREATE INDEX IF NOT EXISTS writings_public_date_idx ON public.writings (date_iso DESC NULLS LAST, id) WHERE hidden IS FALSE',
            'CREATE INDEX IF NOT EXISTS writing_translations_locale_title_idx ON public.writing_translations (locale, lower(title), writing_id)',
            'CREATE INDEX IF NOT EXISTS technologies_public_order_idx ON public.technologies ("order", id) WHERE hidden IS FALSE',
            'CREATE INDEX IF NOT EXISTS technology_translations_locale_name_idx ON public.technology_translations (locale, lower(name), technology_id)',
            'CREATE INDEX IF NOT EXISTS topics_public_order_idx ON public.topics ("order", id) WHERE hidden IS FALSE',
            'CREATE INDEX IF NOT EXISTS topic_translations_locale_name_idx ON public.topic_translations (locale, lower(name), topic_id)',
            'CREATE INDEX IF NOT EXISTS credit_entries_active_order_idx ON public.credit_entries ("order", id) WHERE active IS TRUE',
        ];

        foreach ($indexes as $index) {
            DB::statement($index);
        }
    }

    public function down(): void
    {
        foreach ([
            'resources_public_order_idx',
            'resources_public_found_date_idx',
            'resources_public_published_date_idx',
            'resources_public_popularity_idx',
            'resources_public_type_order_idx',
            'resources_public_rating_idx',
            'resources_public_consumption_idx',
            'resources_authors_trgm_idx',
            'resources_organizations_trgm_idx',
            'resource_translations_locale_title_idx',
            'resource_translations_text_trgm_idx',
            'resource_links_resource_id_idx',
            'resource_links_free_idx',
            'resource_links_platform_trgm_idx',
            'resource_identifiers_resource_id_idx',
            'resource_identifiers_value_trgm_idx',
            'topicables_lookup_idx',
            'reference_collection_item_order_idx',
            'case_studies_public_order_idx',
            'case_study_translations_locale_title_idx',
            'project_public_order_idx',
            'project_translations_locale_name_idx',
            'experiment_public_order_idx',
            'experiment_translations_locale_name_idx',
            'reference_collections_public_order_idx',
            'reference_collection_translations_locale_title_idx',
            'snippets_public_order_idx',
            'writings_public_date_idx',
            'writing_translations_locale_title_idx',
            'technologies_public_order_idx',
            'technology_translations_locale_name_idx',
            'topics_public_order_idx',
            'topic_translations_locale_name_idx',
            'credit_entries_active_order_idx',
        ] as $index) {
            DB::statement("DROP INDEX IF EXISTS public.{$index}");
        }
    }
};
