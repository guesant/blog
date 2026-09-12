using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Blog.Blazor.Database.Migrations
{
    /// <inheritdoc />
    public partial class InitialSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "audit_log",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    auditable_type = table.Column<string>(type: "text", nullable: false),
                    auditable_id = table.Column<int>(type: "integer", nullable: false),
                    action = table.Column<string>(type: "text", nullable: false),
                    old_values = table.Column<string>(type: "text", nullable: true),
                    new_values = table.Column<string>(type: "text", nullable: true),
                    request_id = table.Column<string>(type: "text", nullable: true),
                    ip = table.Column<string>(type: "text", nullable: true),
                    user_agent = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_audit_log", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "audit_requests",
                columns: table => new
                {
                    request_id = table.Column<string>(type: "text", nullable: false),
                    method = table.Column<string>(type: "text", nullable: false),
                    path = table.Column<string>(type: "text", nullable: false),
                    ip = table.Column<string>(type: "text", nullable: true),
                    user_agent = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_audit_requests", x => x.request_id);
                });

            migrationBuilder.CreateTable(
                name: "case_studies",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    slug = table.Column<string>(type: "text", nullable: false),
                    public_id = table.Column<string>(type: "character varying(6)", maxLength: 6, nullable: false),
                    hidden = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    order = table.Column<int>(type: "integer", nullable: false),
                    href = table.Column<string>(type: "text", nullable: true),
                    external = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    visual = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    nda = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    published_at = table.Column<DateOnly>(type: "date", nullable: true),
                    show_history = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_case_studies", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "content_revisions",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false),
                    version = table.Column<long>(type: "bigint", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_content_revisions", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "credit_entries",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    url = table.Column<string>(type: "text", nullable: true),
                    category = table.Column<string>(type: "text", nullable: false),
                    order = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    is_automatic = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    package_manager = table.Column<string>(type: "text", nullable: true),
                    package_name = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_credit_entries", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "experiments",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    slug = table.Column<string>(type: "text", nullable: false),
                    public_id = table.Column<string>(type: "character varying(6)", maxLength: 6, nullable: false),
                    hidden = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    order = table.Column<int>(type: "integer", nullable: false),
                    href = table.Column<string>(type: "text", nullable: true),
                    external = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    published_at = table.Column<DateOnly>(type: "date", nullable: true),
                    show_history = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_experiments", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "languages",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    slug = table.Column<string>(type: "text", nullable: false),
                    order = table.Column<int>(type: "integer", nullable: false),
                    code = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_languages", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "nav_items",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    route_name = table.Column<string>(type: "text", nullable: false),
                    parent_id = table.Column<int>(type: "integer", nullable: true),
                    placement = table.Column<string>(type: "text", nullable: true),
                    sidebar_group = table.Column<int>(type: "integer", nullable: true),
                    order = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_nav_items", x => x.id);
                    table.ForeignKey(
                        name: "FK_nav_items_nav_items_parent_id",
                        column: x => x.parent_id,
                        principalTable: "nav_items",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "pages",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    slug = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_pages", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "profiles",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: true),
                    birth_date = table.Column<DateOnly>(type: "date", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_profiles", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "projects",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    slug = table.Column<string>(type: "text", nullable: false),
                    public_id = table.Column<string>(type: "character varying(6)", maxLength: 6, nullable: false),
                    hidden = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    order = table.Column<int>(type: "integer", nullable: false),
                    href = table.Column<string>(type: "text", nullable: true),
                    external = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    nda = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    published_at = table.Column<DateOnly>(type: "date", nullable: true),
                    show_history = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_projects", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "reference_collections",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    slug = table.Column<string>(type: "text", nullable: false),
                    public_id = table.Column<string>(type: "character varying(6)", maxLength: 6, nullable: false),
                    hidden = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    order = table.Column<int>(type: "integer", nullable: false),
                    image = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    published_at = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_reference_collections", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "relation_types",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    key = table.Column<string>(type: "text", nullable: false),
                    family = table.Column<string>(type: "text", nullable: false),
                    symmetric = table.Column<bool>(type: "boolean", nullable: false),
                    outbound_label_en = table.Column<string>(type: "text", nullable: false),
                    outbound_label_pt_br = table.Column<string>(type: "text", nullable: false),
                    inbound_label_en = table.Column<string>(type: "text", nullable: false),
                    inbound_label_pt_br = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_relation_types", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "resumes",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_resumes", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "site_settings",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    short_name = table.Column<string>(type: "text", nullable: true),
                    portfolio_url = table.Column<string>(type: "text", nullable: true),
                    maintenance_enabled = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    contact_email = table.Column<string>(type: "text", nullable: true),
                    contact_available = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    source_repository_url = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_site_settings", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "snippets",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    slug = table.Column<string>(type: "text", nullable: false),
                    public_id = table.Column<string>(type: "character varying(6)", maxLength: 6, nullable: false),
                    hidden = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    show_history = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    order = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    published_at = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_snippets", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "technologies",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    slug = table.Column<string>(type: "text", nullable: false),
                    public_id = table.Column<string>(type: "character varying(6)", maxLength: 6, nullable: false),
                    order = table.Column<int>(type: "integer", nullable: false),
                    code = table.Column<string>(type: "text", nullable: true),
                    logo = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_technologies", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "topics",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    slug = table.Column<string>(type: "text", nullable: false),
                    public_id = table.Column<string>(type: "character varying(6)", maxLength: 6, nullable: false),
                    order = table.Column<int>(type: "integer", nullable: false),
                    kind = table.Column<string>(type: "text", nullable: false, defaultValue: "topic"),
                    parent_id = table.Column<int>(type: "integer", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_topics", x => x.id);
                    table.ForeignKey(
                        name: "FK_topics_topics_parent_id",
                        column: x => x.parent_id,
                        principalTable: "topics",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "writings",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    slug = table.Column<string>(type: "text", nullable: false),
                    public_id = table.Column<string>(type: "character varying(6)", maxLength: 6, nullable: false),
                    hidden = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    date_iso = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    show_history = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    type = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_writings", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "case_study_translations",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    case_study_id = table.Column<int>(type: "integer", nullable: false),
                    locale = table.Column<string>(type: "text", nullable: false),
                    title = table.Column<string>(type: "text", nullable: false),
                    status = table.Column<string>(type: "text", nullable: true),
                    meta = table.Column<string>(type: "text", nullable: true),
                    summary = table.Column<string>(type: "text", nullable: true),
                    context = table.Column<string>(type: "text", nullable: true),
                    role = table.Column<string>(type: "text", nullable: true),
                    result = table.Column<string>(type: "text", nullable: true),
                    metrics = table.Column<string>(type: "text", nullable: true),
                    body = table.Column<string>(type: "text", nullable: true),
                    seo = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_case_study_translations", x => x.id);
                    table.ForeignKey(
                        name: "FK_case_study_translations_case_studies_case_study_id",
                        column: x => x.case_study_id,
                        principalTable: "case_studies",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "credit_entry_translations",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    credit_entry_id = table.Column<int>(type: "integer", nullable: false),
                    locale = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_credit_entry_translations", x => x.id);
                    table.ForeignKey(
                        name: "FK_credit_entry_translations_credit_entries_credit_entry_id",
                        column: x => x.credit_entry_id,
                        principalTable: "credit_entries",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "experiment_translations",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    experiment_id = table.Column<int>(type: "integer", nullable: false),
                    locale = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    purpose = table.Column<string>(type: "text", nullable: false),
                    body = table.Column<string>(type: "text", nullable: true),
                    seo = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_experiment_translations", x => x.id);
                    table.ForeignKey(
                        name: "FK_experiment_translations_experiments_experiment_id",
                        column: x => x.experiment_id,
                        principalTable: "experiments",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "language_translations",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    language_id = table.Column<int>(type: "integer", nullable: false),
                    locale = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_language_translations", x => x.id);
                    table.ForeignKey(
                        name: "FK_language_translations_languages_language_id",
                        column: x => x.language_id,
                        principalTable: "languages",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "resources",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    slug = table.Column<string>(type: "text", nullable: false),
                    public_id = table.Column<string>(type: "character varying(6)", maxLength: 6, nullable: false),
                    hidden = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    order = table.Column<int>(type: "integer", nullable: false),
                    type = table.Column<string>(type: "text", nullable: false),
                    language_id = table.Column<int>(type: "integer", nullable: true),
                    authors = table.Column<string>(type: "text", nullable: true),
                    organizations = table.Column<string>(type: "text", nullable: true),
                    published_date_iso = table.Column<DateOnly>(type: "date", nullable: true),
                    found_date_iso = table.Column<DateOnly>(type: "date", nullable: true),
                    consumption_state = table.Column<string>(type: "text", nullable: true),
                    rating = table.Column<string>(type: "text", nullable: true),
                    editorial_state = table.Column<string>(type: "text", nullable: true),
                    visibility = table.Column<string>(type: "text", nullable: true),
                    type_details = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_resources", x => x.id);
                    table.ForeignKey(
                        name: "FK_resources_languages_language_id",
                        column: x => x.language_id,
                        principalTable: "languages",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "nav_item_translations",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nav_item_id = table.Column<int>(type: "integer", nullable: false),
                    locale = table.Column<string>(type: "text", nullable: false),
                    label = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_nav_item_translations", x => x.id);
                    table.ForeignKey(
                        name: "FK_nav_item_translations_nav_items_nav_item_id",
                        column: x => x.nav_item_id,
                        principalTable: "nav_items",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "page_featured_case",
                columns: table => new
                {
                    page_id = table.Column<int>(type: "integer", nullable: false),
                    case_study_id = table.Column<int>(type: "integer", nullable: false),
                    order = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_page_featured_case", x => new { x.page_id, x.case_study_id });
                    table.ForeignKey(
                        name: "FK_page_featured_case_case_studies_case_study_id",
                        column: x => x.case_study_id,
                        principalTable: "case_studies",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_page_featured_case_pages_page_id",
                        column: x => x.page_id,
                        principalTable: "pages",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "page_translations",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    page_id = table.Column<int>(type: "integer", nullable: false),
                    locale = table.Column<string>(type: "text", nullable: false),
                    fields = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_page_translations", x => x.id);
                    table.ForeignKey(
                        name: "FK_page_translations_pages_page_id",
                        column: x => x.page_id,
                        principalTable: "pages",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "profile_translations",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    profile_id = table.Column<int>(type: "integer", nullable: false),
                    locale = table.Column<string>(type: "text", nullable: false),
                    title = table.Column<string>(type: "text", nullable: true),
                    location = table.Column<string>(type: "text", nullable: true),
                    birth_city = table.Column<string>(type: "text", nullable: true),
                    description = table.Column<string>(type: "text", nullable: true),
                    interests = table.Column<string>(type: "text", nullable: true),
                    learning = table.Column<string>(type: "text", nullable: true),
                    personal_interests = table.Column<string>(type: "text", nullable: true),
                    trajectory = table.Column<string>(type: "text", nullable: true),
                    milestones = table.Column<string>(type: "text", nullable: true),
                    fortunes = table.Column<string>(type: "text", nullable: true),
                    personal_facts = table.Column<string>(type: "text", nullable: true),
                    personal_things = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_profile_translations", x => x.id);
                    table.ForeignKey(
                        name: "FK_profile_translations_profiles_profile_id",
                        column: x => x.profile_id,
                        principalTable: "profiles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "page_featured_project",
                columns: table => new
                {
                    page_id = table.Column<int>(type: "integer", nullable: false),
                    project_id = table.Column<int>(type: "integer", nullable: false),
                    order = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_page_featured_project", x => new { x.page_id, x.project_id });
                    table.ForeignKey(
                        name: "FK_page_featured_project_pages_page_id",
                        column: x => x.page_id,
                        principalTable: "pages",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_page_featured_project_projects_project_id",
                        column: x => x.project_id,
                        principalTable: "projects",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "project_translations",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    project_id = table.Column<int>(type: "integer", nullable: false),
                    locale = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    purpose = table.Column<string>(type: "text", nullable: false),
                    problem = table.Column<string>(type: "text", nullable: true),
                    current_focus = table.Column<string>(type: "text", nullable: true),
                    status = table.Column<string>(type: "text", nullable: true),
                    metrics = table.Column<string>(type: "text", nullable: true),
                    body = table.Column<string>(type: "text", nullable: true),
                    seo = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_project_translations", x => x.id);
                    table.ForeignKey(
                        name: "FK_project_translations_projects_project_id",
                        column: x => x.project_id,
                        principalTable: "projects",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "reference_collection_translations",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    reference_collection_id = table.Column<int>(type: "integer", nullable: false),
                    locale = table.Column<string>(type: "text", nullable: false),
                    title = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    intro = table.Column<string>(type: "text", nullable: true),
                    seo = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_reference_collection_translations", x => x.id);
                    table.ForeignKey(
                        name: "FK_reference_collection_translations_reference_collections_ref~",
                        column: x => x.reference_collection_id,
                        principalTable: "reference_collections",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "content_relations",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    relation_type_id = table.Column<int>(type: "integer", nullable: false),
                    subject_type = table.Column<string>(type: "text", nullable: false),
                    subject_id = table.Column<int>(type: "integer", nullable: false),
                    object_type = table.Column<string>(type: "text", nullable: false),
                    object_id = table.Column<int>(type: "integer", nullable: false),
                    note = table.Column<string>(type: "text", nullable: true),
                    context = table.Column<string>(type: "text", nullable: true),
                    status = table.Column<string>(type: "text", nullable: true, defaultValue: "verified"),
                    visibility = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_content_relations", x => x.id);
                    table.ForeignKey(
                        name: "FK_content_relations_relation_types_relation_type_id",
                        column: x => x.relation_type_id,
                        principalTable: "relation_types",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "resume_languages",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    resume_id = table.Column<int>(type: "integer", nullable: false),
                    language_id = table.Column<int>(type: "integer", nullable: false),
                    proficiency = table.Column<string>(type: "text", nullable: true),
                    order = table.Column<int>(type: "integer", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_resume_languages", x => x.id);
                    table.ForeignKey(
                        name: "FK_resume_languages_languages_language_id",
                        column: x => x.language_id,
                        principalTable: "languages",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_resume_languages_resumes_resume_id",
                        column: x => x.resume_id,
                        principalTable: "resumes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "resume_selected_case",
                columns: table => new
                {
                    resume_id = table.Column<int>(type: "integer", nullable: false),
                    case_study_id = table.Column<int>(type: "integer", nullable: false),
                    order = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_resume_selected_case", x => new { x.resume_id, x.case_study_id });
                    table.ForeignKey(
                        name: "FK_resume_selected_case_case_studies_case_study_id",
                        column: x => x.case_study_id,
                        principalTable: "case_studies",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_resume_selected_case_resumes_resume_id",
                        column: x => x.resume_id,
                        principalTable: "resumes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "resume_translations",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    resume_id = table.Column<int>(type: "integer", nullable: false),
                    locale = table.Column<string>(type: "text", nullable: false),
                    summary = table.Column<string>(type: "text", nullable: true),
                    leadership = table.Column<string>(type: "text", nullable: true),
                    education = table.Column<string>(type: "text", nullable: true),
                    certificates = table.Column<string>(type: "text", nullable: true),
                    certifications = table.Column<string>(type: "text", nullable: true),
                    publications = table.Column<string>(type: "text", nullable: true),
                    recommendations = table.Column<string>(type: "text", nullable: true),
                    technical_productions = table.Column<string>(type: "text", nullable: true),
                    events = table.Column<string>(type: "text", nullable: true),
                    awards = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_resume_translations", x => x.id);
                    table.ForeignKey(
                        name: "FK_resume_translations_resumes_resume_id",
                        column: x => x.resume_id,
                        principalTable: "resumes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "contact_profiles",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    site_settings_id = table.Column<int>(type: "integer", nullable: false),
                    platform = table.Column<string>(type: "text", nullable: false),
                    label = table.Column<string>(type: "text", nullable: true),
                    url = table.Column<string>(type: "text", nullable: false),
                    order = table.Column<int>(type: "integer", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_contact_profiles", x => x.id);
                    table.ForeignKey(
                        name: "FK_contact_profiles_site_settings_site_settings_id",
                        column: x => x.site_settings_id,
                        principalTable: "site_settings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "site_settings_translations",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    site_settings_id = table.Column<int>(type: "integer", nullable: false),
                    locale = table.Column<string>(type: "text", nullable: false),
                    copyright_template = table.Column<string>(type: "text", nullable: true),
                    maintenance_eyebrow = table.Column<string>(type: "text", nullable: true),
                    maintenance_title = table.Column<string>(type: "text", nullable: true),
                    maintenance_description = table.Column<string>(type: "text", nullable: true),
                    seo = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_site_settings_translations", x => x.id);
                    table.ForeignKey(
                        name: "FK_site_settings_translations_site_settings_site_settings_id",
                        column: x => x.site_settings_id,
                        principalTable: "site_settings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "snippet_files",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    snippet_id = table.Column<int>(type: "integer", nullable: false),
                    path = table.Column<string>(type: "text", nullable: false),
                    language = table.Column<string>(type: "text", nullable: true),
                    content = table.Column<string>(type: "text", nullable: false),
                    order = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_snippet_files", x => x.id);
                    table.ForeignKey(
                        name: "FK_snippet_files_snippets_snippet_id",
                        column: x => x.snippet_id,
                        principalTable: "snippets",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "snippet_translations",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    snippet_id = table.Column<int>(type: "integer", nullable: false),
                    locale = table.Column<string>(type: "text", nullable: false),
                    title = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_snippet_translations", x => x.id);
                    table.ForeignKey(
                        name: "FK_snippet_translations_snippets_snippet_id",
                        column: x => x.snippet_id,
                        principalTable: "snippets",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "case_study_technology",
                columns: table => new
                {
                    case_study_id = table.Column<int>(type: "integer", nullable: false),
                    technology_id = table.Column<int>(type: "integer", nullable: false),
                    order = table.Column<int>(type: "integer", nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_case_study_technology", x => new { x.case_study_id, x.technology_id });
                    table.ForeignKey(
                        name: "FK_case_study_technology_case_studies_case_study_id",
                        column: x => x.case_study_id,
                        principalTable: "case_studies",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_case_study_technology_technologies_technology_id",
                        column: x => x.technology_id,
                        principalTable: "technologies",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "experiment_technology",
                columns: table => new
                {
                    experiment_id = table.Column<int>(type: "integer", nullable: false),
                    technology_id = table.Column<int>(type: "integer", nullable: false),
                    order = table.Column<int>(type: "integer", nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_experiment_technology", x => new { x.experiment_id, x.technology_id });
                    table.ForeignKey(
                        name: "FK_experiment_technology_experiments_experiment_id",
                        column: x => x.experiment_id,
                        principalTable: "experiments",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_experiment_technology_technologies_technology_id",
                        column: x => x.technology_id,
                        principalTable: "technologies",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "project_technology",
                columns: table => new
                {
                    project_id = table.Column<int>(type: "integer", nullable: false),
                    technology_id = table.Column<int>(type: "integer", nullable: false),
                    order = table.Column<int>(type: "integer", nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_project_technology", x => new { x.project_id, x.technology_id });
                    table.ForeignKey(
                        name: "FK_project_technology_projects_project_id",
                        column: x => x.project_id,
                        principalTable: "projects",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_project_technology_technologies_technology_id",
                        column: x => x.technology_id,
                        principalTable: "technologies",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "technology_translations",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    technology_id = table.Column<int>(type: "integer", nullable: false),
                    locale = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_technology_translations", x => x.id);
                    table.ForeignKey(
                        name: "FK_technology_translations_technologies_technology_id",
                        column: x => x.technology_id,
                        principalTable: "technologies",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "resume_skills",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    resume_id = table.Column<int>(type: "integer", nullable: false),
                    order = table.Column<int>(type: "integer", nullable: true),
                    topic_id = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_resume_skills", x => x.id);
                    table.ForeignKey(
                        name: "FK_resume_skills_resumes_resume_id",
                        column: x => x.resume_id,
                        principalTable: "resumes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_resume_skills_topics_topic_id",
                        column: x => x.topic_id,
                        principalTable: "topics",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "topic_translations",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    topic_id = table.Column<int>(type: "integer", nullable: false),
                    locale = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_topic_translations", x => x.id);
                    table.ForeignKey(
                        name: "FK_topic_translations_topics_topic_id",
                        column: x => x.topic_id,
                        principalTable: "topics",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "topicables",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    topic_id = table.Column<int>(type: "integer", nullable: false),
                    topicable_type = table.Column<string>(type: "text", nullable: false),
                    topicable_id = table.Column<int>(type: "integer", nullable: false),
                    role = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_topicables", x => x.id);
                    table.ForeignKey(
                        name: "FK_topicables_topics_topic_id",
                        column: x => x.topic_id,
                        principalTable: "topics",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "page_featured_writing",
                columns: table => new
                {
                    page_id = table.Column<int>(type: "integer", nullable: false),
                    writing_id = table.Column<int>(type: "integer", nullable: false),
                    order = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_page_featured_writing", x => new { x.page_id, x.writing_id });
                    table.ForeignKey(
                        name: "FK_page_featured_writing_pages_page_id",
                        column: x => x.page_id,
                        principalTable: "pages",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_page_featured_writing_writings_writing_id",
                        column: x => x.writing_id,
                        principalTable: "writings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "writing_translations",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    writing_id = table.Column<int>(type: "integer", nullable: false),
                    locale = table.Column<string>(type: "text", nullable: false),
                    title = table.Column<string>(type: "text", nullable: false),
                    excerpt = table.Column<string>(type: "text", nullable: true),
                    reading_time = table.Column<string>(type: "text", nullable: true),
                    body = table.Column<string>(type: "text", nullable: true),
                    seo = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_writing_translations", x => x.id);
                    table.ForeignKey(
                        name: "FK_writing_translations_writings_writing_id",
                        column: x => x.writing_id,
                        principalTable: "writings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "reference_collection_item",
                columns: table => new
                {
                    reference_collection_id = table.Column<int>(type: "integer", nullable: false),
                    resource_id = table.Column<int>(type: "integer", nullable: false),
                    note = table.Column<string>(type: "text", nullable: true),
                    order = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_reference_collection_item", x => new { x.reference_collection_id, x.resource_id });
                    table.ForeignKey(
                        name: "FK_reference_collection_item_reference_collections_reference_c~",
                        column: x => x.reference_collection_id,
                        principalTable: "reference_collections",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_reference_collection_item_resources_resource_id",
                        column: x => x.resource_id,
                        principalTable: "resources",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "resource_identifiers",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    resource_id = table.Column<int>(type: "integer", nullable: false),
                    kind = table.Column<string>(type: "text", nullable: false),
                    value = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_resource_identifiers", x => x.id);
                    table.ForeignKey(
                        name: "FK_resource_identifiers_resources_resource_id",
                        column: x => x.resource_id,
                        principalTable: "resources",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "resource_links",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    resource_id = table.Column<int>(type: "integer", nullable: false),
                    url = table.Column<string>(type: "text", nullable: false),
                    label = table.Column<string>(type: "text", nullable: true),
                    platform = table.Column<string>(type: "text", nullable: true),
                    purpose = table.Column<string>(type: "text", nullable: true),
                    is_primary = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    is_free = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    language_id = table.Column<int>(type: "integer", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_resource_links", x => x.id);
                    table.ForeignKey(
                        name: "FK_resource_links_languages_language_id",
                        column: x => x.language_id,
                        principalTable: "languages",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_resource_links_resources_resource_id",
                        column: x => x.resource_id,
                        principalTable: "resources",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "resource_translations",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    resource_id = table.Column<int>(type: "integer", nullable: false),
                    locale = table.Column<string>(type: "text", nullable: false),
                    title = table.Column<string>(type: "text", nullable: false),
                    alternative_title = table.Column<string>(type: "text", nullable: true),
                    description = table.Column<string>(type: "text", nullable: true),
                    personal_note = table.Column<string>(type: "text", nullable: true),
                    reason_found = table.Column<string>(type: "text", nullable: true),
                    seo = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_resource_translations", x => x.id);
                    table.ForeignKey(
                        name: "FK_resource_translations_resources_resource_id",
                        column: x => x.resource_id,
                        principalTable: "resources",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "resume_skill_technology",
                columns: table => new
                {
                    resume_skill_id = table.Column<int>(type: "integer", nullable: false),
                    technology_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_resume_skill_technology", x => new { x.resume_skill_id, x.technology_id });
                    table.ForeignKey(
                        name: "FK_resume_skill_technology_resume_skills_resume_skill_id",
                        column: x => x.resume_skill_id,
                        principalTable: "resume_skills",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_resume_skill_technology_technologies_technology_id",
                        column: x => x.technology_id,
                        principalTable: "technologies",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "audit_log_auditable_type_auditable_id_index",
                table: "audit_log",
                columns: new[] { "auditable_type", "auditable_id" });

            migrationBuilder.CreateIndex(
                name: "case_studies_public_id_unique",
                table: "case_studies",
                column: "public_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "case_studies_slug_unique",
                table: "case_studies",
                column: "slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "case_study_translations_case_study_id_locale_unique",
                table: "case_study_translations",
                columns: new[] { "case_study_id", "locale" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "content_relations_object_type_object_id_index",
                table: "content_relations",
                columns: new[] { "object_type", "object_id" });

            migrationBuilder.CreateIndex(
                name: "content_relations_subject_type_subject_id_index",
                table: "content_relations",
                columns: new[] { "subject_type", "subject_id" });

            migrationBuilder.CreateIndex(
                name: "credit_entry_translations_credit_entry_id_locale_unique",
                table: "credit_entry_translations",
                columns: new[] { "credit_entry_id", "locale" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "experiment_translations_experiment_id_locale_unique",
                table: "experiment_translations",
                columns: new[] { "experiment_id", "locale" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "experiments_public_id_unique",
                table: "experiments",
                column: "public_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "experiments_slug_unique",
                table: "experiments",
                column: "slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "language_translations_language_id_locale_unique",
                table: "language_translations",
                columns: new[] { "language_id", "locale" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "languages_slug_unique",
                table: "languages",
                column: "slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "nav_item_translations_nav_item_id_locale_unique",
                table: "nav_item_translations",
                columns: new[] { "nav_item_id", "locale" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "page_translations_page_id_locale_unique",
                table: "page_translations",
                columns: new[] { "page_id", "locale" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "pages_slug_unique",
                table: "pages",
                column: "slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "profile_translations_profile_id_locale_unique",
                table: "profile_translations",
                columns: new[] { "profile_id", "locale" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "project_translations_project_id_locale_unique",
                table: "project_translations",
                columns: new[] { "project_id", "locale" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "projects_public_id_unique",
                table: "projects",
                column: "public_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "projects_slug_unique",
                table: "projects",
                column: "slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "reference_collection_translations_reference_collection_id_locale_unique",
                table: "reference_collection_translations",
                columns: new[] { "reference_collection_id", "locale" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "reference_collections_public_id_unique",
                table: "reference_collections",
                column: "public_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "reference_collections_slug_unique",
                table: "reference_collections",
                column: "slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "relation_types_key_unique",
                table: "relation_types",
                column: "key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "resource_translations_resource_id_locale_unique",
                table: "resource_translations",
                columns: new[] { "resource_id", "locale" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "resources_public_id_unique",
                table: "resources",
                column: "public_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "resources_slug_unique",
                table: "resources",
                column: "slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "resume_translations_resume_id_locale_unique",
                table: "resume_translations",
                columns: new[] { "resume_id", "locale" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "site_settings_translations_site_settings_id_locale_unique",
                table: "site_settings_translations",
                columns: new[] { "site_settings_id", "locale" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "snippet_translations_snippet_id_locale_unique",
                table: "snippet_translations",
                columns: new[] { "snippet_id", "locale" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "snippets_public_id_unique",
                table: "snippets",
                column: "public_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "snippets_slug_unique",
                table: "snippets",
                column: "slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "technologies_public_id_unique",
                table: "technologies",
                column: "public_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "technologies_slug_unique",
                table: "technologies",
                column: "slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "technology_translations_technology_id_locale_unique",
                table: "technology_translations",
                columns: new[] { "technology_id", "locale" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "topic_translations_topic_id_locale_unique",
                table: "topic_translations",
                columns: new[] { "topic_id", "locale" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "topicables_topic_id_topicable_type_topicable_id_unique",
                table: "topicables",
                columns: new[] { "topic_id", "topicable_type", "topicable_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "topicables_topicable_type_topicable_id_index",
                table: "topicables",
                columns: new[] { "topicable_type", "topicable_id" });

            migrationBuilder.CreateIndex(
                name: "topics_public_id_unique",
                table: "topics",
                column: "public_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "topics_slug_unique",
                table: "topics",
                column: "slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "writing_translations_writing_id_locale_unique",
                table: "writing_translations",
                columns: new[] { "writing_id", "locale" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "writings_public_id_unique",
                table: "writings",
                column: "public_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "writings_slug_unique",
                table: "writings",
                column: "slug",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "audit_log");

            migrationBuilder.DropTable(
                name: "audit_requests");

            migrationBuilder.DropTable(
                name: "case_study_technology");

            migrationBuilder.DropTable(
                name: "case_study_translations");

            migrationBuilder.DropTable(
                name: "contact_profiles");

            migrationBuilder.DropTable(
                name: "content_relations");

            migrationBuilder.DropTable(
                name: "content_revisions");

            migrationBuilder.DropTable(
                name: "credit_entry_translations");

            migrationBuilder.DropTable(
                name: "experiment_technology");

            migrationBuilder.DropTable(
                name: "experiment_translations");

            migrationBuilder.DropTable(
                name: "language_translations");

            migrationBuilder.DropTable(
                name: "nav_item_translations");

            migrationBuilder.DropTable(
                name: "page_featured_case");

            migrationBuilder.DropTable(
                name: "page_featured_project");

            migrationBuilder.DropTable(
                name: "page_featured_writing");

            migrationBuilder.DropTable(
                name: "page_translations");

            migrationBuilder.DropTable(
                name: "profile_translations");

            migrationBuilder.DropTable(
                name: "project_technology");

            migrationBuilder.DropTable(
                name: "project_translations");

            migrationBuilder.DropTable(
                name: "reference_collection_item");

            migrationBuilder.DropTable(
                name: "reference_collection_translations");

            migrationBuilder.DropTable(
                name: "resource_identifiers");

            migrationBuilder.DropTable(
                name: "resource_links");

            migrationBuilder.DropTable(
                name: "resource_translations");

            migrationBuilder.DropTable(
                name: "resume_languages");

            migrationBuilder.DropTable(
                name: "resume_selected_case");

            migrationBuilder.DropTable(
                name: "resume_skill_technology");

            migrationBuilder.DropTable(
                name: "resume_translations");

            migrationBuilder.DropTable(
                name: "site_settings_translations");

            migrationBuilder.DropTable(
                name: "snippet_files");

            migrationBuilder.DropTable(
                name: "snippet_translations");

            migrationBuilder.DropTable(
                name: "technology_translations");

            migrationBuilder.DropTable(
                name: "topic_translations");

            migrationBuilder.DropTable(
                name: "topicables");

            migrationBuilder.DropTable(
                name: "writing_translations");

            migrationBuilder.DropTable(
                name: "relation_types");

            migrationBuilder.DropTable(
                name: "credit_entries");

            migrationBuilder.DropTable(
                name: "experiments");

            migrationBuilder.DropTable(
                name: "nav_items");

            migrationBuilder.DropTable(
                name: "pages");

            migrationBuilder.DropTable(
                name: "profiles");

            migrationBuilder.DropTable(
                name: "projects");

            migrationBuilder.DropTable(
                name: "reference_collections");

            migrationBuilder.DropTable(
                name: "resources");

            migrationBuilder.DropTable(
                name: "case_studies");

            migrationBuilder.DropTable(
                name: "resume_skills");

            migrationBuilder.DropTable(
                name: "site_settings");

            migrationBuilder.DropTable(
                name: "snippets");

            migrationBuilder.DropTable(
                name: "technologies");

            migrationBuilder.DropTable(
                name: "writings");

            migrationBuilder.DropTable(
                name: "languages");

            migrationBuilder.DropTable(
                name: "resumes");

            migrationBuilder.DropTable(
                name: "topics");
        }
    }
}
