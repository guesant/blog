# Database schema

The SQLite schema is owned by EF Core migrations in `Portfolio.Blazor.Database`.
It used to be owned by Laravel's migrations, which is why the table and column
names are snake_case and the indexes carry Laravel's naming (`projects_slug_unique`
rather than `IX_projects_slug`). The model preserves those names deliberately, via
`HasDatabaseName`, so the migrations describe the database that actually exists.

Two conventions are turned off or overridden for the same reason:

- `ForeignKeyIndexConvention` is removed in `PortfolioAdminDbContext.ConfigureConventions`.
  EF indexes every foreign key by convention; this database indexes only what it
  declares, and adopting the convention would have added 22 indexes that production
  does not have.
- 30 columns carry `HasDefaultValue`, matching the `default '0'` and similar clauses
  Laravel emitted.

## The initial migration is a baseline

`InitialSchema` was generated from the model and then recorded as applied against the
existing database by inserting its row into `__EFMigrationsHistory`. It was never run
against a populated database. Before recording it, a database built from the migration
was compared against the live one: 52 tables, 402 columns, 33 indexes and 48 foreign
keys, with zero differences in names, defaults, nullability or primary keys.

## Working on the schema

    just db-migration <Name>   # author a migration from model changes
    just db-update             # apply pending migrations to the dev database
    just schema                # fail if the model has changes with no migration

`just schema` runs inside `just check`. It is what keeps the model and the migrations
from drifting apart; it does not compare against a live database.

Production never migrates on boot. `.docker/entrypoint.prod.sh` refuses to start
without a database and applies nothing. Applying a migration in production is a
deliberate step, after a backup.

## Two providers

The app runs on SQLite (default) or PostgreSQL, chosen by `PORTFOLIO_DB_PROVIDER`
(`sqlite` | `postgres`). PostgreSQL needs `PORTFOLIO_DB_CONNECTION` (admin, read-write)
and optionally `PORTFOLIO_DB_READ_CONNECTION` (a SELECT-only role for the public site;
falls back to the admin connection). The public readers always open PostgreSQL sessions
with `default_transaction_read_only=on`, so they cannot write even with a permissive role.

The EF model is shared; each provider has its own migrations assembly, generated from the
same model with that provider's design-time factory:

    Portfolio.Blazor.Database            # SQLite, the historical baseline
    Portfolio.Blazor.Database.Postgres   # PostgreSQL, generated fresh (InitialSchema)

    just db-migration <Name> [sqlite|postgres]
    just db-update [sqlite|postgres]
    just schema                          # has-pending-model-changes for both assemblies

Provider-specific mapping lives in `PortfolioModel.ApplyProviderMappings`, shared by both
contexts: on
PostgreSQL, `DateOnly` columns are native `date` (the lenient text converter is SQLite-only)
and every `DateTime` is `timestamp without time zone`, because the legacy values are
wall-clock timestamps with no zone. Do not start writing `DateTime.UtcNow` from the admin
without revisiting that mapping.

PostgreSQL truncates identifiers to 63 characters, so the two Laravel index names longer
than that (`reference_collection_translations_reference_collection_id_locale_unique` and
`FK_site_settings_translations_site_settings_site_settings_id`) exist truncated there. The
"zero differences" claim above is about the SQLite baseline only.

The public cache invalidates by file length and mtime on SQLite and by the
`content_revisions` row on PostgreSQL (read through the public context); the admin bumps that row after every committed write
through `IDatabaseProvider.SignalContentChangedAsync` (on SQLite the same call is the WAL
checkpoint). Backups are not the app's job on either engine: copy the SQLite file (the
`Portfolio.Blazor.Snapshot` CLI does that for dev snapshots) or run `pg_dump` from the host.

`just test-data` runs `Portfolio.Blazor.Data.Tests`: it migrates a fresh SQLite file, seeds it
with plain SQL, builds the public snapshot and knowledge graph through the real providers,
and asserts the hidden-content rules, the declared query filters and the orderings. With `PORTFOLIO_TEST_PG_CONNECTION` set
(`just test-data-postgres`, and the `postgres-smoke` CI job) it does the same against a
throwaway PostgreSQL database and requires the two JSON outputs to be identical.

## Two contexts

`PortfolioModel.Configure` builds one EF model; two contexts use it.

`PortfolioAdminDbContext` is the admin's read-write context, unfiltered, and the one the
migrations assemblies target. `PortfolioPublicDbContext` is what the public site reads
through (`PublicSiteContentProvider`, `PublicKnowledgeGraphProvider` and the LINQ queries
in `src/Portfolio/Portfolio.Blazor/PublicQueries/`). It applies `PublicVisibilityFilters` as
global query filters (`hidden`, `nda`, `visibility = 'public'`, active credits), runs with
`QueryTrackingBehavior.NoTracking`, throws from `SaveChanges`, and gets its connection from
`IDatabaseProvider.ConfigurePublicRead`: SQLite opened with `Mode=ReadOnly`, PostgreSQL with
`default_transaction_read_only=on`. Reaching a filtered parent from a pivot uses an explicit
`join` on the filtered `DbSet`, never the navigation, so the row disappears instead of
turning into a left join with nulls. `IgnoreQueryFilters` is forbidden in the runtime by
`verify-hidden-content.sh`; only the data tests use it, to prove the filters bite.

## Tables outside the admin CRUD

`content_relations`, `relation_types`, `audit_log` and `audit_requests` are mapped
so the migrations cover them, but they have no admin page. The first three have a `DbSet`
only on the public context, which is where the site reads them. `audit_log` is read-only
and frozen: nothing in this application appends to it.
