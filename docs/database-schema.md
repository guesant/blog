# Database schema

The PostgreSQL schema is owned by EF Core migrations in `Blog.Blazor.Database`.
The table and column names are snake_case and the indexes carry the naming of the
Laravel application this content was imported from (`projects_slug_unique` rather
than `IX_projects_slug`). The model preserves those names deliberately, via
`HasDatabaseName`, so the migrations describe the database that actually exists.

Two conventions are turned off or overridden for the same reason:

- `ForeignKeyIndexConvention` is removed in `BlogAdminDbContext.ConfigureConventions`.
  EF indexes every foreign key by convention; this database indexes only what it
  declares, and adopting the convention would have added 22 indexes that production
  does not have.
- 30 columns carry `HasDefaultValue`, matching the `default '0'` and similar clauses
  Laravel emitted.

## The initial migration is a baseline

`InitialSchema` was generated from the model. The content was imported from a legacy
SQLite export table by table (see the "Importing content" section below), matched
against the migrated, empty schema, so the row counts and shapes tie out to what that
export held.

## Working on the schema

    just db-migration <Name>   # author a migration from model changes
    just db-update              # apply pending migrations to the dev database
    just schema                # fail if the model has changes with no migration

`just schema` runs inside `just check`. It is what keeps the model and the migrations
from drifting apart; it does not compare against a live database.

Production never migrates on boot. `.docker/entrypoint.prod.sh` refuses to start
without a database and applies nothing. Applying a migration in production is a
deliberate step, after a backup.

## PostgreSQL

The app runs on PostgreSQL only, through `PORTFOLIO_DB_CONNECTION` (admin, read-write)
and optionally `PORTFOLIO_DB_READ_CONNECTION` (a SELECT-only role for the public site;
falls back to the admin connection). Both are required at startup; there is no other
provider to fall back to. The public readers always open PostgreSQL sessions with
`default_transaction_read_only=on`, so they cannot write even with a permissive role.
`Data/DatabaseServiceCollectionExtensions.cs` is the only place that configures a
provider for the running app.

`DateOnly` columns are native `date` and every `DateTime` is `timestamp without time
zone` (`BlogModel.ApplyColumnTypes`), because the legacy values this schema was
imported from are wall-clock timestamps with no zone. Do not start writing
`DateTime.UtcNow` from the admin without revisiting that mapping.

PostgreSQL truncates identifiers to 63 characters, so the two Laravel index names longer
than that (`reference_collection_translations_reference_collection_id_locale_unique` and
`FK_site_settings_translations_site_settings_site_settings_id`) exist truncated.

The public cache invalidates by the `content_revisions` row, read through the public
context; the admin bumps that row after every committed write through
`ContentRevisionTracker.SignalContentChangedAsync`. Backups are not the app's job:
`just db-backup` runs `pg_dump -Fc` into `data/snapshots/`, and `just db-restore <file>`
restores it with `pg_restore --clean --if-exists`.

`just test-data` runs `Blog.Blazor.Data.Tests`: it creates a throwaway PostgreSQL
database, migrates it, seeds it with plain SQL, builds the public snapshot and knowledge
graph through the real providers, and asserts the hidden-content rules, the declared
query filters, the orderings and that the fingerprint refreshes after a signalled write.

## The content was imported from SQLite

The site's content was originally in a SQLite database (a Laravel export). It moved to
PostgreSQL through a one-off importer (`Blog.Blazor.Import`, removed after use, see
`docs/pendencias-e-decisoes.md`): it copied every table via `COPY ... FROM STDIN (FORMAT
BINARY)`, without depending on the EF model, so it also carried the tables that have no
`DbSet` on the admin context. The last SQLite state before the cutover is kept as the
single backup in `data/snapshots/`.

## Two contexts

`BlogModel.Configure` builds one EF model; two contexts use it.

`BlogAdminDbContext` is the admin's read-write context, unfiltered, and the one the
migrations assemblies target. `BlogPublicDbContext` is what the public site reads
through (`PublicSiteContentProvider`, `PublicKnowledgeGraphProvider` and the LINQ queries
in `src/Blog/Blog.Blazor/PublicQueries/`). It applies `PublicVisibilityFilters` as
global query filters (`hidden`, `nda`, `visibility = 'public'`, active credits), runs with
`QueryTrackingBehavior.NoTracking`, throws from `SaveChanges`, and gets a connection opened
with `default_transaction_read_only=on`. Reaching a filtered parent from a pivot uses an explicit
`join` on the filtered `DbSet`, never the navigation, so the row disappears instead of
turning into a left join with nulls. `IgnoreQueryFilters` is forbidden in the runtime by
`verify-hidden-content.sh`; only the data tests use it, to prove the filters bite.

## Tables outside the admin CRUD

`content_relations`, `relation_types`, `audit_log` and `audit_requests` are mapped
so the migrations cover them, but they have no admin page. The first three have a `DbSet`
only on the public context, which is where the site reads them. `audit_log` is read-only
and frozen: nothing in this application appends to it.
