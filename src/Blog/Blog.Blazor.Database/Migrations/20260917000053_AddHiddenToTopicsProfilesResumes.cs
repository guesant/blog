using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Blog.Blazor.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddHiddenToTopicsProfilesResumes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "hidden",
                table: "topics",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "hidden",
                table: "resumes",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "hidden",
                table: "profiles",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "hidden",
                table: "topics");

            migrationBuilder.DropColumn(
                name: "hidden",
                table: "resumes");

            migrationBuilder.DropColumn(
                name: "hidden",
                table: "profiles");
        }
    }
}
