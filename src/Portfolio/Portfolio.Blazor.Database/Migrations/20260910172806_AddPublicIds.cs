using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolio.Blazor.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddPublicIds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "public_id",
                table: "writings",
                type: "TEXT",
                maxLength: 6,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "public_id",
                table: "topics",
                type: "TEXT",
                maxLength: 6,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "public_id",
                table: "technologies",
                type: "TEXT",
                maxLength: 6,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "public_id",
                table: "snippets",
                type: "TEXT",
                maxLength: 6,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "public_id",
                table: "resources",
                type: "TEXT",
                maxLength: 6,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "public_id",
                table: "reference_collections",
                type: "TEXT",
                maxLength: 6,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "public_id",
                table: "projects",
                type: "TEXT",
                maxLength: 6,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "public_id",
                table: "experiments",
                type: "TEXT",
                maxLength: 6,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "public_id",
                table: "case_studies",
                type: "TEXT",
                maxLength: 6,
                nullable: false,
                defaultValue: "");

            // IMPORTANT: every existing row needs a unique public id before the unique indexes below
            // are created, or the migration fails on the empty default; the two extra passes re-roll
            // any random collision.
            migrationBuilder.Sql("UPDATE writings SET public_id = lower(hex(randomblob(3))) WHERE public_id = '';");
            migrationBuilder.Sql("UPDATE writings SET public_id = lower(hex(randomblob(3))) WHERE rowid NOT IN (SELECT min(rowid) FROM writings GROUP BY public_id);");
            migrationBuilder.Sql("UPDATE writings SET public_id = lower(hex(randomblob(3))) WHERE rowid NOT IN (SELECT min(rowid) FROM writings GROUP BY public_id);");
            migrationBuilder.Sql("UPDATE topics SET public_id = lower(hex(randomblob(3))) WHERE public_id = '';");
            migrationBuilder.Sql("UPDATE topics SET public_id = lower(hex(randomblob(3))) WHERE rowid NOT IN (SELECT min(rowid) FROM topics GROUP BY public_id);");
            migrationBuilder.Sql("UPDATE topics SET public_id = lower(hex(randomblob(3))) WHERE rowid NOT IN (SELECT min(rowid) FROM topics GROUP BY public_id);");
            migrationBuilder.Sql("UPDATE technologies SET public_id = lower(hex(randomblob(3))) WHERE public_id = '';");
            migrationBuilder.Sql("UPDATE technologies SET public_id = lower(hex(randomblob(3))) WHERE rowid NOT IN (SELECT min(rowid) FROM technologies GROUP BY public_id);");
            migrationBuilder.Sql("UPDATE technologies SET public_id = lower(hex(randomblob(3))) WHERE rowid NOT IN (SELECT min(rowid) FROM technologies GROUP BY public_id);");
            migrationBuilder.Sql("UPDATE snippets SET public_id = lower(hex(randomblob(3))) WHERE public_id = '';");
            migrationBuilder.Sql("UPDATE snippets SET public_id = lower(hex(randomblob(3))) WHERE rowid NOT IN (SELECT min(rowid) FROM snippets GROUP BY public_id);");
            migrationBuilder.Sql("UPDATE snippets SET public_id = lower(hex(randomblob(3))) WHERE rowid NOT IN (SELECT min(rowid) FROM snippets GROUP BY public_id);");
            migrationBuilder.Sql("UPDATE resources SET public_id = lower(hex(randomblob(3))) WHERE public_id = '';");
            migrationBuilder.Sql("UPDATE resources SET public_id = lower(hex(randomblob(3))) WHERE rowid NOT IN (SELECT min(rowid) FROM resources GROUP BY public_id);");
            migrationBuilder.Sql("UPDATE resources SET public_id = lower(hex(randomblob(3))) WHERE rowid NOT IN (SELECT min(rowid) FROM resources GROUP BY public_id);");
            migrationBuilder.Sql("UPDATE reference_collections SET public_id = lower(hex(randomblob(3))) WHERE public_id = '';");
            migrationBuilder.Sql("UPDATE reference_collections SET public_id = lower(hex(randomblob(3))) WHERE rowid NOT IN (SELECT min(rowid) FROM reference_collections GROUP BY public_id);");
            migrationBuilder.Sql("UPDATE reference_collections SET public_id = lower(hex(randomblob(3))) WHERE rowid NOT IN (SELECT min(rowid) FROM reference_collections GROUP BY public_id);");
            migrationBuilder.Sql("UPDATE projects SET public_id = lower(hex(randomblob(3))) WHERE public_id = '';");
            migrationBuilder.Sql("UPDATE projects SET public_id = lower(hex(randomblob(3))) WHERE rowid NOT IN (SELECT min(rowid) FROM projects GROUP BY public_id);");
            migrationBuilder.Sql("UPDATE projects SET public_id = lower(hex(randomblob(3))) WHERE rowid NOT IN (SELECT min(rowid) FROM projects GROUP BY public_id);");
            migrationBuilder.Sql("UPDATE experiments SET public_id = lower(hex(randomblob(3))) WHERE public_id = '';");
            migrationBuilder.Sql("UPDATE experiments SET public_id = lower(hex(randomblob(3))) WHERE rowid NOT IN (SELECT min(rowid) FROM experiments GROUP BY public_id);");
            migrationBuilder.Sql("UPDATE experiments SET public_id = lower(hex(randomblob(3))) WHERE rowid NOT IN (SELECT min(rowid) FROM experiments GROUP BY public_id);");
            migrationBuilder.Sql("UPDATE case_studies SET public_id = lower(hex(randomblob(3))) WHERE public_id = '';");
            migrationBuilder.Sql("UPDATE case_studies SET public_id = lower(hex(randomblob(3))) WHERE rowid NOT IN (SELECT min(rowid) FROM case_studies GROUP BY public_id);");
            migrationBuilder.Sql("UPDATE case_studies SET public_id = lower(hex(randomblob(3))) WHERE rowid NOT IN (SELECT min(rowid) FROM case_studies GROUP BY public_id);");

            migrationBuilder.CreateIndex(
                name: "writings_public_id_unique",
                table: "writings",
                column: "public_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "topics_public_id_unique",
                table: "topics",
                column: "public_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "technologies_public_id_unique",
                table: "technologies",
                column: "public_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "snippets_public_id_unique",
                table: "snippets",
                column: "public_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "resources_public_id_unique",
                table: "resources",
                column: "public_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "reference_collections_public_id_unique",
                table: "reference_collections",
                column: "public_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "projects_public_id_unique",
                table: "projects",
                column: "public_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "experiments_public_id_unique",
                table: "experiments",
                column: "public_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "case_studies_public_id_unique",
                table: "case_studies",
                column: "public_id",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "writings_public_id_unique",
                table: "writings");

            migrationBuilder.DropIndex(
                name: "topics_public_id_unique",
                table: "topics");

            migrationBuilder.DropIndex(
                name: "technologies_public_id_unique",
                table: "technologies");

            migrationBuilder.DropIndex(
                name: "snippets_public_id_unique",
                table: "snippets");

            migrationBuilder.DropIndex(
                name: "resources_public_id_unique",
                table: "resources");

            migrationBuilder.DropIndex(
                name: "reference_collections_public_id_unique",
                table: "reference_collections");

            migrationBuilder.DropIndex(
                name: "projects_public_id_unique",
                table: "projects");

            migrationBuilder.DropIndex(
                name: "experiments_public_id_unique",
                table: "experiments");

            migrationBuilder.DropIndex(
                name: "case_studies_public_id_unique",
                table: "case_studies");

            migrationBuilder.DropColumn(
                name: "public_id",
                table: "writings");

            migrationBuilder.DropColumn(
                name: "public_id",
                table: "topics");

            migrationBuilder.DropColumn(
                name: "public_id",
                table: "technologies");

            migrationBuilder.DropColumn(
                name: "public_id",
                table: "snippets");

            migrationBuilder.DropColumn(
                name: "public_id",
                table: "resources");

            migrationBuilder.DropColumn(
                name: "public_id",
                table: "reference_collections");

            migrationBuilder.DropColumn(
                name: "public_id",
                table: "projects");

            migrationBuilder.DropColumn(
                name: "public_id",
                table: "experiments");

            migrationBuilder.DropColumn(
                name: "public_id",
                table: "case_studies");
        }
    }
}
