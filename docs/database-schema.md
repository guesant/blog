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

Production never migrates on boot. `docker/entrypoint.prod.sh` refuses to start
without a database and applies nothing. Applying a migration in production is a
deliberate step, after a backup.

## Tables outside the admin CRUD

`content_relations`, `relation_types`, `audit_log` and `audit_requests` are mapped
so the migrations cover them, but they have no `DbSet` and no admin page. The public
site reads the first three with raw SQL. `audit_log` is read-only and frozen: nothing
in this application appends to it.
