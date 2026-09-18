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

Production never migrates on boot. Applying a migration in production is a deliberate
step, after a backup.

## PostgreSQL

The Blazor runtime no longer opens PostgreSQL connections. It reads the public contract
from Laravel through `PORTFOLIO_CONTENT_API_URL`; Laravel owns public queries, filtering,
snapshot caching and the protected email challenge. The EF model and migrations remain
for schema compatibility, data tooling and the popularity collector while the final
Laravel and Next image is prepared.

`DateOnly` columns are native `date` and every `DateTime` is `timestamp without time
zone` (`BlogModel.ApplyColumnTypes`), because the legacy values this schema was
imported from are wall-clock timestamps with no zone. Do not start writing
`DateTime.UtcNow` from the admin without revisiting that mapping.

PostgreSQL truncates identifiers to 63 characters, so the two Laravel index names longer
than that (`reference_collection_translations_reference_collection_id_locale_unique` and
`FK_site_settings_translations_site_settings_site_settings_id`) exist truncated.

Laravel invalidates its snapshot cache by the `content_revisions` row after committed
writes. Backups are not the app's job:
`just db-backup` runs `pg_dump -Fc` into `data/snapshots/`, and `just db-restore <file>`
restores it with `pg_restore --clean --if-exists`.

`just test-data` runs `Blog.Blazor.Data.Tests`: it creates a throwaway PostgreSQL
database, migrates it, seeds it with plain SQL, and checks that the schema and seed remain
usable. Public filtering and snapshot behavior are tested by Laravel's feature suite.

## The content was imported from SQLite

The site's content was originally in a SQLite database (a Laravel export). It moved to
PostgreSQL through a one-off importer (`Blog.Blazor.Import`, removed after use, see
`docs/pendencias-e-decisoes.md`): it copied every table via `COPY ... FROM STDIN (FORMAT
BINARY)`, without depending on the EF model, so it also carried the tables that have no
`DbSet` on the admin context. The last SQLite state before the cutover is kept as the
single backup in `data/snapshots/`.

## Database model and runtime API

`BlogAdminDbContext` remains the EF model used by the migrations assembly and operational
data tools. The running Blazor application has no public or admin EF context. Its public
data comes from Laravel's `/api/v1/public-site` and `/api/v1/public/knowledge-map`
contracts, which are also consumed directly by the Next application.

## Tables outside the admin CRUD

`content_relations`, `relation_types`, `audit_log` and `audit_requests` remain mapped so
the migrations cover them, but their public reads now belong to Laravel. `audit_log` is
read-only and frozen: nothing in this application appends to it.
